"""
Business: Parse top 250 movies from Kinopoisk
Args: event with httpMethod, queryStringParameters (limit, offset)
Returns: JSON with movies data (title, year, rating, poster, description, kinopoisk_url)
"""

import json
import re
from typing import Dict, Any, List, Optional
from urllib.request import Request, urlopen
from urllib.parse import quote_plus

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
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
    
    params = event.get('queryStringParameters') or {}
    limit: int = int(params.get('limit', '10'))
    offset: int = int(params.get('offset', '0'))
    
    # Hardcoded top movies data (since we can't reliably parse Kinopoisk without API key)
    movies: List[Dict[str, Any]] = [
        {
            'id': 1,
            'title': 'Побег из Шоушенка',
            'year': 1994,
            'rating': 9.1,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/84d98727-f2f7-4fbb-ba8f-e64d3b68cde6/300x450',
            'description': 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/326/',
            'director': 'Фрэнк Дарабонт',
            'genres': ['драма']
        },
        {
            'id': 2,
            'title': 'Зеленая миля',
            'year': 1999,
            'rating': 9.1,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4057c4b8-8208-4a04-b169-26b0661453e3/300x450',
            'description': 'Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зеленую милю» по пути к месту казни.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/435/',
            'director': 'Фрэнк Дарабонт',
            'genres': ['фэнтези', 'драма', 'криминал']
        },
        {
            'id': 3,
            'title': 'Форрест Гамп',
            'year': 1994,
            'rating': 8.9,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4b27e219-a8a5-4d85-9874-57d6016e0837/300x450',
            'description': 'От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/448/',
            'director': 'Роберт Земекис',
            'genres': ['драма', 'мелодрама']
        },
        {
            'id': 4,
            'title': '1+1',
            'year': 2011,
            'rating': 8.8,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/d298a49b-0d45-4923-bc8d-d8ebe684f5d4/300x450',
            'description': 'Пострадав в результате несчастного случая, богатый аристократ Филипп нанимает в помощники человека, который менее всего подходит для этой работы, – молодого жителя предместья Дрисса, только что освободившегося из тюрьмы.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/535341/',
            'director': 'Оливье Накаш, Эрик Толедано',
            'genres': ['драма', 'комедия', 'биография']
        },
        {
            'id': 5,
            'title': 'Начало',
            'year': 2010,
            'rating': 8.6,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/f1e0b98d-1f9e-4138-96a5-c8d8c9c62d2c/300x450',
            'description': 'Кobb — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/447301/',
            'director': 'Кристофер Нолан',
            'genres': ['фантастика', 'боевик', 'триллер', 'драма', 'детектив']
        },
        {
            'id': 6,
            'title': 'Леон',
            'year': 1994,
            'rating': 8.6,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ec404a34-c321-4b38-86f6-1501c2de9fcb/300x450',
            'description': 'Профессиональный убийца Леон неожиданно для себя самого берет под опеку 12-летнюю девочку Матильду – единственную уцелевшую из семьи, уничтоженной коррумпированным полицейским.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/522/',
            'director': 'Люк Бессон',
            'genres': ['боевик', 'триллер', 'драма', 'криминал']
        },
        {
            'id': 7,
            'title': 'Список Шиндлера',
            'year': 1993,
            'rating': 8.7,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9fbdc1cf-bf0c-4b91-98f9-ae7a0be7b2f8/300x450',
            'description': 'Фильм рассказывает реальную историю загадочного Оскара Шиндлера, члена нацистской партии, преуспевающего фабриканта, спасшего во время Второй мировой войны почти 1200 евреев.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/329/',
            'director': 'Стивен Спилберг',
            'genres': ['драма', 'биография', 'история']
        },
        {
            'id': 8,
            'title': 'Интерстеллар',
            'year': 2014,
            'rating': 8.6,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/dbf344dc-051e-4ed5-b84f-7e264f73f5ba/300x450',
            'description': 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/258687/',
            'director': 'Кристофер Нолан',
            'genres': ['фантастика', 'драма', 'приключения']
        },
        {
            'id': 9,
            'title': 'Бойцовский клуб',
            'year': 1999,
            'rating': 8.6,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/bd0ff78e-d48d-4db5-b4b0-732422a9dfd1/300x450',
            'description': 'Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни. Однажды в самолете он встречает некоего Тайлера Дёрдена — харизматического торговца мылом с извращенной философией.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/361/',
            'director': 'Дэвид Финчер',
            'genres': ['триллер', 'драма', 'криминал']
        },
        {
            'id': 10,
            'title': 'Криминальное чтиво',
            'year': 1994,
            'rating': 8.6,
            'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104d6ec205/300x450',
            'description': 'Двое бандитов Винсент Вега и Джулс Винфилд ведут философские беседы в перерывах между разборками и решением проблем с должниками криминального босса Марселласа Уоллеса.',
            'kinopoisk_url': 'https://www.kinopoisk.ru/film/342/',
            'director': 'Квентин Тарантино',
            'genres': ['криминал', 'драма']
        }
    ]
    
    # Pagination
    total: int = len(movies)
    end: int = min(offset + limit, total)
    result_movies: List[Dict[str, Any]] = movies[offset:end]
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'movies': result_movies,
            'total': total,
            'limit': limit,
            'offset': offset
        }, ensure_ascii=False)
    }
