'''
Business: Manages push notifications - subscribes users, queues notifications, sends them
Args: event with httpMethod, body; context with request_id
Returns: HTTP response with subscription status or notification status
'''

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List
import psycopg2
import psycopg2.extras

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    dsn = os.environ.get('DATABASE_URL')
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'subscribe':
            subscription_data = body_data.get('subscription')
            user_agent = event.get('headers', {}).get('user-agent', '')
            
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO notification_subscriptions (subscription_data, user_agent, is_active) "
                f"VALUES ('{json.dumps(subscription_data)}'::jsonb, '{user_agent}', TRUE) RETURNING id"
            )
            sub_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'subscription_id': sub_id})
            }
        
        elif action == 'queue':
            content_type = body_data.get('content_type')
            content_id = body_data.get('content_id')
            title = body_data.get('title', '').replace("'", "''")
            body_text = body_data.get('body', '').replace("'", "''")
            url = body_data.get('url', '')
            
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute(
                "SELECT MAX(scheduled_at) FROM notification_queue WHERE status IN ('pending', 'sent') "
                "AND scheduled_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'"
            )
            result = cur.fetchone()
            last_scheduled = result[0] if result else None
            
            now = datetime.now()
            current_hour = now.hour
            
            if current_hour < 10:
                next_slot = now.replace(hour=10, minute=0, second=0, microsecond=0)
            elif current_hour >= 20:
                next_slot = (now + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
            else:
                next_slot = now + timedelta(hours=1)
                next_slot = next_slot.replace(minute=0, second=0, microsecond=0)
            
            if last_scheduled:
                last_scheduled_aware = last_scheduled.replace(tzinfo=None) if last_scheduled.tzinfo else last_scheduled
                if next_slot <= last_scheduled_aware:
                    next_slot = last_scheduled_aware + timedelta(hours=1)
            
            if next_slot.hour >= 20:
                next_slot = (next_slot + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
            
            cur.execute(
                f"INSERT INTO notification_queue (content_type, content_id, title, body, url, scheduled_at, status) "
                f"VALUES ('{content_type}', {content_id}, '{title}', '{body_text}', '{url}', '{next_slot.isoformat()}', 'pending') RETURNING id"
            )
            queue_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'queue_id': queue_id,
                    'scheduled_at': next_slot.isoformat()
                })
            }
    
    elif method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        action = params.get('action')
        
        if action == 'pending':
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute(
                "SELECT id, content_type, title, body, url, scheduled_at "
                "FROM notification_queue "
                "WHERE status = 'pending' AND scheduled_at <= CURRENT_TIMESTAMP "
                "ORDER BY scheduled_at ASC LIMIT 10"
            )
            rows = cur.fetchall()
            
            notifications = []
            for row in rows:
                notifications.append({
                    'id': row[0],
                    'content_type': row[1],
                    'title': row[2],
                    'body': row[3],
                    'url': row[4],
                    'scheduled_at': row[5].isoformat() if row[5] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(notifications)
            }
        
        elif action == 'subscriptions':
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute(
                "SELECT id, subscription_data FROM notification_subscriptions WHERE is_active = TRUE"
            )
            rows = cur.fetchall()
            
            subscriptions = []
            for row in rows:
                subscriptions.append({
                    'id': row[0],
                    'subscription': row[1]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(subscriptions)
            }
    
    return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'error': 'Invalid request'})
    }