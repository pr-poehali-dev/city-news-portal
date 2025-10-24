import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage authors and about portal content
    Args: event - dict with httpMethod, body, queryStringParameters, pathParams
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters', {}) or {}
    resource = params.get('resource', 'authors')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        conn.cursor().execute('''
            CREATE TABLE IF NOT EXISTS authors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                bio TEXT,
                photo_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.cursor().execute('''
            CREATE TABLE IF NOT EXISTS about_portal (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        
        with conn.cursor() as cur:
            cur.execute('SELECT COUNT(*) FROM authors')
            count = cur.fetchone()[0]
            if count == 0:
                cur.execute(
                    "INSERT INTO authors (name, position, bio) VALUES (%s, %s, %s)",
                    ('Никита Москвин', 'Главный редактор', 'Основатель портала "Город говорит: Краснодар"')
                )
                conn.commit()
        
        with conn.cursor() as cur:
            cur.execute('SELECT COUNT(*) FROM about_portal')
            count = cur.fetchone()[0]
            if count == 0:
                cur.execute(
                    "INSERT INTO about_portal (title, content) VALUES (%s, %s)",
                    ('О портале', 'Портал "Город говорит: Краснодар" - ваш источник актуальных новостей и событий города.')
                )
                conn.commit()
    except:
        pass
    
    if resource == 'authors':
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT * FROM authors ORDER BY created_at DESC')
                authors = cur.fetchall()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps([dict(a) for a in authors], default=str)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            position = body_data.get('position', '')
            bio = body_data.get('bio', '')
            photo_url = body_data.get('photo_url', '')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO authors (name, position, bio, photo_url) VALUES (%s, %s, %s, %s) RETURNING *",
                    (name, position, bio, photo_url)
                )
                new_author = cur.fetchone()
                conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(new_author), default=str)
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            author_id = body_data.get('id')
            name = body_data.get('name')
            position = body_data.get('position', '')
            bio = body_data.get('bio', '')
            photo_url = body_data.get('photo_url', '')
            
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE authors SET name=%s, position=%s, bio=%s, photo_url=%s WHERE id=%s",
                    (name, position, bio, photo_url, author_id)
                )
                conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        if method == 'DELETE':
            author_id = params.get('id')
            
            with conn.cursor() as cur:
                cur.execute('DELETE FROM authors WHERE id=%s', (author_id,))
                conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    if resource == 'about':
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT * FROM about_portal LIMIT 1')
                about = cur.fetchone()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(about) if about else {}, default=str)
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            content = body_data.get('content')
            
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE about_portal SET title=%s, content=%s, updated_at=CURRENT_TIMESTAMP WHERE id=1",
                    (title, content)
                )
                conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
