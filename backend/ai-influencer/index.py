import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, time
import psycopg2
from psycopg2.extras import RealDictCursor
import openai

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate and manage AI influencer posts based on daily news
    Args: event - dict with httpMethod, queryStringParameters (action: get/generate)
          context - object with request_id, function_name
    Returns: HTTP response with posts or generation status
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
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get')
            
            if action == 'generate':
                result = generate_daily_posts(conn)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result, ensure_ascii=False)
                }
            else:
                posts = get_todays_posts(conn)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(posts, ensure_ascii=False)
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()


def get_todays_posts(conn) -> List[Dict[str, Any]]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, text, mood, location, created_at, time_of_day
            FROM city_posts
            WHERE DATE(created_at) = CURRENT_DATE
            ORDER BY created_at ASC
        """)
        posts = cur.fetchall()
        
        return [{
            'id': post['id'],
            'text': post['text'],
            'mood': post['mood'],
            'location': post['location'],
            'timestamp': post['created_at'].isoformat(),
            'timeOfDay': post['time_of_day'],
            'author': 'Краснодар',
            'type': 'ai_influencer'
        } for post in posts]


def generate_daily_posts(conn) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT COUNT(*) as count
            FROM city_posts
            WHERE DATE(created_at) = CURRENT_DATE
        """)
        result = cur.fetchone()
        
        if result and result['count'] >= 3:
            return {'message': 'Posts already generated for today', 'count': result['count']}
        
        cur.execute("""
            SELECT title, excerpt, category, created_at
            FROM news
            WHERE DATE(created_at) = CURRENT_DATE
            ORDER BY views DESC, created_at DESC
            LIMIT 10
        """)
        news = cur.fetchall()
        
        openai_key = os.environ.get('OPENAI_API_KEY')
        if not openai_key:
            posts = generate_fallback_posts(conn)
            return {'message': 'Generated fallback posts (no OpenAI key)', 'count': len(posts)}
        
        posts = generate_ai_posts(conn, news, openai_key)
        return {'message': 'Generated AI posts successfully', 'count': len(posts)}


def generate_ai_posts(conn, news: List[Dict], openai_key: str) -> List[int]:
    client = openai.OpenAI(api_key=openai_key, base_url="https://api.openai.com/v1")
    
    news_summary = "\n".join([f"- {n['title']}: {n['excerpt']}" for n in news]) if news else "Новостей сегодня пока нет"
    
    prompt = f"""You are the city of Miami writing short social media posts in first person about local news and city life.

Today's news:
{news_summary}

Write 3 short posts (1-2 sentences each) for three times of day:
1. Morning (8:00 AM) - energetic, optimistic
2. Afternoon (2:00 PM) - busy, informative
3. Evening (8:00 PM) - calm, reflective

Requirements:
- Short (max 120 characters)
- Safe, positive tone
- First person ("I", "my streets", "my residents")
- If there's news - briefly mention it
- If no news - just a neutral observation about the city
- Add 1 emoji at the end
- Write in Russian language

Response format (JSON only, no markdown):
{{"morning": "morning post text in Russian", "afternoon": "afternoon post text in Russian", "evening": "evening post text in Russian"}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=300
        )
        
        content = response.choices[0].message.content.strip()
        if content.startswith('```'):
            content = content.split('```')[1]
            if content.startswith('json'):
                content = content[4:]
            content = content.strip()
        
        posts_data = json.loads(content)
        
        times = [
            ('morning', 'утро', 'cheerful'),
            ('afternoon', 'день', 'lively'),
            ('evening', 'вечер', 'peaceful')
        ]
        
        post_ids = []
        with conn.cursor() as cur:
            for key, time_of_day, mood in times:
                text = posts_data.get(key, 'Сегодня прекрасный день! ☀️')
                cur.execute("""
                    INSERT INTO city_posts (text, mood, location, time_of_day)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                """, (text, mood, 'Краснодар', time_of_day))
                post_id = cur.fetchone()[0]
                post_ids.append(post_id)
            
            conn.commit()
        
        return post_ids
    
    except Exception:
        return generate_fallback_posts(conn)


def generate_fallback_posts(conn) -> List[int]:
    fallback_posts = [
        ('Доброе утро! Сегодня я просыпаюсь под пение птиц в парках 🌅', 'cheerful', 'утро'),
        ('День в самом разгаре. Мои улицы полны жизни и движения 🚶', 'lively', 'день'),
        ('Вечер приносит спокойствие. Я любуюсь закатом над Кубанью 🌆', 'peaceful', 'вечер')
    ]
    
    post_ids = []
    with conn.cursor() as cur:
        for text, mood, time_of_day in fallback_posts:
            cur.execute("""
                INSERT INTO city_posts (text, mood, location, time_of_day)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (text, mood, 'Краснодар', time_of_day))
            post_id = cur.fetchone()[0]
            post_ids.append(post_id)
        
        conn.commit()
    
    return post_ids