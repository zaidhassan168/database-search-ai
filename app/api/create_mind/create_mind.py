import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument('--name', type=str, required=True, help='Name input')
    parser.add_argument('--description', type=str, required=True, help='Description input')

    args = parser.parse_args()

    result = {
        "message": "Python script executed successfully",
        "random_number": 42,  # Example of additional data
        "custom_data": {
            "name": args.name,
            "description": args.description
        }
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
