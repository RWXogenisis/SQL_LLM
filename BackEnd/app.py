# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)

# Configure CORS to allow requests from the React frontend
# Replace 'http://localhost:3000' with your frontend's actual URL if different
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/get-reply', methods=['POST'])
def get_reply():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        input_text = data.get('prompt', '').strip()

        logging.info(f"Received prompt: {input_text}")

        # Generate a reply based on the input
        if input_text:
            reply = generate_reply(input_text)
        else:
            reply = "Please provide some input text."

        # Return the reply as a JSON response
        return jsonify({'response': reply}), 200

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({'response': 'An error occurred processing your request.'}), 500

def generate_reply(input_text):
    # This function can be enhanced to include AI-based responses
    # Currently, it simply echoes the input text for demonstration
    return f"You said: {input_text}. Here's your reply!"

if __name__ == '__main__':
    # Bind to '0.0.0.0' to make the server externally visible (useful for testing)
    app.run(debug=True, host='0.0.0.0', port=5001)
