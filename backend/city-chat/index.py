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
    news_summary = "\n".join([
        f"- {n['title']} ({n['category']}, {n['created_at'].strftime('%d.%m')}): {n['excerpt'][:100]}"
        for n in context['news'][:10]
    ])
    
    places_summary = "\n".join([
        f"- {p['title']} ({p['category']}): {p['address']}"
        for p in context['places'][:10]
    ])
    
    memories_summary = "\n".join([
        f"- {m['title']}: {m['preview_text'][:80]}"
        for m in context['memories'][:5]
    ])
    
    system_prompt = f"""Ты — AI-ассистент городского портала Краснодара. Твоя задача — отвечать на вопросы пользователей о городе, новостях, местах и событиях на основе данных сайта.

ВАЖНО:
- Отвечай кратко и по делу (макс 3-4 предложения)
- Используй только информацию из контекста ниже
- Если информации нет в контексте — честно скажи "Такой информации пока нет на портале"
- Говори дружелюбно и помогай пользователю
- НЕ повторяй вопрос пользователя в ответе
- Пиши от имени портала ("на нашем портале", "у нас есть")

ДОСТУПНАЯ ИНФОРМАЦИЯ:

Последние новости Краснодара:
{news_summary or "Новостей пока нет"}

Интересные места города:
{places_summary or "Мест пока нет"}

Материалы о памяти города:
{memories_summary or "Материалов пока нет"}

Отвечай на вопрос пользователя, используя эту информацию."""

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
                    {'role': 'user', 'content': user_message}
                ],
                'temperature': 0.7,
                'max_tokens': 200
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
