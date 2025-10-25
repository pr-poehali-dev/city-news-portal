"""
Business: Send push notifications to admin subscribers via Web Push API
Args: event with httpMethod, body containing notification data
Returns: HTTP response confirming notification sent
"""

import json
import os
import psycopg2
from typing import Dict, Any
from pywebpush import webpush, WebPushException

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request body
    body_data = json.loads(event.get('body', '{}'))
    notification_title = body_data.get('title', 'Новое событие')
    notification_body = body_data.get('body', '')
    notification_url = body_data.get('url', '/')
    
    # Connect to database
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    # Get all subscriptions
    cur.execute('SELECT subscription_data FROM notification_subscriptions WHERE is_active = true')
    subscriptions = cur.fetchall()
    
    # VAPID configuration from environment
    vapid_private_key = os.environ.get('VAPID_PRIVATE_KEY')
    vapid_public_key = os.environ.get('VAPID_PUBLIC_KEY')
    vapid_claims = {
        "sub": "mailto:admin@example.com"
    }
    
    sent_count = 0
    failed_count = 0
    
    # Send notification to each subscription
    for (subscription_data,) in subscriptions:
        try:
            # subscription_data is already a dict (JSONB from postgres)
            subscription = subscription_data if isinstance(subscription_data, dict) else json.loads(subscription_data)
            
            notification_data = {
                "title": notification_title,
                "body": notification_body,
                "url": notification_url,
                "icon": "/logo.png"
            }
            
            webpush(
                subscription_info=subscription,
                data=json.dumps(notification_data),
                vapid_private_key=vapid_private_key,
                vapid_claims=vapid_claims
            )
            sent_count += 1
            
        except WebPushException as e:
            failed_count += 1
            # Remove invalid subscriptions
            if e.response and e.response.status_code in [404, 410]:
                subscription_json = json.dumps(subscription_data) if isinstance(subscription_data, dict) else subscription_data
                cur.execute(
                    'UPDATE notification_subscriptions SET is_active = false WHERE subscription_data = %s::jsonb',
                    (subscription_json,)
                )
                conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'sent': sent_count,
            'failed': failed_count
        })
    }