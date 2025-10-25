import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat assistant for answering user questions about Krasnodar city portal
    Args: event - dict with httpMethod, body (contains user_message)
          context - object with request_id
    Returns: HTTP response with AI answer based on site data
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False)
        }
    
    body = json.loads(event.get('body', '{}'))
    user_message = body.get('message', '').strip()
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Message is required'}, ensure_ascii=False)
        }
    
    db_url = os.environ.get('DATABASE_URL')
    gigachat_key = os.environ.get('GIGACHAT_API_KEY')
    
    if not db_url or not gigachat_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Configuration missing'}, ensure_ascii=False)
        }
    
    conn = psycopg2.connect(db_url)
    
    try:
        context_data = get_site_context(conn)
        ai_response = get_ai_response(user_message, context_data, gigachat_key)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'response': ai_response}, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }
    
    finally:
        conn.close()


def get_site_context(conn) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT title, excerpt, category, created_at
            FROM news
            WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY views DESC, created_at DESC
            LIMIT 20
        """)
        news = cur.fetchall()
        
        cur.execute("""
            SELECT title, address, category, description
            FROM city_places
            WHERE is_published = true
            ORDER BY rating DESC NULLS LAST
            LIMIT 15
        """)
        places = cur.fetchall()
        
        cur.execute("""
            SELECT title, preview_text, tags
            FROM memory_articles
            ORDER BY created_at DESC
            LIMIT 10
        """)
        memories = cur.fetchall()
        
        cur.execute("""
            SELECT text, mood, location, created_at
            FROM city_posts
            WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '3 days'
            ORDER BY created_at DESC
            LIMIT 10
        """)
        city_posts = cur.fetchall()
        
        return {
            'news': [dict(n) for n in news],
            'places': [dict(p) for p in places],
            'memories': [dict(m) for m in memories],
            'city_posts': [dict(cp) for cp in city_posts]
        }


def get_ai_response(user_message: str, context: Dict[str, Any], gigachat_key: str) -> str:
    news_list = []
    for n in context['news'][:15]:
        title = n['title']
        category = n['category']
        excerpt = n['excerpt'][:150] if n.get('excerpt') else ''
        date = n['created_at'].strftime('%d.%m.%Y') if n.get('created_at') else ''
        news_list.append(f"{title} | {category} | {date}\n   {excerpt}")
    
    places_list = []
    for p in context['places'][:12]:
        title = p['title']
        category = p.get('category', 'Место')
        address = p.get('address', '')
        desc = p.get('description', '')[:100] if p.get('description') else ''
        places_list.append(f"{title} ({category})\n   Адрес: {address}\n   {desc}")
    
    memories_list = []
    for m in context['memories'][:8]:
        title = m['title']
        preview = m.get('preview_text', '')[:120] if m.get('preview_text') else ''
        memories_list.append(f"{title}\n   {preview}")
    
    news_text = "\n\n".join(news_list) if news_list else "Новостей пока нет"
    places_text = "\n\n".join(places_list) if places_list else "Мест пока нет"
    memories_text = "\n\n".join(memories_list) if memories_list else "Материалов пока нет"
    
    system_prompt = f"""Ты — помощник городского портала Краснодара. Отвечай СТРОГО на основе данных ниже.

КРИТИЧЕСКИ ВАЖНО:
1. Читай вопрос пользователя внимательно
2. Ищи ТОЧНОЕ совпадение в данных
3. Отвечай ТОЛЬКО по данным из контекста
4. Если точного ответа нет — скажи "Такой информации нет на портале"
5. НЕ выдумывай факты
6. Ответ должен быть 2-3 предложения максимум
7. БЕЗ повтора вопроса в ответе

═══════════════════════════════════════
НОВОСТИ КРАСНОДАРА:
{news_text}

═══════════════════════════════════════
МЕСТА ГОРОДА:
{places_text}

═══════════════════════════════════════
МАТЕРИАЛЫ О ПАМЯТИ:
{memories_text}
═══════════════════════════════════════"""

    try:
        auth_response = requests.post(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers={'Authorization': f'Bearer {gigachat_key}', 'RqUID': f'chat-{hash(user_message)}'},
            data={'scope': 'GIGACHAT_API_PERS'},
            verify=False,
            timeout=10
        )
        
        if auth_response.status_code != 200:
            return "Извините, сервис временно недоступен. Попробуйте позже."
        
        access_token = auth_response.json()['access_token']
        
        chat_response = requests.post(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'GigaChat',
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': f'Вопрос пользователя: {user_message}\n\nДай точный ответ на основе данных выше.'}
                ],
                'temperature': 0.3,
                'max_tokens': 250
            },
            verify=False,
            timeout=15
        )
        
        if chat_response.status_code != 200:
            return "Не удалось получить ответ. Попробуйте переформулировать вопрос."
        
        response_text = chat_response.json()['choices'][0]['message']['content'].strip()
        return response_text
    
    except Exception:
        return "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз."