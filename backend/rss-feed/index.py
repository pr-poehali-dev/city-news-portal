import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime
from html import escape

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate RSS feed for Yandex.News
    Args: event - dict with httpMethod
          context - object with attributes: request_id
    Returns: RSS XML feed
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
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT id, title, excerpt, content, category, image_url, 
                   published_at, updated_at, tags
            FROM news 
            WHERE status = 'published' 
            ORDER BY published_at DESC 
            LIMIT 50
        ''')
        news_items = cur.fetchall()
    
    conn.close()
    
    base_url = 'https://ggkrasnodar.ru'
    
    rss_items = []
    for item in news_items:
        pub_date = item.get('published_at') or item.get('updated_at') or datetime.now()
        if isinstance(pub_date, str):
            pub_date = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
        
        tags = item.get('tags') or []
        category = item.get('category', 'Новости')
        if tags and 'СВО' in tags:
            category = 'СВО'
        
        rss_item = f'''
        <item>
            <title>{escape(item['title'])}</title>
            <link>{base_url}/news/{item['id']}</link>
            <guid>{base_url}/news/{item['id']}</guid>
            <pubDate>{pub_date.strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
            <category>{escape(category)}</category>
            <description>{escape(item.get('excerpt', ''))}</description>
            {'<enclosure url="' + escape(item['image_url']) + '" type="image/jpeg"/>' if item.get('image_url') else ''}
        </item>'''
        rss_items.append(rss_item)
    
    now = datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000')
    
    rss_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
        <title>Город говорит: Краснодар</title>
        <link>{base_url}</link>
        <description>Актуальные новости и события Краснодара</description>
        <language>ru</language>
        <lastBuildDate>{now}</lastBuildDate>
        {''.join(rss_items)}
    </channel>
</rss>'''
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
        },
        'isBase64Encoded': False,
        'body': rss_xml
    }