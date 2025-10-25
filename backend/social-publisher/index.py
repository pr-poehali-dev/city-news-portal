import json
import os
import urllib.request
import urllib.parse
import urllib.error
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
    
    if not title or not excerpt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Title and excerpt are required'})
        }
    
    results: Dict[str, Any] = {
        'vk': {'success': False, 'error': None, 'post_id': None},
        'telegram': {'success': False, 'error': None, 'message_id': None}
    }
    
    if publish_vk:
        vk_result = publish_to_vk(title, excerpt, image_url, news_url)
        results['vk'] = vk_result
    
    if publish_telegram:
        tg_result = publish_to_telegram(title, excerpt, image_url, news_url)
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


def publish_to_vk(title: str, excerpt: str, image_url: Optional[str], news_url: Optional[str]) -> Dict[str, Any]:
    '''Publish news to VK group wall'''
    access_token = os.environ.get('VK_ACCESS_TOKEN')
    group_id = os.environ.get('VK_GROUP_ID')
    
    if not access_token or not group_id:
        return {
            'success': False,
            'error': 'VK credentials not configured',
            'post_id': None
        }
    
    message_parts: List[str] = [title, '', excerpt]
    if news_url:
        message_parts.extend(['', f'Читать полностью: {news_url}'])
    
    message = '\n'.join(message_parts)
    
    params = {
        'owner_id': f'-{group_id}',
        'message': message,
        'from_group': '1',
        'access_token': access_token,
        'v': '5.131'
    }
    
    if image_url:
        photo_data = upload_photo_to_vk(image_url, access_token, group_id)
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


def upload_photo_to_vk(image_url: str, access_token: str, group_id: str) -> Optional[str]:
    '''Upload photo to VK and return attachment string'''
    try:
        params = {
            'group_id': group_id,
            'access_token': access_token,
            'v': '5.131'
        }
        
        url = 'https://api.vk.com/method/photos.getWallUploadServer'
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'response' not in result or 'upload_url' not in result['response']:
                return None
            
            upload_url = result['response']['upload_url']
        
        image_req = urllib.request.Request(image_url)
        with urllib.request.urlopen(image_req, timeout=10) as img_response:
            image_data = img_response.read()
        
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
        
        with urllib.request.urlopen(upload_req, timeout=10) as upload_response:
            upload_result = json.loads(upload_response.read().decode('utf-8'))
            
            if 'photo' not in upload_result:
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
        
        with urllib.request.urlopen(save_req, timeout=10) as save_response:
            save_result = json.loads(save_response.read().decode('utf-8'))
            
            if 'response' in save_result and len(save_result['response']) > 0:
                photo = save_result['response'][0]
                return f"photo{photo['owner_id']}_{photo['id']}"
            
            return None
    except Exception:
        return None


def publish_to_telegram(title: str, excerpt: str, image_url: Optional[str], news_url: Optional[str]) -> Dict[str, Any]:
    '''Publish news to Telegram channel'''
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
    
    if not bot_token or not channel_id:
        return {
            'success': False,
            'error': 'Telegram credentials not configured',
            'message_id': None
        }
    
    caption_parts: List[str] = [f'<b>{title}</b>', '', excerpt]
    if news_url:
        caption_parts.extend(['', f'<a href="{news_url}">Читать полностью</a>'])
    
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
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if result.get('ok'):
                return {
                    'success': True,
                    'error': None,
                    'message_id': result['result']['message_id']
                }
            else:
                return {
                    'success': False,
                    'error': result.get('description', 'Unknown Telegram error'),
                    'message_id': None
                }
    except Exception as e:
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
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if result.get('ok'):
                return {
                    'success': True,
                    'error': None,
                    'message_id': result['result']['message_id']
                }
            else:
                return {
                    'success': False,
                    'error': result.get('description', 'Unknown Telegram error'),
                    'message_id': None
                }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message_id': None
        }
