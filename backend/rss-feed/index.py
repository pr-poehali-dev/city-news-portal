import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime
from html import escape
import hashlib

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate RSS feeds for Yandex.News and Yandex.Dzen
    Args: event - dict with httpMethod, queryStringParameters (feed_type: news or dzen)
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
    
    params = event.get('queryStringParameters') or {}
    feed_type = params.get('feed_type', 'news')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT id, title, excerpt, content, category, image_url, 
                   published_at, updated_at, tags, is_svo, is_showbiz, keywords
            FROM news 
            WHERE status = 'published' 
            ORDER BY published_at DESC 
            LIMIT 50
        ''')
        news_items = cur.fetchall()
    
    conn.close()
    
    base_url = 'https://ggkrasnodar.ru'
    
    if feed_type == 'dzen':
        rss_xml = generate_dzen_feed(news_items, base_url)
    else:
        rss_xml = generate_news_feed(news_items, base_url)
    
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

def generate_news_feed(news_items, base_url):
    rss_items = []
    for item in news_items:
        pub_date = item.get('published_at') or item.get('updated_at') or datetime.now()
        if isinstance(pub_date, str):
            pub_date = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
        
        tags = item.get('tags') or []
        category = item.get('category', 'Новости')
        
        if item.get('is_svo'):
            category = 'СВО'
        elif item.get('is_showbiz'):
            category = 'Шоубизнес'
        elif tags and 'СВО' in tags:
            category = 'СВО'
        
        keywords = item.get('keywords', '')
        keyword_tags = ''
        if keywords:
            kw_list = [kw.strip() for kw in keywords.split(',') if kw.strip()]
            keyword_tags = ''.join(f'<yandex:full-text>{escape(kw)}</yandex:full-text>' for kw in kw_list)
        
        rss_item = f'''
        <item>
            <title>{escape(item['title'])}</title>
            <link>{base_url}/news/{item['id']}</link>
            <guid>{base_url}/news/{item['id']}</guid>
            <pubDate>{pub_date.strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
            <category>{escape(category)}</category>
            <description>{escape(item.get('excerpt', ''))}</description>
            {keyword_tags}
            {'<enclosure url="' + escape(item['image_url']) + '" type="image/jpeg"/>' if item.get('image_url') else ''}
        </item>'''
        rss_items.append(rss_item)
    
    now = datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000')
    
    return f'''<?xml version="1.0" encoding="UTF-8"?>
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

def format_content_for_dzen(content: str, image_url: str = None) -> str:
    formatted = ''
    
    if image_url:
        formatted += f'<figure><img src="{escape(image_url)}"/></figure>'
    
    if content:
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            para = para.strip()
            if para:
                if para.startswith('!['):
                    img_start = para.find('](')
                    img_end = para.find(')', img_start)
                    if img_start > 0 and img_end > 0:
                        img_url = para[img_start + 2:img_end]
                        formatted += f'<figure><img src="{escape(img_url)}"/></figure>'
                elif para.startswith('#'):
                    level = len(para) - len(para.lstrip('#'))
                    text = para.lstrip('#').strip()
                    formatted += f'<h{min(level, 4)}>{escape(text)}</h{min(level, 4)}>'
                else:
                    para = para.replace('**', '<b>').replace('**', '</b>')
                    para = para.replace('*', '<i>').replace('*', '</i>')
                    formatted += f'<p>{para}</p>'
    
    return formatted

def generate_dzen_feed(news_items, base_url):
    rss_items = []
    for item in news_items:
        pub_date = item.get('published_at') or item.get('updated_at') or datetime.now()
        if isinstance(pub_date, str):
            pub_date = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
        
        rfc822_date = pub_date.strftime('%a, %d %b %Y %H:%M:%S +0300')
        
        guid = hashlib.md5(f"{base_url}/news/{item['id']}".encode()).hexdigest()
        
        category_tags = ['format-article', 'index', 'comment-all']
        
        content_encoded = format_content_for_dzen(
            item.get('content', ''), 
            item.get('image_url')
        )
        
        if not content_encoded or len(content_encoded) < 300:
            full_content = f"<p>{escape(item.get('excerpt', ''))}</p>"
            if item.get('content'):
                full_content += format_content_for_dzen(item.get('content', ''))
            content_encoded = full_content
        
        title_in_content = f"<h2>{escape(item['title'])}</h2>" + content_encoded
        
        rss_item = f'''
        <item>
            <title>{escape(item['title'])}</title>
            <link>{base_url}/news/{item['id']}</link>
            <pdalink>{base_url}/news/{item['id']}</pdalink>
            <guid>{guid}</guid>
            <pubDate>{rfc822_date}</pubDate>
            {''.join(f'<category>{cat}</category>' for cat in category_tags)}
            <description>{escape(item.get('excerpt', ''))[:200]}</description>
            {'<enclosure url="' + escape(item['image_url']) + '" type="image/jpeg"/>' if item.get('image_url') else ''}
            <content:encoded><![CDATA[{title_in_content}]]></content:encoded>
        </item>'''
        rss_items.append(rss_item)
    
    now = datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0300')
    
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:georss="http://www.georss.org/georss">
    <channel>
        <title>Город говорит: Краснодар</title>
        <link>{base_url}</link>
        <description>Актуальные новости и события Краснодара</description>
        <language>ru</language>
        <lastBuildDate>{now}</lastBuildDate>
        {''.join(rss_items)}
    </channel>
</rss>'''