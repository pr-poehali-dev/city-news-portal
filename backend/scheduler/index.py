import json
import os
from typing import Dict, Any
from datetime import datetime, time
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Daily scheduler for generating AI city posts at specific times
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: HTTP response with generation status
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
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
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
        current_hour = datetime.now().hour
        
        should_generate = current_hour in [8, 14, 20]
        
        if not should_generate:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': 'Not scheduled time',
                    'current_hour': current_hour,
                    'scheduled_hours': [8, 14, 20]
                })
            }
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT COUNT(*) as count
                FROM city_posts
                WHERE DATE(created_at) = CURRENT_DATE
            """)
            result = cur.fetchone()
            
            if result and result['count'] >= 3:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'message': 'Posts already generated today',
                        'count': result['count']
                    })
                }
        
        ai_function_url = 'https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76?action=generate'
        
        req = urllib.request.Request(ai_function_url)
        with urllib.request.urlopen(req) as response:
            result_data = json.loads(response.read().decode())
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Posts generated successfully',
                'result': result_data,
                'triggered_at': datetime.now().isoformat()
            }, ensure_ascii=False)
        }
    
    finally:
        conn.close()
