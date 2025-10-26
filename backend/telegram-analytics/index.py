import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправляет статистику просмотров статей в Telegram
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    database_url = os.environ.get('DATABASE_URL')
    
    if not bot_token or not chat_id or not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Missing required environment variables'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        SELECT SUM(views) as total_views 
        FROM t_p68330612_city_news_portal.news
    ''')
    total_result = cursor.fetchone()
    total_views = total_result['total_views'] if total_result and total_result['total_views'] else 0
    
    cursor.execute('''
        SELECT id, title, views 
        FROM t_p68330612_city_news_portal.news 
        WHERE views > 0
        ORDER BY views DESC 
        LIMIT 10
    ''')
    top_articles = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    message_lines = [
        f"📊 <b>Статистика просмотров</b>\n",
        f"🔢 Всего просмотров: <b>{total_views}</b>\n",
        f"📈 Топ статей:\n"
    ]
    
    for idx, article in enumerate(top_articles, 1):
        title = article['title'][:60] + '...' if len(article['title']) > 60 else article['title']
        message_lines.append(f"{idx}. {title}\n   👁 {article['views']} просмотров\n")
    
    message = ''.join(message_lines)
    
    telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    req = urllib.request.Request(telegram_url, data=data)
    
    try:
        with urllib.request.urlopen(req) as response:
            telegram_response = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        pass
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'total_views': total_views,
            'top_articles_count': len(top_articles)
        })
    }