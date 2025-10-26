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
    
    movies: List[Dict[str, Any]] = [
        {'id': 1, 'title': 'Побег из Шоушенка', 'year': 1994, 'rating': 9.1, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/84d98727-f2f7-4fbb-ba8f-e64d3b68cde6/300x450', 'description': 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/326/', 'director': 'Фрэнк Дарабонт', 'genres': ['драма']},
        {'id': 2, 'title': 'Зеленая миля', 'year': 1999, 'rating': 9.1, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4057c4b8-8208-4a04-b169-26b0661453e3/300x450', 'description': 'Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зеленую милю» по пути к месту казни.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/435/', 'director': 'Фрэнк Дарабонт', 'genres': ['фэнтези', 'драма', 'криминал']},
        {'id': 3, 'title': 'Форрест Гамп', 'year': 1994, 'rating': 8.9, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4b27e219-a8a5-4d85-9874-57d6016e0837/300x450', 'description': 'От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/448/', 'director': 'Роберт Земекис', 'genres': ['драма', 'мелодрама']},
        {'id': 4, 'title': '1+1', 'year': 2011, 'rating': 8.8, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/d298a49b-0d45-4923-bc8d-d8ebe684f5d4/300x450', 'description': 'Пострадав в результате несчастного случая, богатый аристократ Филипп нанимает в помощники человека, который менее всего подходит для этой работы, – молодого жителя предместья Дрисса, только что освободившегося из тюрьмы.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/535341/', 'director': 'Оливье Накаш, Эрик Толедано', 'genres': ['драма', 'комедия', 'биография']},
        {'id': 5, 'title': 'Начало', 'year': 2010, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/f1e0b98d-1f9e-4138-96a5-c8d8c9c62d2c/300x450', 'description': 'Кobb — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/447301/', 'director': 'Кристофер Нолан', 'genres': ['фантастика', 'боевик', 'триллер', 'драма', 'детектив']},
        {'id': 6, 'title': 'Леон', 'year': 1994, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ec404a34-c321-4b38-86f6-1501c2de9fcb/300x450', 'description': 'Профессиональный убийца Леон неожиданно для себя самого берет под опеку 12-летнюю девочку Матильду – единственную уцелевшую из семьи, уничтоженной коррумпированным полицейским.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/522/', 'director': 'Люк Бессон', 'genres': ['боевик', 'триллер', 'драма', 'криминал']},
        {'id': 7, 'title': 'Список Шиндлера', 'year': 1993, 'rating': 8.7, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9fbdc1cf-bf0c-4b91-98f9-ae7a0be7b2f8/300x450', 'description': 'Фильм рассказывает реальную историю загадочного Оскара Шиндлера, члена нацистской партии, преуспевающего фабриканта, спасшего во время Второй мировой войны почти 1200 евреев.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/329/', 'director': 'Стивен Спилберг', 'genres': ['драма', 'биография', 'история']},
        {'id': 8, 'title': 'Интерстеллар', 'year': 2014, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/dbf344dc-051e-4ed5-b84f-7e264f73f5ba/300x450', 'description': 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/258687/', 'director': 'Кристофер Нолан', 'genres': ['фантастика', 'драма', 'приключения']},
        {'id': 9, 'title': 'Бойцовский клуб', 'year': 1999, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/bd0ff78e-d48d-4db5-b4b0-732422a9dfd1/300x450', 'description': 'Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни. Однажды в самолете он встречает некоего Тайлера Дёрдена — харизматического торговца мылом с извращенной философией.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/361/', 'director': 'Дэвид Финчер', 'genres': ['триллер', 'драма', 'криминал']},
        {'id': 10, 'title': 'Криминальное чтиво', 'year': 1994, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104d6ec205/300x450', 'description': 'Двое бандитов Винсент Вега и Джулс Винфилд ведут философские беседы в перерывах между разборками и решением проблем с должниками криминального босса Марселласа Уоллеса.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/342/', 'director': 'Квентин Тарантино', 'genres': ['криминал', 'драма']},
        {'id': 11, 'title': 'Темный рыцарь', 'year': 2008, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/aba811b5-7896-44c8-9951-63c5b6e6e1e4/300x450', 'description': 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы от преступности.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/111543/', 'director': 'Кристофер Нолан', 'genres': ['фантастика', 'боевик', 'триллер', 'криминал', 'драма']},
        {'id': 12, 'title': 'Властелин колец: Возвращение короля', 'year': 2003, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9ca35206-71e8-49a7-b3f0-88677a844e82/300x450', 'description': 'Последняя часть трилогии о Кольце Всевластия и о героях, которые противостояли темному властелину Саурону.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/328/', 'director': 'Питер Джексон', 'genres': ['фэнтези', 'драма', 'приключения']},
        {'id': 13, 'title': 'Властелин колец: Братство Кольца', 'year': 2001, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/38c06a49-9d7e-4a71-b1dc-c8b3c3c58e32/300x450', 'description': 'Сказания о Средиземье — это хроника Великой войны за Кольцо, войны, длившейся не одну тысячу лет.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/322/', 'director': 'Питер Джексон', 'genres': ['фэнтези', 'драма', 'приключения']},
        {'id': 14, 'title': 'Матрица', 'year': 1999, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/d4a8d8d5-0dbe-4e7e-87e1-423d44f23a75/300x450', 'description': 'Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник, а ночью — хакер по имени Нео.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/301/', 'director': 'Лана Вачовски, Лилли Вачовски', 'genres': ['фантастика', 'боевик']},
        {'id': 15, 'title': 'Властелин колец: Две крепости', 'year': 2002, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a89fb0a-ea9b-4f6a-ad9d-0e44e6e214c8/300x450', 'description': 'Братство распалось, но Кольцо Всевластья должно быть уничтожено. Фродо и Сэм вынуждены довериться Голлуму.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/325/', 'director': 'Питер Джексон', 'genres': ['фэнтези', 'драма', 'приключения']},
        {'id': 16, 'title': 'Жизнь прекрасна', 'year': 1997, 'rating': 8.7, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/00f58639-6088-47bc-9dbd-9bef7e7e0ced/300x450', 'description': 'Во время Второй мировой войны в Италии в концлагерь были отправлены евреи, отец и его маленький сын.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/518/', 'director': 'Роберто Бениньи', 'genres': ['драма', 'комедия', 'военный']},
        {'id': 17, 'title': 'Иван Васильевич меняет профессию', 'year': 1973, 'rating': 8.7, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/28a5b008-ca1a-4489-bbe6-26b189cf13d5/300x450', 'description': 'Инженер-изобретатель Тимофеев создал машину времени, которая соединила его квартиру с палатами царя Ивана Грозного.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/45321/', 'director': 'Леонид Гайдай', 'genres': ['комедия', 'фантастика', 'приключения']},
        {'id': 18, 'title': 'Операция «Ы» и другие приключения Шурика', 'year': 1965, 'rating': 8.7, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/c99c2300-cc78-4126-9a87-971e501b1eca/300x450', 'description': 'Приключения студента Шурика: подготовка к экзаменам, работа на стройке и противостояние бандитам.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/47400/', 'director': 'Леонид Гайдай', 'genres': ['комедия']},
        {'id': 19, 'title': 'Джентльмены удачи', 'year': 1971, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/f26798a7-0b93-4d6e-ba35-ffd06b5a6b90/300x450', 'description': 'Заведующий детским садом Евгений Трошкин как две капли воды похож на грабителя по кличке Доцент.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/42664/', 'director': 'Александр Серый', 'genres': ['комедия', 'криминал']},
        {'id': 20, 'title': 'Король Лев', 'year': 1994, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/c0615b71-1d09-46f9-b0aa-3d43ab0d6ba1/300x450', 'description': 'История об отважном львенке Симбе, который мечтает стать королем саванны.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/2360/', 'director': 'Роджер Аллерс, Роб Минкофф', 'genres': ['мультфильм', 'драма', 'приключения']},
        {'id': 21, 'title': 'Унесённые призраками', 'year': 2001, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/f70f8aad-cf58-4028-8f0e-8e773c4e4dc9/300x450', 'description': 'Маленькая девочка Тихиро со своими родителями переезжает в новый дом. Заблудившись по дороге, они попадают в странный город.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/370/', 'director': 'Хаяо Миядзаки', 'genres': ['аниме', 'фэнтези', 'приключения']},
        {'id': 22, 'title': 'Крёстный отец', 'year': 1972, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/0d5e390e-c44d-4c76-ad66-dd7111bb5217/300x450', 'description': 'Криминальная сага о нью-йоркской сицилийской мафии Корлеоне.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/111/', 'director': 'Фрэнсис Форд Коппола', 'genres': ['драма', 'криминал']},
        {'id': 23, 'title': 'Гладиатор', 'year': 2000, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/35c6cae6-702d-44c6-984f-54c5f8f86468/300x450', 'description': 'Римский полководец Максимус становится рабом-гладиатором.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/474/', 'director': 'Ридли Скотт', 'genres': ['боевик', 'драма', 'приключения']},
        {'id': 24, 'title': 'Служебный роман', 'year': 1977, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/3c9dd745-bd0f-439b-85a9-3c03cb682ef5/300x450', 'description': 'Робкий статистик по совету друга пытается ухаживать за своей начальницей.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/43034/', 'director': 'Эльдар Рязанов', 'genres': ['мелодрама', 'комедия']},
        {'id': 25, 'title': 'Семь', 'year': 1995, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/2ec31023-d77b-44e0-a677-a01c09d7ece3/300x450', 'description': 'Детективы расследуют серию убийств, связанных с семью смертными грехами.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/404/', 'director': 'Дэвид Финчер', 'genres': ['триллер', 'драма', 'криминал']},
        {'id': 26, 'title': 'Молчание ягнят', 'year': 1991, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/6ea0e405-08b0-4c1b-bedb-7c3d3e573e2e/300x450', 'description': 'Молодой агент ФБР ищет помощи у заключенного психиатра-людоеда.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/345/', 'director': 'Джонатан Демме', 'genres': ['триллер', 'криминал', 'драма']},
        {'id': 27, 'title': 'Достучаться до небес', 'year': 1997, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/f5aaae9f-ec30-4a8e-bb8f-fc1ef5c97d57/300x450', 'description': 'Два смертельно больных парня решают осуществить свою мечту — увидеть море.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/522/', 'director': 'Томас Ян', 'genres': ['комедия', 'криминал', 'драма']},
        {'id': 28, 'title': 'В бой идут одни старики', 'year': 1973, 'rating': 8.6, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/4ba66b04-0318-4b7c-a08b-f3f7a8b2e50e/300x450', 'description': 'История эскадрильи истребителей во время Великой Отечественной войны.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/46914/', 'director': 'Леонид Быков', 'genres': ['военный', 'драма', 'комедия']},
        {'id': 29, 'title': 'Белое солнце пустыни', 'year': 1970, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/8ce0db4f-f88e-4e32-afac-23bb0e17f1ad/300x450', 'description': 'Красноармеец Сухов конвоирует гарем жены бандита Абдуллы через пустыню.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/42770/', 'director': 'Владимир Мотыль', 'genres': ['боевик', 'приключения', 'комедия']},
        {'id': 30, 'title': 'Бриллиантовая рука', 'year': 1968, 'rating': 8.5, 'poster': 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/3e5e3fb2-72f6-4e84-a044-94fe31be5c31/300x450', 'description': 'Простой советский служащий случайно становится курьером контрабандистов.', 'kinopoisk_url': 'https://www.kinopoisk.ru/film/42783/', 'director': 'Леонид Гайдай', 'genres': ['комедия', 'криминал']}
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