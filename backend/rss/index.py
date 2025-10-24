import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime
import html

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate RSS feed for Yandex.News
    Args: event with httpMethod
          context with request_id
    Returns: HTTP response with RSS XML feed
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
                'Content-Type': 'text/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': '<?xml version="1.0" encoding="UTF-8"?><error>Method not allowed</error>',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'text/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': '<?xml version="1.0" encoding="UTF-8"?><error>Database not configured</error>',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT n.*, a.name as author_name 
                FROM news n 
                LEFT JOIN authors a ON n.author_id = a.id 
                WHERE n.status = 'published'
                ORDER BY n.published_at DESC
                LIMIT 100
            ''')
            
            news_list = cur.fetchall()
            
            rss_items = []
            for news in news_list:
                pub_date = datetime.fromisoformat(str(news['published_at']))
                rfc822_date = pub_date.strftime('%a, %d %b %Y %H:%M:%S +0000')
                
                title = html.escape(news['title'])
                description = html.escape(news['excerpt'])
                content = html.escape(news.get('content', news['excerpt']))
                author = html.escape(news.get('author_name', 'Никита Москвин'))
                category = html.escape(news['category'])
                
                image_tag = ''
                if news.get('image_url'):
                    image_tag = f'<enclosure url="{html.escape(news["image_url"])}" type="image/jpeg"/>'
                
                item = f'''
    <item>
        <title>{title}</title>
        <link>https://gorodgovorit.ru/news/{news['id']}</link>
        <guid isPermaLink="true">https://gorodgovorit.ru/news/{news['id']}</guid>
        <pubDate>{rfc822_date}</pubDate>
        <author>{author}</author>
        <category>{category}</category>
        <description>{description}</description>
        <content:encoded><![CDATA[{content}]]></content:encoded>
        {image_tag}
    </item>'''
                rss_items.append(item)
            
            current_time = datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000')
            
            rss_feed = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>Город говорит: Краснодар</title>
        <link>https://gorodgovorit.ru</link>
        <description>Актуальные новости Краснодара</description>
        <language>ru</language>
        <lastBuildDate>{current_time}</lastBuildDate>
        <generator>Город говорит RSS Generator</generator>
{''.join(rss_items)}
    </channel>
</rss>'''
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=300'
                },
                'body': rss_feed,
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()
