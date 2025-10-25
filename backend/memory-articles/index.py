import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления историческими статьями "Город помнит"
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id, function_name
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
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("""
                SELECT id, title, excerpt, content, year, decade, event_date, 
                       image_url, is_published, created_at, updated_at
                FROM memory_articles
                ORDER BY year DESC, event_date DESC NULLS LAST, created_at DESC
            """)
            
            rows = cur.fetchall()
            articles = []
            for row in rows:
                articles.append({
                    'id': row[0],
                    'title': row[1],
                    'excerpt': row[2],
                    'content': row[3],
                    'year': row[4],
                    'decade': row[5],
                    'event_date': row[6].isoformat() if row[6] else None,
                    'image_url': row[7],
                    'is_published': row[8],
                    'created_at': row[9].isoformat() if row[9] else None,
                    'updated_at': row[10].isoformat() if row[10] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(articles, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO memory_articles 
                (title, excerpt, content, year, decade, event_date, image_url, is_published)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body_data.get('title'),
                body_data.get('excerpt', ''),
                body_data.get('content'),
                body_data.get('year'),
                body_data.get('decade'),
                body_data.get('event_date'),
                body_data.get('image_url', ''),
                body_data.get('is_published', False)
            ))
            
            article_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': article_id, 'message': 'Memory article created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('id')
            
            update_fields = []
            update_values = []
            
            if 'title' in body_data:
                update_fields.append('title = %s')
                update_values.append(body_data['title'])
            if 'excerpt' in body_data:
                update_fields.append('excerpt = %s')
                update_values.append(body_data['excerpt'])
            if 'content' in body_data:
                update_fields.append('content = %s')
                update_values.append(body_data['content'])
            if 'year' in body_data:
                update_fields.append('year = %s')
                update_values.append(body_data['year'])
            if 'decade' in body_data:
                update_fields.append('decade = %s')
                update_values.append(body_data['decade'])
            if 'event_date' in body_data:
                update_fields.append('event_date = %s')
                update_values.append(body_data['event_date'])
            if 'image_url' in body_data:
                update_fields.append('image_url = %s')
                update_values.append(body_data['image_url'])
            if 'is_published' in body_data:
                update_fields.append('is_published = %s')
                update_values.append(body_data['is_published'])
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(article_id)
            
            query = f"UPDATE memory_articles SET {', '.join(update_fields)} WHERE id = %s"
            cur.execute(query, tuple(update_values))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Memory article updated'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            article_id = params.get('id')
            
            cur.execute("DELETE FROM memory_articles WHERE id = %s", (article_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Memory article deleted'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
