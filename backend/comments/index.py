import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage comments for news articles
    Args: event with httpMethod, body, queryStringParameters (news_id)
          context with request_id
    Returns: HTTP response with comments data
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
            action = params.get('action')
            news_id = params.get('news_id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if action == 'list_all':
                    cur.execute('''
                        SELECT c.*, n.title as news_title
                        FROM comments c
                        LEFT JOIN news n ON c.news_id = n.id
                        ORDER BY c.created_at DESC
                    ''')
                elif news_id:
                    news_id_safe = news_id.replace("'", "''")
                    cur.execute(f'''
                        SELECT * FROM comments 
                        WHERE news_id = '{news_id_safe}'
                        ORDER BY created_at DESC
                    ''')
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'news_id or action=list_all required'}),
                        'isBase64Encoded': False
                    }
                
                comments = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(c) for c in comments], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            news_id = body.get('news_id')
            author_name = body.get('author_name', '')
            text = body.get('text', '')
            
            if not news_id or not author_name or not text:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            author_name_safe = author_name.replace("'", "''")
            text_safe = text.replace("'", "''")
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get news title for notification
                cur.execute(f'''
                    SELECT title FROM news WHERE id = {news_id}
                ''')
                news_result = cur.fetchone()
                news_title = news_result['title'] if news_result else 'новости'
                
                cur.execute(f'''
                    INSERT INTO comments (news_id, author_name, text)
                    VALUES ({news_id}, '{author_name_safe}', '{text_safe}')
                    RETURNING *
                ''')
                
                new_comment = cur.fetchone()
                conn.commit()
                
                # Send notification to admin
                notification_url = os.environ.get('NOTIFICATION_FUNCTION_URL')
                if notification_url:
                    try:
                        notification_data = {
                            'title': 'Новый комментарий',
                            'body': f'{author_name} оставил комментарий к "{news_title}"',
                            'url': f'/news/{news_id}'
                        }
                        req = urllib.request.Request(
                            notification_url,
                            data=json.dumps(notification_data).encode('utf-8'),
                            headers={'Content-Type': 'application/json'},
                            method='POST'
                        )
                        urllib.request.urlopen(req, timeout=5)
                    except (urllib.error.URLError, Exception):
                        pass
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(dict(new_comment), default=str),
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