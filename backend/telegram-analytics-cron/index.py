import json
import os
from typing import Dict, Any, List
import urllib.request
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка уведомлений о новых просмотрах за последнюю минуту в Telegram
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
        SELECT n.id, n.title, n.views, 
               COALESCE(t.last_views_count, 0) as last_views
        FROM t_p68330612_city_news_portal.news n
        LEFT JOIN t_p68330612_city_news_portal.article_views_tracking t 
            ON n.id = t.news_id
        WHERE n.views > 0
    ''')
    all_articles = cursor.fetchall()
    
    articles_with_new_views: List[Dict[str, Any]] = []
    total_new_views = 0
    
    for article in all_articles:
        new_views_count = article['views'] - article['last_views']
        if new_views_count > 0:
            articles_with_new_views.append({
                'id': article['id'],
                'title': article['title'],
                'views': article['views'],
                'new_views': new_views_count
            })
            total_new_views += new_views_count
    
    if not articles_with_new_views:
        cursor.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'message': 'No new views in the last minute',
                'checked_articles': len(all_articles)
            })
        }
    
    for article in all_articles:
        cursor.execute('''
            INSERT INTO t_p68330612_city_news_portal.article_views_tracking (news_id, last_views_count, last_check)
            VALUES (%s, %s, NOW())
            ON CONFLICT (news_id) 
            DO UPDATE SET last_views_count = %s, last_check = NOW()
        ''', (article['id'], article['views'], article['views']))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    articles_with_new_views.sort(key=lambda x: x['new_views'], reverse=True)
    
    cursor = psycopg2.connect(database_url).cursor(cursor_factory=RealDictCursor)
    cursor.execute('''
        SELECT id, title, views 
        FROM t_p68330612_city_news_portal.news 
        WHERE views > 0
        ORDER BY views DESC 
        LIMIT 3
    ''')
    top_3_articles = cursor.fetchall()
    cursor.close()
    
    message_lines = [
        f"🔔 <b>Новые просмотры за последнюю минуту!</b>\n\n",
        f"🆕 Всего новых просмотров: <b>+{total_new_views}</b>\n\n"
    ]
    
    message_lines.append(f"📰 <b>Статьи с новыми просмотрами:</b>\n")
    for article in articles_with_new_views:
        title = article['title'][:45] + '...' if len(article['title']) > 45 else article['title']
        message_lines.append(
            f"• {title}\n"
            f"  +{article['new_views']} просмотр(ов) | Всего: {article['views']}\n\n"
        )
    
    message_lines.append(f"\n📈 <b>Топ-3 самых популярных:</b>\n")
    for idx, article in enumerate(top_3_articles, 1):
        title = article['title'][:45] + '...' if len(article['title']) > 45 else article['title']
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
            'total_new_views': total_new_views,
            'articles_with_new_views': len(articles_with_new_views),
            'telegram_sent': True
        })
    }
