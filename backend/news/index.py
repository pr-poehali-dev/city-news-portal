import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage news articles - get all, get by id, create, update
    Args: event with httpMethod, body, queryStringParameters
          context with request_id
    Returns: HTTP response with news data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            category = params.get('category')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if news_id:
                    cur.execute('''
                        SELECT n.*, a.name as author_name 
                        FROM news n 
                        LEFT JOIN authors a ON n.author_id = a.id 
                        WHERE n.id = %s
                    ''', (news_id,))
                    news = cur.fetchone()
                    
                    if not news:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'News not found'}),
                            'isBase64Encoded': False
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(dict(news), default=str),
                        'isBase64Encoded': False
                    }
                
                elif category:
                    cur.execute('''
                        SELECT n.*, a.name as author_name 
                        FROM news n 
                        LEFT JOIN authors a ON n.author_id = a.id 
                        WHERE n.category = %s
                        ORDER BY n.published_at DESC
                    ''', (category,))
                else:
                    cur.execute('''
                        SELECT n.*, a.name as author_name 
                        FROM news n 
                        LEFT JOIN authors a ON n.author_id = a.id 
                        ORDER BY n.published_at DESC
                    ''')
                
                news_list = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(n) for n in news_list], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            title = body.get('title', '')
            category = body.get('category', '')
            excerpt = body.get('excerpt', '')
            content = body.get('content', '')
            image_url = body.get('image_url', '')
            author_id = body.get('author_id', 1)
            read_time = body.get('read_time', '5 мин')
            
            if not title or not category or not excerpt:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    INSERT INTO news (title, category, excerpt, content, image_url, author_id, read_time)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                ''', (title, category, excerpt, content, image_url, author_id, read_time))
                
                new_news = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(dict(new_news), default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            news_id = body.get('id')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'News ID required'}),
                    'isBase64Encoded': False
                }
            
            fields = []
            values = []
            
            if 'title' in body:
                fields.append('title = %s')
                values.append(body['title'])
            if 'category' in body:
                fields.append('category = %s')
                values.append(body['category'])
            if 'excerpt' in body:
                fields.append('excerpt = %s')
                values.append(body['excerpt'])
            if 'content' in body:
                fields.append('content = %s')
                values.append(body['content'])
            if 'image_url' in body:
                fields.append('image_url = %s')
                values.append(body['image_url'])
            if 'read_time' in body:
                fields.append('read_time = %s')
                values.append(body['read_time'])
            
            fields.append('updated_at = CURRENT_TIMESTAMP')
            values.append(news_id)
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    UPDATE news 
                    SET {', '.join(fields)}
                    WHERE id = %s
                    RETURNING *
                ''', values)
                
                updated_news = cur.fetchone()
                conn.commit()
                
                if not updated_news:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'News not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(dict(updated_news), default=str),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
