import json
import base64
import uuid
import os
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload images to S3-compatible storage
    Args: event - dict with httpMethod, body containing base64 image
          context - object with attributes: request_id
    Returns: HTTP response with image URL
    '''
    print('=== IMAGE UPLOAD HANDLER START ===')
    method: str = event.get('httpMethod', 'POST')
    print(f'Method: {method}')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        print(f'Body parsed, keys: {body_data.keys()}')
    except Exception as e:
        print(f'Error parsing body: {e}')
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    image_base64 = body_data.get('image')
    filename = body_data.get('filename', f'image-{uuid.uuid4().hex[:8]}.jpg')
    
    print(f'Filename: {filename}')
    print(f'Image base64 length: {len(image_base64) if image_base64 else 0}')
    
    if not image_base64:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'No image provided'})
        }
    
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
        print('Stripped data URL prefix')
    
    try:
        image_data = base64.b64decode(image_base64)
        print(f'Decoded image size: {len(image_data)} bytes')
    except Exception as e:
        print(f'Error decoding base64: {e}')
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid base64 image'})
        }
    
    timestamp = datetime.now().strftime('%Y%m%d')
    unique_filename = f"news/{timestamp}/{uuid.uuid4().hex[:12]}-{filename}"
    
    print(f'Unique filename: {unique_filename}')
    
    try:
        import boto3
        
        s3_endpoint = os.environ.get('S3_ENDPOINT', 'https://storage.yandexcloud.net')
        s3_bucket = os.environ.get('S3_BUCKET', 'poehali-storage')
        s3_access_key = os.environ.get('S3_ACCESS_KEY')
        s3_secret_key = os.environ.get('S3_SECRET_KEY')
        
        print(f'S3 config - endpoint: {s3_endpoint}, bucket: {s3_bucket}')
        print(f'S3 credentials - access_key exists: {bool(s3_access_key)}, secret_key exists: {bool(s3_secret_key)}')
        
        s3_client = boto3.client(
            's3',
            endpoint_url=s3_endpoint,
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
            region_name='ru-central1'
        )
        
        print('S3 client created, uploading...')
        
        s3_client.put_object(
            Bucket=s3_bucket,
            Key=unique_filename,
            Body=image_data,
            ContentType='image/jpeg',
            ACL='public-read'
        )
        
        print('Upload successful')
        
        image_url = f"{s3_endpoint}/{s3_bucket}/{unique_filename}"
        
        print(f'Image URL: {image_url}')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'url': image_url})
        }
        
    except Exception as e:
        print(f'=== UPLOAD ERROR ===')
        print(f'Error type: {type(e).__name__}')
        print(f'Error message: {str(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Upload failed: {str(e)}'})
        }