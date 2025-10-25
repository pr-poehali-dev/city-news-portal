import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Provide city context data for AI chat
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: HTTP response with news, posts, and city info
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
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False)
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'DATABASE_URL not configured'}, ensure_ascii=False)
        }
    
    conn = psycopg2.connect(db_url)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT title, excerpt, category, created_at
                FROM news
                WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '3 days'
                ORDER BY created_at DESC
                LIMIT 15
            """)
            recent_news = cur.fetchall()
            
            cur.execute("""
                SELECT text, mood, location, created_at, time_of_day
                FROM city_posts
                WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '1 day'
                ORDER BY created_at DESC
                LIMIT 10
            """)
            city_posts = cur.fetchall()
            
            cur.execute("""
                SELECT title, address, category
                FROM city_places
                ORDER BY rating DESC NULLS LAST
                LIMIT 10
            """)
            top_places = cur.fetchall()
            
            news_list = [{
                'title': n['title'],
                'excerpt': n['excerpt'],
                'category': n['category'],
                'date': n['created_at'].isoformat()
            } for n in recent_news]
            
            posts_list = [{
                'text': p['text'],
                'mood': p['mood'],
                'location': p['location'],
                'time': p['time_of_day'],
                'date': p['created_at'].isoformat()
            } for p in city_posts]
            
            places_list = [{
                'title': p['title'],
                'address': p['address'],
                'category': p['category']
            } for p in top_places]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'news': news_list,
                    'posts': posts_list,
                    'places': places_list,
                    'city': {
                        'name': 'Краснодар',
                        'description': 'Южная столица России, гостеприимный и динамично развивающийся город'
                    }
                }, ensure_ascii=False)
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
