import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Автоматическая отправка статистики просмотров в Telegram по расписанию
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
    
    cursor.execute('''
        SELECT last_views_count 
        FROM t_p68330612_city_news_portal.admin_tracking 
        WHERE id = 1
    ''')
    tracking_result = cursor.fetchone()
    last_views = tracking_result['last_views_count'] if tracking_result else 0
    
    new_views = total_views - last_views
    
    if new_views <= 0:
        cursor.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'message': 'No new views since last check',
                'total_views': total_views,
                'last_views': last_views
            })
        }
    
    cursor.execute('''
        UPDATE t_p68330612_city_news_portal.admin_tracking 
        SET last_views_count = %s, last_check = NOW() 
        WHERE id = 1
    ''', (total_views,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    message_lines = [
        f"🔔 <b>Новые просмотры статей!</b>\n\n",
        f"📊 Всего просмотров: <b>{total_views}</b>\n",
        f"🆕 Новых просмотров: <b>+{new_views}</b>\n\n",
        f"📈 Топ-10 статей:\n\n"
    ]
    
    for idx, article in enumerate(top_articles, 1):
        title = article['title'][:50] + '...' if len(article['title']) > 50 else article['title']
        message_lines.append(f"{idx}. {title}\n   👁 <b>{article['views']}</b> просмотров\n\n")
    
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
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Telegram API error: {str(e)}'})
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'total_views': total_views,
            'new_views': new_views,
            'top_articles_count': len(top_articles),
            'telegram_sent': True
        })
    }
