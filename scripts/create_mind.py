import json
import argparse
from mindsdb_sdk.utils.mind import create_mind

def parse_args():
    parser = argparse.ArgumentParser(description='Create a new mind with MindsDB SDK.')
    parser.add_argument('--name', type=str, required=True, help='Name of the mind')
    parser.add_argument('--description', type=str, required=True, help='Description of the mind')

    # Add other parameters as necessary
    return parser.parse_args()

def mind_to_dict(mind):
    return {
        'name': mind.name,
        # Add any other attributes you want to include
    }
def main():
    args = parse_args()
    name=args.name,
    description=args.description,
    try:
        mind = create_mind(
            name=args.name,
            description='My new test sales mind',
            base_url='https://llm.mdb.ai/',
            api_key='dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b',
            model='gpt-4',
            data_source_type='postgres',
            data_source_connection_args={
                'user': 'demo_user',
                'password': 'demo_password',
                'host': 'samples.mindsdb.com',
                'port': '5432',
                'database': 'demo',
                'schema': 'demo_data'
            }
        )
        # Assuming 'mind' can be serialized directly, or adapt the output as necessary
        print(json.dumps({'success': True, 'data': mind_to_dict(mind)}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        exit(1)

if __name__ == "__main__":
    main()
