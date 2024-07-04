import json
import random
# from my_custom_package import my_function  # If you have a custom package

data = {
    "message": "Hello from Python!",
    "random_number": random.randint(1, 100),
    # "custom_data": my_function()  # Using a function from a custom package
}

print(json.dumps(data))
