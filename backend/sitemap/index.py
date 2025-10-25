import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate dynamic sitemap.xml with all news articles and pages
    Args: event with httpMethod
          context with request_id
    Returns: XML sitemap response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get all published news
        cursor.execute("""
            SELECT id, created_at, updated_at 
            FROM news 
            WHERE is_published = true 
            ORDER BY created_at DESC
        """)
        news_articles = cursor.fetchall()
        
        # Get all published memory articles
        cursor.execute("""
            SELECT id, created_at 
            FROM memory_articles 
            WHERE is_published = true 
            ORDER BY created_at DESC
        """)
        memory_articles = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Build XML sitemap
        base_url = 'https://ggkrasnodar.ru'
        xml_parts = []
        
        xml_parts.append('<?xml version="1.0" encoding="UTF-8"?>')
        xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        
        # Main pages
        static_pages = [
            {'loc': f'{base_url}/', 'changefreq': 'hourly', 'priority': '1.0'},
            {'loc': f'{base_url}/places', 'changefreq': 'daily', 'priority': '0.8'},
            {'loc': f'{base_url}/places/map', 'changefreq': 'daily', 'priority': '0.7'},
            {'loc': f'{base_url}/about', 'changefreq': 'monthly', 'priority': '0.5'},
            {'loc': f'{base_url}/contacts', 'changefreq': 'monthly', 'priority': '0.5'},
        ]
        
        for page in static_pages:
            xml_parts.append('  <url>')
            xml_parts.append(f'    <loc>{page["loc"]}</loc>')
            xml_parts.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
            xml_parts.append(f'    <priority>{page["priority"]}</priority>')
            xml_parts.append('  </url>')
        
        # News articles
        for article in news_articles:
            lastmod = article.get('updated_at') or article.get('created_at')
            if lastmod:
                lastmod_str = lastmod.strftime('%Y-%m-%d') if hasattr(lastmod, 'strftime') else str(lastmod).split('T')[0]
            else:
                lastmod_str = datetime.now().strftime('%Y-%m-%d')
            
            xml_parts.append('  <url>')
            xml_parts.append(f'    <loc>{base_url}/news/{article["id"]}</loc>')
            xml_parts.append(f'    <lastmod>{lastmod_str}</lastmod>')
            xml_parts.append('    <changefreq>weekly</changefreq>')
            xml_parts.append('    <priority>0.7</priority>')
            xml_parts.append('  </url>')
        
        # Memory articles
        for article in memory_articles:
            created = article.get('created_at')
            if created:
                lastmod_str = created.strftime('%Y-%m-%d') if hasattr(created, 'strftime') else str(created).split('T')[0]
            else:
                lastmod_str = datetime.now().strftime('%Y-%m-%d')
            
            xml_parts.append('  <url>')
            xml_parts.append(f'    <loc>{base_url}/memory/{article["id"]}</loc>')
            xml_parts.append(f'    <lastmod>{lastmod_str}</lastmod>')
            xml_parts.append('    <changefreq>monthly</changefreq>')
            xml_parts.append('    <priority>0.6</priority>')
            xml_parts.append('  </url>')
        
        xml_parts.append('</urlset>')
        
        sitemap_xml = '\n'.join(xml_parts)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': sitemap_xml,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
