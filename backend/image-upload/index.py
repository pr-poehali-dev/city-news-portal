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
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    image_base64 = body_data.get('image')
    filename = body_data.get('filename', f'image-{uuid.uuid4().hex[:8]}.jpg')
    
    if not image_base64:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'No image provided'})
        }
    
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
    
    try:
        image_data = base64.b64decode(image_base64)
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid base64 image'})
        }
    
    timestamp = datetime.now().strftime('%Y%m%d')
    unique_filename = f"news/{timestamp}/{uuid.uuid4().hex[:12]}-{filename}"
    
    try:
        import boto3
        
        s3_endpoint = os.environ.get('S3_ENDPOINT', 'https://storage.yandexcloud.net')
        s3_bucket = os.environ.get('S3_BUCKET', 'poehali-storage')
        s3_access_key = os.environ.get('S3_ACCESS_KEY')
        s3_secret_key = os.environ.get('S3_SECRET_KEY')
        
        s3_client = boto3.client(
            's3',
            endpoint_url=s3_endpoint,
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
            region_name='ru-central1'
        )
        
        s3_client.put_object(
            Bucket=s3_bucket,
            Key=unique_filename,
            Body=image_data,
            ContentType='image/jpeg',
            ACL='public-read'
        )
        
        image_url = f"{s3_endpoint}/{s3_bucket}/{unique_filename}"
        
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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Upload failed: {str(e)}'})
        }
