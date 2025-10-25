import json
import urllib.request
import urllib.parse
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение актуальных событий Краснодара через KudaGo API
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с request_id
    Returns: HTTP response dict с событиями
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        try:
            params = event.get('queryStringParameters') or {}
            page_size = params.get('page_size', '10')
            
            current_timestamp = int(datetime.now().timestamp())
            
            api_params = {
                'location': 'krd',
                'fields': 'id,title,slug,description,body_text,dates,place,images,categories,age_restriction,price,is_free',
                'expand': 'images,place,dates',
                'actual_since': str(current_timestamp),
                'order_by': 'publication_date',
                'page_size': page_size,
                'text_format': 'text'
            }
            
            url = f"https://kudago.com/public-api/v1.4/events/?{urllib.parse.urlencode(api_params)}"
            
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            events = []
            for item in data.get('results', []):
                dates_info = item.get('dates', [])
                event_date = None
                event_date_display = 'Постоянная выставка'
                
                if dates_info and len(dates_info) > 0:
                    start_timestamp = dates_info[0].get('start')
                    if start_timestamp and start_timestamp > 0:
                        try:
                            dt = datetime.fromtimestamp(int(start_timestamp))
                            event_date = dt.strftime('%Y-%m-%d %H:%M')
                            event_date_display = None
                        except (ValueError, TypeError, OSError):
                            pass
                
                images = item.get('images', [])
                image_url = images[0].get('image') if images and len(images) > 0 else None
                
                place_info = item.get('place', {})
                location = place_info.get('title', '') if place_info else ''
                
                description = item.get('description', '') or item.get('body_text', '')
                if description and len(description) > 200:
                    description = description[:200] + '...'
                
                title = item.get('title', '')
                if title:
                    title = title[0].upper() + title[1:] if len(title) > 0 else title
                
                events.append({
                    'id': item.get('id'),
                    'title': title,
                    'description': description,
                    'event_date': event_date,
                    'event_date_display': event_date_display,
                    'location': location,
                    'image_url': image_url,
                    'is_free': item.get('is_free', False),
                    'price': item.get('price', ''),
                    'age_restriction': item.get('age_restriction', ''),
                    'kudago_url': f"https://krd.kudago.com/event/{item.get('slug', '')}"
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'count': data.get('count', 0),
                    'events': events
                }, ensure_ascii=False),
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
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
        'isBase64Encoded': False
    }