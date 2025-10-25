"""
Business: Periodically check for new comments and views, send push notifications to admins
Args: event with httpMethod (triggered by cron or manual call)
Returns: HTTP response with check results
"""

import json
import os
import psycopg2
from typing import Dict, Any
from pywebpush import webpush, WebPushException

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute('''
        SELECT last_comments_count, last_views_count 
        FROM admin_tracking 
        WHERE id = 1
    ''')
    row = cur.fetchone()
    
    if row is None:
        cur.execute('INSERT INTO admin_tracking (id, last_comments_count, last_views_count) VALUES (1, 0, 0)')
        conn.commit()
        last_comments_count = 0
        last_views_count = 0
    else:
        last_comments_count, last_views_count = row
    
    cur.execute('SELECT COUNT(*) FROM comments')
    current_comments_count = cur.fetchone()[0]
    
    cur.execute('SELECT COALESCE(SUM(views), 0) FROM news WHERE status = %s', ('published',))
    current_views_count = cur.fetchone()[0]
    
    notifications_sent = 0
    
    cur.execute('SELECT subscription_data FROM notification_subscriptions WHERE is_active = true')
    subscriptions = cur.fetchall()
    
    vapid_private_key = os.environ.get('VAPID_PRIVATE_KEY')
    vapid_claims = {"sub": "mailto:admin@example.com"}
    
    if current_comments_count > last_comments_count:
        new_comments = current_comments_count - last_comments_count
        
        for (subscription_data,) in subscriptions:
            try:
                subscription = subscription_data if isinstance(subscription_data, dict) else json.loads(subscription_data)
                
                notification_data = {
                    "title": "Новый комментарий",
                    "body": f"+{new_comments} {new_comments == 1 and 'комментарий' or new_comments < 5 and 'комментария' or 'комментариев'}",
                    "url": "/admin",
                    "icon": "/icon-192.png"
                }
                
                webpush(
                    subscription_info=subscription,
                    data=json.dumps(notification_data),
                    vapid_private_key=vapid_private_key,
                    vapid_claims=vapid_claims
                )
                notifications_sent += 1
                
            except WebPushException as e:
                if e.response and e.response.status_code in [404, 410]:
                    subscription_json = json.dumps(subscription_data) if isinstance(subscription_data, dict) else subscription_data
                    cur.execute(
                        'UPDATE notification_subscriptions SET is_active = false WHERE subscription_data = %s::jsonb',
                        (subscription_json,)
                    )
                    conn.commit()
    
    if current_views_count > last_views_count:
        new_views = current_views_count - last_views_count
        
        for (subscription_data,) in subscriptions:
            try:
                subscription = subscription_data if isinstance(subscription_data, dict) else json.loads(subscription_data)
                
                notification_data = {
                    "title": "👁 Новые просмотры",
                    "body": f"+{new_views} {new_views == 1 and 'просмотр' or new_views < 5 and 'просмотра' or 'просмотров'}",
                    "url": "/admin",
                    "icon": "/icon-192.png"
                }
                
                webpush(
                    subscription_info=subscription,
                    data=json.dumps(notification_data),
                    vapid_private_key=vapid_private_key,
                    vapid_claims=vapid_claims
                )
                notifications_sent += 1
                
            except WebPushException as e:
                if e.response and e.response.status_code in [404, 410]:
                    subscription_json = json.dumps(subscription_data) if isinstance(subscription_data, dict) else subscription_data
                    cur.execute(
                        'UPDATE notification_subscriptions SET is_active = false WHERE subscription_data = %s::jsonb',
                        (subscription_json,)
                    )
                    conn.commit()
    
    cur.execute('''
        UPDATE admin_tracking 
        SET last_comments_count = %s, last_views_count = %s, last_check = NOW()
        WHERE id = 1
    ''', (current_comments_count, current_views_count))
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
            'new_comments': current_comments_count - last_comments_count,
            'new_views': current_views_count - last_views_count,
            'notifications_sent': notifications_sent
        })
    }