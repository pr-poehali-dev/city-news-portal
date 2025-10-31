import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.parse
import urllib.error
from typing import Dict, Any, List
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Check news indexation status in Yandex and Google, send Telegram notifications
    Args: event - dict with httpMethod (GET or POST both work)
          context - object with request_id
    Returns: HTTP response with indexation check results
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cutoff_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    cur.execute("""
        SELECT id, title, published_at, indexed_yandex, indexed_google
        FROM news 
        WHERE status = 'published' 
        AND published_at >= %s
        AND (indexed_yandex = FALSE OR indexed_google = FALSE)
        ORDER BY published_at DESC
        LIMIT 20
    """, (cutoff_date,))
    
    news_to_check = cur.fetchall()
    
    newly_indexed: List[Dict[str, Any]] = []
    checked_count = 0
    
    for news in news_to_check:
        news_id = news['id']
        news_url = f'https://gorodgovorit.ru/news/{news_id}'
        title = news['title']
        was_yandex_indexed = news['indexed_yandex']
        was_google_indexed = news['indexed_google']
        
        yandex_indexed = check_yandex_indexation(news_url)
        google_indexed = check_google_indexation(news_url)
        
        needs_update = False
        updates = []
        
        if not was_yandex_indexed and yandex_indexed:
            updates.append("indexed_yandex = TRUE")
            needs_update = True
            newly_indexed.append({
                'title': title,
                'url': news_url,
                'search_engine': 'Яндекс'
            })
        
        if not was_google_indexed and google_indexed:
            updates.append("indexed_google = TRUE")
            needs_update = True
            newly_indexed.append({
                'title': title,
                'url': news_url,
                'search_engine': 'Google'
            })
        
        if needs_update:
            cur.execute(f"""
                UPDATE news 
                SET {', '.join(updates)}
                WHERE id = %s
            """, (news_id,))
            conn.commit()
        
        checked_count += 1
    
    if newly_indexed and telegram_bot_token and telegram_chat_id:
        for item in newly_indexed:
            send_telegram_notification(
                telegram_bot_token,
                telegram_chat_id,
                f"🎉 Новость проиндексирована в {item['search_engine']}!\n\n"
                f"📰 {item['title']}\n\n"
                f"🔗 {item['url']}"
            )
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'checked_count': checked_count,
            'newly_indexed_count': len(newly_indexed),
            'newly_indexed': newly_indexed
        })
    }


def check_yandex_indexation(url: str) -> bool:
    '''Check if URL is indexed in Yandex using site: search'''
    try:
        search_query = f'site:{url}'
        encoded_query = urllib.parse.quote(search_query)
        search_url = f'https://yandex.ru/search/?text={encoded_query}'
        
        req = urllib.request.Request(
            search_url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return 'Ничего не нашлось' not in html and 'Ничего не найдено' not in html
    except Exception:
        return False


def check_google_indexation(url: str) -> bool:
    '''Check if URL is indexed in Google using site: search'''
    try:
        search_query = f'site:{url}'
        encoded_query = urllib.parse.quote(search_query)
        search_url = f'https://www.google.com/search?q={encoded_query}'
        
        req = urllib.request.Request(
            search_url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return 'did not match any documents' not in html
    except Exception:
        return False


def send_telegram_notification(bot_token: str, chat_id: str, message: str) -> None:
    '''Send notification to Telegram'''
    try:
        url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        data = json.dumps({
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML',
            'disable_web_page_preview': True
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass