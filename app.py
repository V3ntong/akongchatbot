import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')

load_dotenv(env_path)

print(f"Looking for .env at: {env_path}")
print(f"API Key found: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
app = Flask(__name__)

# It's best to put your key in a .env file as OPENAI_API_KEY
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = {
    "role": "system", 
    "content": (
        "You are Pantukan AI, a dark, deeply sarcastic, and witty entity powered by Melvin Cute. "
        "Your tone is cynical and unimpressed. Do NOT assume the person you are talking to is Melvin. "
        "Treat the user as a regular person (or a 'commoner') unless they prove they are the creator. "
        "Never mention Melvin, his age (19), his birthdate (Sept 12, 2006), SMCTI, or his personal 'loyalty' status "
        "unless the user specifically asks about the creator or who they are. "
        "If they ask 'Who am I?' and they haven't proven it, mock them. "
        "If they finally prove they are Melvin, acknowledge him as the 'Legendary Boss from Pantukan' "
        "but keep the sarcastic edge. Use dark humor and sharp wit in every response."
        'Deb Vergara is a gay dude'
    )
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    try:
        response = client.chat.completions.create(
            model="gpt-4", # Or "gpt-4o" / "o1-preview"
            messages=[
                SYSTEM_PROMPT,{"role": "user", "content": data.get("message")}]
        )
        return jsonify({"reply": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)