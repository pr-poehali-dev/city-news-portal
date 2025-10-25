import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Синхронизация событий Краснодара с KudaGo API
    Args: event - HTTP запрос, context - контекст выполнения
    Returns: Результат синхронизации с количеством добавленных событий
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
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    kudago_url = 'https://kudago.com/public-api/v1.4/events/?location=krd&page_size=10&fields=id,title,description,dates,place,images,is_free,price,age_restriction'
    
    req = urllib.request.Request(kudago_url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    events_added = 0
    
    for kudago_event in data.get('results', []):
        kudago_id = kudago_event.get('id')
        title = kudago_event.get('title', '')[:500]
        description = kudago_event.get('description', '')
        
        if description:
            description = description.replace('<p>', '').replace('</p>', '').replace('<br>', ' ')[:1000]
        
        dates = kudago_event.get('dates', [])
        event_date = None
        event_date_display = None
        
        if dates and len(dates) > 0:
            start_timestamp = dates[0].get('start')
            if start_timestamp:
                event_date = datetime.fromtimestamp(start_timestamp)
                event_date_display = event_date.strftime('%d %B, %H:%M')
        
        place = kudago_event.get('place', {})
        location = place.get('title', 'Краснодар') if place else 'Краснодар'
        
        images = kudago_event.get('images', [])
        image_url = None
        if images and len(images) > 0:
            image_url = images[0].get('image')
        
        is_free = kudago_event.get('is_free', False)
        price = kudago_event.get('price', '')
        age_restriction = kudago_event.get('age_restriction', '')
        
        if age_restriction and age_restriction.endswith('+'):
            age_restriction = age_restriction[:-1]
        
        kudago_url_link = f'https://kudago.com/krd/event/{kudago_id}/'
        
        cursor.execute(
            "SELECT id FROM t_p68330612_city_news_portal.events WHERE title = %s",
            (title,)
        )
        existing = cursor.fetchone()
        
        if not existing:
            cursor.execute(
                """INSERT INTO t_p68330612_city_news_portal.events 
                (title, description, event_date, location, image_url, kudago_url, is_free, price, age_restriction, event_date_display, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())""",
                (title, description, event_date, location, image_url, kudago_url_link, is_free, price, age_restriction, event_date_display)
            )
            events_added += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'events_added': events_added,
            'message': f'Добавлено {events_added} новых событий'
        })
    }
