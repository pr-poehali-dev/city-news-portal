import json
import os
from typing import Dict, Any
import openai

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate unique AI responses for city chat based on context
    Args: event - dict with httpMethod, body containing question and context
          context - object with request_id
    Returns: HTTP response with AI-generated answer
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False)
        }
    
    openai_key = os.environ.get('OPENAI_API_KEY')
    if not openai_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'OpenAI API key not configured'}, ensure_ascii=False)
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        question = body_data.get('question', '')
        system_prompt = body_data.get('systemPrompt', '')
        previous_messages = body_data.get('previousMessages', [])
        
        if not question:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Question is required'}, ensure_ascii=False)
            }
        
        openai.api_key = openai_key
        
        messages = [
            {'role': 'system', 'content': system_prompt}
        ]
        
        for msg in previous_messages[-4:]:
            messages.append({
                'role': msg.get('role', 'user'),
                'content': msg.get('content', '')
            })
        
        messages.append({'role': 'user', 'content': question})
        
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=messages,
            temperature=1.0,
            max_tokens=200
        )
        
        answer = response['choices'][0]['message']['content'].strip()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'answer': answer}, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }