import json
import os
import urllib.request
import urllib.parse
import urllib.error
import re
from typing import Dict, Any, Optional, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Publishes news to VK and Telegram social networks
    Args: event - dict with httpMethod, body containing news data
          context - object with request_id and other metadata
    Returns: HTTP response with publication results
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    title: str = body_data.get('title', '')
    excerpt: str = body_data.get('excerpt', '')
    image_url: Optional[str] = body_data.get('image_url')
    news_url: Optional[str] = body_data.get('news_url')
    publish_vk: bool = body_data.get('publish_vk', True)
    publish_telegram: bool = body_data.get('publish_telegram', True)
    save_vk_draft: bool = body_data.get('save_vk_draft', False)
    keywords: str = body_data.get('keywords', '')
    
    if not title or not excerpt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Title and excerpt are required'})
        }
    
    results: Dict[str, Any] = {
        'vk': {'success': False, 'error': None, 'post_id': None},
        'telegram': {'success': False, 'error': None, 'message_id': None},
        'vk_draft': {'success': False, 'error': None, 'post_id': None}
    }
    
    if save_vk_draft:
        vk_draft_result = save_vk_draft_post(title, excerpt, image_url, news_url, keywords)
        results['vk_draft'] = vk_draft_result
        
        return {
            'statusCode': 200 if vk_draft_result['success'] else 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': vk_draft_result['success'],
                'results': results,
                'draft_saved': vk_draft_result['success']
            })
        }
    
    if publish_vk:
        vk_result = publish_to_vk(title, excerpt, image_url, news_url, keywords)
        results['vk'] = vk_result
    
    if publish_telegram:
        tg_result = publish_to_telegram(title, excerpt, image_url, news_url, keywords)
        results['telegram'] = tg_result
    
    success_count = sum(1 for r in results.values() if r['success'])
    
    return {
        'statusCode': 200 if success_count > 0 else 500,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': success_count > 0,
            'results': results,
            'published_count': success_count
        })
    }


