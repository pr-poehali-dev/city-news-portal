import json
import psycopg2
from datetime import datetime
from typing import Dict, Any
import os
import boto3
from botocore.exceptions import ClientError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate and upload sitemap.xml to S3/CDN storage
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: Success status with sitemap URL
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    s3_endpoint = os.environ.get('S3_ENDPOINT_URL')
    s3_access_key = os.environ.get('S3_ACCESS_KEY_ID')
    s3_secret_key = os.environ.get('S3_SECRET_ACCESS_KEY')
    s3_bucket = os.environ.get('S3_BUCKET_NAME')
    
    if not all([s3_endpoint, s3_access_key, s3_secret_key, s3_bucket]):
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'S3 credentials not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("SELECT id, updated_at FROM news WHERE status = 'published' ORDER BY published_at DESC")
    news_items = cur.fetchall()
    
    cur.execute("SELECT id, updated_at FROM memory_articles WHERE is_published = true ORDER BY event_date DESC")
    memory_items = cur.fetchall()
    
    cur.close()
    conn.close()
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    sitemap_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Главная страница -->
    <url>
        <loc>https://gorodgovorit.ru/</loc>
        <lastmod>{today}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Статические страницы -->
    <url>
        <loc>https://gorodgovorit.ru/places</loc>
        <lastmod>{today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://gorodgovorit.ru/places/map</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://gorodgovorit.ru/about</loc>
        <lastmod>{today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://gorodgovorit.ru/contacts</loc>
        <lastmod>{today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Новости -->'''.format(today=today)
    
    for news_id, updated_at in news_items:
        lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else today
        sitemap_xml += f'''
    <url>
        <loc>https://gorodgovorit.ru/news/{news_id}</loc>
        <lastmod>{lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>'''
    
    sitemap_xml += '''
    
    <!-- Память города -->'''
    
    for memory_id, updated_at in memory_items:
        lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else today
        sitemap_xml += f'''
    <url>
        <loc>https://gorodgovorit.ru/memory/{memory_id}</loc>
        <lastmod>{lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>'''
    
    sitemap_xml += '''
    
</urlset>'''
    
    s3_client = boto3.client(
        's3',
        endpoint_url=s3_endpoint,
        aws_access_key_id=s3_access_key,
        aws_secret_access_key=s3_secret_key
    )
    
    try:
        s3_client.put_object(
            Bucket=s3_bucket,
            Key='sitemap.xml',
            Body=sitemap_xml.encode('utf-8'),
            ContentType='application/xml',
            ACL='public-read'
        )
        
        sitemap_url = f"{s3_endpoint.rstrip('/')}/{s3_bucket}/sitemap.xml"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': 'Sitemap uploaded successfully',
                'url': sitemap_url
            })
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Failed to upload sitemap: {str(e)}'})
        }
