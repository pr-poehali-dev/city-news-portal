import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление молодёжными заметками от редакции
    Args: event - dict с httpMethod, queryStringParameters, body
          context - объект с request_id, function_name и другими атрибутами
    Returns: HTTP response dict с заметками или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        note_id = params.get('id')
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if note_id:
                cur.execute(
                    'SELECT * FROM youth_notes WHERE id = %s',
                    (note_id,)
                )
                result = cur.fetchone()
                conn.close()
                
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Note not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(result), default=str)
                }
            else:
                cur.execute(
                    'SELECT * FROM youth_notes ORDER BY created_at DESC'
                )
                results = cur.fetchall()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps([dict(row) for row in results], default=str)
                }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        title = body_data.get('title')
        content = body_data.get('content')
        emoji = body_data.get('emoji', '✨')
        color = body_data.get('color', '#8B5CF6')
        is_published = body_data.get('is_published', True)
        
        if not title or not content:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Title and content are required'})
            }
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                '''INSERT INTO youth_notes (title, content, emoji, color, is_published)
                   VALUES (%s, %s, %s, %s, %s)
                   RETURNING *''',
                (title, content, emoji, color, is_published)
            )
            result = cur.fetchone()
            conn.commit()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(dict(result), default=str)
            }
    
    if method == 'PUT':
        params = event.get('queryStringParameters') or {}
        note_id = params.get('id')
        
        if not note_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Note ID is required'})
            }
        
        body_data = json.loads(event.get('body', '{}'))
        
        update_fields = []
        update_values = []
        
        for field in ['title', 'content', 'emoji', 'color', 'is_published']:
            if field in body_data:
                update_fields.append(f'{field} = %s')
                update_values.append(body_data[field])
        
        if not update_fields:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        update_values.append(note_id)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                f'''UPDATE youth_notes 
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                    RETURNING *''',
                tuple(update_values)
            )
            result = cur.fetchone()
            conn.commit()
            conn.close()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Note not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(dict(result), default=str)
            }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        note_id = params.get('id')
        
        if not note_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Note ID is required'})
            }
        
        with conn.cursor() as cur:
            cur.execute('DELETE FROM youth_notes WHERE id = %s', (note_id,))
            deleted_count = cur.rowcount
            conn.commit()
            conn.close()
            
            if deleted_count == 0:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Note not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Note deleted'})
            }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
