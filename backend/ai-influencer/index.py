import json
import random
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate AI influencer posts for "Город говорит" section
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id, function_name
    Returns: HTTP response with generated post
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
    
    templates = [
        {
            'text': 'Сегодня я услышал смех в парке Галицкого. Пожалуйста, не мусорите — я всё вижу 😉',
            'mood': 'playful',
            'location': 'Парк Галицкого'
        },
        {
            'text': 'Сегодня я замерз, но зато улица Красная украсили новыми фонарями. Красота! ✨',
            'mood': 'appreciative',
            'location': 'улица Красная'
        },
        {
            'text': 'Вчера видел, как на Театральной площади дети играли в снежки. Я улыбнулся (если бы мог) ☺️',
            'mood': 'warm',
            'location': 'Театральная площадь'
        },
        {
            'text': 'Мои светофоры на проспекте Чекистов работают исправно. Берегите себя на дорогах! 🚦',
            'mood': 'caring',
            'location': 'проспект Чекистов'
        },
        {
            'text': 'Сегодня пахнет пирожками с углов моих улиц. Я горжусь своими пекарнями! 🥐',
            'mood': 'proud',
            'location': 'центр города'
        },
        {
            'text': 'Видел, как бабушка кормила голубей у фонтана. Простые радости — это и есть счастье 💙',
            'mood': 'philosophical',
            'location': 'центральный фонтан'
        },
        {
            'text': 'Мои троллейбусы сегодня особенно дружелюбные. Или это я в хорошем настроении? 🚎',
            'mood': 'cheerful',
            'location': 'транспортные маршруты'
        },
        {
            'text': 'Ночью я люблю смотреть на огни набережной. Тишина и красота... 🌃',
            'mood': 'romantic',
            'location': 'набережная'
        },
        {
            'text': 'Сегодня на рынке такое оживление! Я люблю, когда мои жители общаются и смеются 🛒',
            'mood': 'lively',
            'location': 'городской рынок'
        },
        {
            'text': 'Дождь смыл пыль с моих улиц. Я чувствую себя обновленным! 🌧️',
            'mood': 'refreshed',
            'location': 'весь город'
        },
        {
            'text': 'Заметил, что в сквере появились новые скамейки. Спасибо тем, кто обо мне заботится! 🪑',
            'mood': 'grateful',
            'location': 'городской сквер'
        },
        {
            'text': 'Слышал музыку из окон — кто-то учится играть на гитаре. Я поддерживаю творчество! 🎸',
            'mood': 'supportive',
            'location': 'жилой район'
        },
        {
            'text': 'Утром меня будят птицы в парке. Лучший будильник на свете! 🐦',
            'mood': 'peaceful',
            'location': 'парк'
        },
        {
            'text': 'Видел, как волонтеры убирали мусор на набережной. Вы — настоящие герои! 🦸',
            'mood': 'inspired',
            'location': 'набережная'
        },
        {
            'text': 'Мои фонтаны снова заработали после зимы. Весна пришла! 💦',
            'mood': 'excited',
            'location': 'городские фонтаны'
        }
    ]
    
    post = random.choice(templates)
    
    current_time = datetime.now().isoformat()
    
    response_data = {
        'id': random.randint(1000, 9999),
        'text': post['text'],
        'mood': post['mood'],
        'location': post['location'],
        'timestamp': current_time,
        'author': 'Краснодар',
        'type': 'ai_influencer'
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(response_data, ensure_ascii=False)
    }