def clean_html(text: str) -> str:
    '''Remove HTML tags and convert to plain text'''
    text = re.sub(r'<img[^>]*>', '', text)
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'<strong>(.*?)</strong>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<b>(.*?)</b>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<em>(.*?)</em>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<i>(.*?)</i>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'• \1\n', text, flags=re.DOTALL)
    text = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', r'\1\n\n', text, flags=re.DOTALL)
    text = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>', r'"\1"\n\n', text, flags=re.DOTALL)
    text = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', text, flags=re.DOTALL)
    text = re.sub(r'<ul[^>]*>|</ul>|<ol[^>]*>|</ol>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()

def clean_markdown(text: str) -> str:
    '''Remove markdown syntax from text'''
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    text = re.sub(r'[#*_`~]', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def truncate_text(text: str, max_length: int = 800, add_read_more: bool = False, news_url: Optional[str] = None) -> str:
    '''Truncate text to max length, keeping whole words'''
    text = clean_html(text)
    text = clean_markdown(text)
    if len(text) <= max_length:
        return text
    
    truncated = text[:max_length].rsplit(' ', 1)[0]
    result = truncated + '...'
    
    if add_read_more and news_url:
        result += f'\n\nЧитать далее: {news_url}'
    
    return result

def keywords_to_hashtags(keywords: str) -> str:
    '''Convert keywords to hashtags'''
    if not keywords:
        return ''
    
    tags = [kw.strip() for kw in keywords.split(',') if kw.strip()]
    hashtags = ['#' + tag.replace(' ', '') for tag in tags]
    return ' '.join(hashtags)

def publish_to_vk(title: str, excerpt: str, image_url: Optional[str], news_url: Optional[str], keywords: str = '') -> Dict[str, Any]:
    '''Publish news to VK group wall'''
    group_token = os.environ.get('VK_ACCESS_TOKEN')
    user_token = os.environ.get('VK_USER_ACCESS_TOKEN')
    group_id = os.environ.get('VK_GROUP_ID')
    
    if not group_token or not group_id:
        return {
            'success': False,
            'error': 'VK credentials not configured',
            'post_id': None
        }
    
    access_token = user_token if user_token and image_url else group_token
    
    vk_max_length = 1000
    title_and_newline_length = len(title) + 2
    available_for_text = vk_max_length - title_and_newline_length
    
    if news_url:
        read_more_text = f'\n\nЧитать далее: {news_url}'
        available_for_text -= len(read_more_text)
    else:
        read_more_text = ''
    
    if keywords:
        hashtags = keywords_to_hashtags(keywords)
        if hashtags:
            available_for_text -= len(hashtags) + 2
    else:
        hashtags = ''
    
    clean_text = truncate_text(excerpt, available_for_text)
    
    message_parts: List[str] = [title, '', clean_text]
    
    if len(title) + len(clean_text) + 2 > vk_max_length - len(read_more_text) - len(hashtags):
        if news_url:
            message_parts.append(read_more_text.strip())
    elif news_url:
        message_parts.extend(['', f'Читать полностью: {news_url}'])
    
    if hashtags:
        message_parts.extend(['', hashtags])
    
    message = '\n'.join(message_parts)
    
    params = {
        'owner_id': f'-{group_id}',
        'message': message,
        'from_group': '1',
        'access_token': access_token,
        'v': '5.131'
    }
    
    if image_url:
        photo_data = upload_photo_to_vk_user_token(image_url, access_token, group_id)
        if photo_data:
            params['attachments'] = photo_data
    
    url = 'https://api.vk.com/method/wall.post'
    
    try:
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'response' in result and 'post_id' in result['response']:
                return {
                    'success': True,
                    'error': None,
                    'post_id': result['response']['post_id']
                }
            elif 'error' in result:
                return {
                    'success': False,
                    'error': result['error'].get('error_msg', 'Unknown VK error'),
                    'post_id': None
                }
            else:
                return {
                    'success': False,
                    'error': 'Invalid VK API response',
                    'post_id': None
                }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'post_id': None
        }


def upload_photo_to_vk_user_token(image_url: str, access_token: str, group_id: str) -> Optional[str]:
    '''Upload photo to VK using user token (not group token)'''
    try:
        if not image_url or not image_url.startswith('http'):
            print(f'Invalid image URL: {image_url}')
            return None
        
        params = {
            'access_token': access_token,
            'v': '5.131'
        }
        
        url = 'https://api.vk.com/method/photos.getWallUploadServer'
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'error' in result:
                print(f'VK getWallUploadServer error: {result["error"]}')
                return None
            
            if 'response' not in result or 'upload_url' not in result['response']:
                print(f'No upload_url in response: {result}')
                return None
            
            upload_url = result['response']['upload_url']
        
        image_req = urllib.request.Request(
            image_url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(image_req, timeout=15) as img_response:
            image_data = img_response.read()
        
        if len(image_data) == 0:
            print('Downloaded image is empty')
            return None
        
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        body = (
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="photo"; filename="image.jpg"\r\n'
            f'Content-Type: image/jpeg\r\n\r\n'
        ).encode('utf-8') + image_data + f'\r\n--{boundary}--\r\n'.encode('utf-8')
        
        upload_req = urllib.request.Request(
            upload_url,
            data=body,
            headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
        )
        
        with urllib.request.urlopen(upload_req, timeout=15) as upload_response:
            upload_result = json.loads(upload_response.read().decode('utf-8'))
            
            if 'photo' not in upload_result:
                print(f'No photo in upload result: {upload_result}')
                return None
        
        save_params = {
            'group_id': group_id,
            'photo': upload_result['photo'],
            'server': upload_result['server'],
            'hash': upload_result['hash'],
            'access_token': access_token,
            'v': '5.131'
        }
        
        save_url = 'https://api.vk.com/method/photos.saveWallPhoto'
        save_data = urllib.parse.urlencode(save_params).encode('utf-8')
        save_req = urllib.request.Request(save_url, data=save_data)
        
        with urllib.request.urlopen(save_req, timeout=15) as save_response:
            save_result = json.loads(save_response.read().decode('utf-8'))
            
            if 'error' in save_result:
                print(f'VK saveWallPhoto error: {save_result["error"]}')
                return None
            
            if 'response' in save_result and len(save_result['response']) > 0:
                photo = save_result['response'][0]
                attachment = f"photo{photo['owner_id']}_{photo['id']}"
                print(f'Successfully uploaded photo: {attachment}')
                return attachment
            
            print(f'No photos in save result: {save_result}')
            return None
    except Exception as e:
        print(f'Photo upload error: {str(e)}')
        return None


def save_vk_draft_post(title: str, excerpt: str, image_url: Optional[str], news_url: Optional[str], keywords: str = '') -> Dict[str, Any]:
    '''Save news as postponed post in VK group (acts as draft - publish date set to +1 year)'''
    group_token = os.environ.get('VK_ACCESS_TOKEN')
    user_token = os.environ.get('VK_USER_ACCESS_TOKEN')
    group_id = os.environ.get('VK_GROUP_ID')
    
    if not group_token or not group_id:
        return {
            'success': False,
            'error': 'VK credentials not configured',
            'post_id': None
        }
    
    access_token = user_token if user_token and image_url else group_token
    
    vk_max_length = 1000
    title_and_newline_length = len(title) + 2
    available_for_text = vk_max_length - title_and_newline_length
    
    if news_url:
        read_more_text = f'\n\nЧитать далее: {news_url}'
        available_for_text -= len(read_more_text)
    else:
        read_more_text = ''
    
    if keywords:
        hashtags = keywords_to_hashtags(keywords)
        if hashtags:
            available_for_text -= len(hashtags) + 2
    else:
        hashtags = ''
    
    clean_text = truncate_text(excerpt, available_for_text)
    
    message_parts: List[str] = [title, '', clean_text]
    
    if len(title) + len(clean_text) + 2 > vk_max_length - len(read_more_text) - len(hashtags):
        if news_url:
            message_parts.append(read_more_text.strip())
    elif news_url:
        message_parts.extend(['', f'Читать полностью: {news_url}'])
    
    if hashtags:
        message_parts.extend(['', hashtags])
    
    message = '\n'.join(message_parts)
    
    import time
    future_timestamp = int(time.time()) + 31536000
    
    params = {
        'owner_id': f'-{group_id}',
        'message': message,
        'from_group': '1',
        'publish_date': str(future_timestamp),
        'access_token': access_token,
        'v': '5.131'
    }
    
    if image_url and user_token:
        photo_data = upload_photo_to_vk_user_token(image_url, access_token, group_id)
        if photo_data:
            params['attachments'] = photo_data
    
    url = 'https://api.vk.com/method/wall.post'
    
    try:
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'response' in result and 'post_id' in result['response']:
                return {
                    'success': True,
                    'error': None,
                    'post_id': result['response']['post_id']
                }
            elif 'error' in result:
                return {
                    'success': False,
                    'error': result['error'].get('error_msg', 'Unknown VK error'),
                    'post_id': None
                }
            else:
                return {
                    'success': False,
                    'error': 'Invalid VK API response',
                    'post_id': None
                }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'post_id': None
        }


def publish_to_telegram(title: str, excerpt: str, image_url: Optional[str], news_url: Optional[str], keywords: str = '') -> Dict[str, Any]:
    '''Publish news to Telegram channel'''
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
    
    if not bot_token or not channel_id:
        return {
            'success': False,
            'error': 'Telegram credentials not configured',
            'message_id': None
        }
    
    clean_text = truncate_text(excerpt, 800)
    caption_parts: List[str] = [f'<b>{title}</b>', '', clean_text]
    if news_url:
        caption_parts.extend(['', f'<a href="{news_url}">Читать полностью</a>'])
    
    if keywords:
        hashtags = keywords_to_hashtags(keywords)
        if hashtags:
            caption_parts.extend(['', hashtags])
    
    caption = '\n'.join(caption_parts)
    
    if image_url:
        return send_telegram_photo(bot_token, channel_id, image_url, caption)
    else:
        return send_telegram_message(bot_token, channel_id, caption)


def send_telegram_photo(bot_token: str, channel_id: str, photo_url: str, caption: str) -> Dict[str, Any]:
    '''Send photo with caption to Telegram channel'''
    url = f'https://api.telegram.org/bot{bot_token}/sendPhoto'
    
    params = {
        'chat_id': channel_id,
        'photo': photo_url,
        'caption': caption,
        'parse_mode': 'HTML'
    }
    
    try:
        print(f'Sending Telegram photo with caption length: {len(caption)}')
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f'Telegram photo response: {result}')
            
            if result.get('ok'):
                return {
                    'success': True,
                    'error': None,
                    'message_id': result['result']['message_id']
                }
            else:
                error_msg = result.get('description', 'Unknown Telegram error')
                print(f'Telegram photo error: {error_msg}')
                return {
                    'success': False,
                    'error': error_msg,
                    'message_id': None
                }
    except Exception as e:
        print(f'Telegram photo exception: {str(e)}')
        return {
            'success': False,
            'error': str(e),
            'message_id': None
        }


def send_telegram_message(bot_token: str, channel_id: str, text: str) -> Dict[str, Any]:
    '''Send text message to Telegram channel'''
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    params = {
        'chat_id': channel_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    try:
        print(f'Sending Telegram message with text length: {len(text)}')
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f'Telegram message response: {result}')
            
            if result.get('ok'):
                return {
                    'success': True,
                    'error': None,
                    'message_id': result['result']['message_id']
                }
            else:
                error_msg = result.get('description', 'Unknown Telegram error')
                print(f'Telegram message error: {error_msg}')
                return {
                    'success': False,
                    'error': error_msg,
                    'message_id': None
                }
    except Exception as e:
        print(f'Telegram message exception: {str(e)}')
        return {
            'success': False,
            'error': str(e),
            'message_id': None
        }