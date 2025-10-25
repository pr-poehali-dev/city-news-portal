import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления городскими местами с картой
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
                SELECT id, title, excerpt, content, category, latitude, longitude, 
                       address, image_url, is_published, created_at, updated_at
                FROM city_places
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            places = []
            for row in rows:
                places.append({
                    'id': row[0],
                    'title': row[1],
                    'excerpt': row[2],
                    'content': row[3],
                    'category': row[4],
                    'latitude': float(row[5]),
                    'longitude': float(row[6]),
                    'address': row[7],
                    'image_url': row[8],
                    'is_published': row[9],
                    'created_at': row[10].isoformat() if row[10] else None,
                    'updated_at': row[11].isoformat() if row[11] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(places, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO city_places 
                (title, excerpt, content, category, latitude, longitude, address, image_url, is_published)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body_data.get('title'),
                body_data.get('excerpt', ''),
                body_data.get('content'),
                body_data.get('category'),
                body_data.get('latitude'),
                body_data.get('longitude'),
                body_data.get('address', ''),
                body_data.get('image_url', ''),
                body_data.get('is_published', False)
            ))
            
            place_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': place_id, 'message': 'Place created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            place_id = body_data.get('id')
            
            cur.execute("""
                UPDATE city_places
                SET is_published = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (body_data.get('is_published'), place_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Place updated'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            place_id = params.get('id')
            
            cur.execute("DELETE FROM city_places WHERE id = %s", (place_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Place deleted'}, ensure_ascii=False),
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
