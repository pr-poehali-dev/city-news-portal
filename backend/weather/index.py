import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get weather data for Krasnodar from OpenWeatherMap API
    Args: event with httpMethod, queryStringParameters (optional: city)
          context with request_id
    Returns: HTTP response with weather data
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('WEATHER_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'temp': 18,
                'description': 'Облачно',
                'icon': '02d',
                'humidity': 65,
                'wind_speed': 3.5,
                'city': 'Краснодар',
                'mock': True
            }),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    city = params.get('city', 'Krasnodar,RU')
    
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=ru'
    
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            weather_data = {
                'temp': round(data['main']['temp']),
                'description': data['weather'][0]['description'].capitalize(),
                'icon': data['weather'][0]['icon'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'city': data['name'],
                'mock': False
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(weather_data),
                'isBase64Encoded': False
            }
    
    except urllib.error.HTTPError as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'temp': 18,
                'description': 'Облачно',
                'icon': '02d',
                'humidity': 65,
                'wind_speed': 3.5,
                'city': 'Краснодар',
                'mock': True,
                'error': f'API error: {e.code}'
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'temp': 18,
                'description': 'Облачно',
                'icon': '02d',
                'humidity': 65,
                'wind_speed': 3.5,
                'city': 'Краснодар',
                'mock': True,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
