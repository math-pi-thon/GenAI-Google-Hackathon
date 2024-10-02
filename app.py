from flask import Flask, jsonify, request, render_template
import os
from flask_sqlalchemy import SQLAlchemy
import google.generativeai as genai
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SECRET_KEY'] = 'Deepubhai'
app.config['SECURITY_PASSWORD_SALT'] = 'Deepu'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
# Mock data for topics
# Mock data for topics
topics = [
    {"name": "Problems", "description": "Explore various algorithmic problems to practice and improve."},
    {"name": "Notes", "description": "Access detailed notes on different DSA concepts."},
    {"name": "Playlists", "description": "View curated playlists to enhance your learning experience."}
]


# Home route to serve the Vue.js application
@app.route('/')
def index():
    return render_template('home.html')

db = SQLAlchemy(app)
login_manager = LoginManager(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    response = db.Column(db.String(1000), nullable=False)

class UserAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    problem = db.Column(db.String(255), nullable=False)
    attempted = db.Column(db.Boolean, default=False)

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(255))
    problem = db.Column(db.String(255))
    link = db.Column(db.String(255))

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

from flask import jsonify, request
from sqlalchemy.orm import joinedload

@app.route('/api/problems', methods=['GET'])
def get_problems():
    # Fetch all problems from the database
    problems = Problem.query.all()

    # Group problems by topic and format data
    problems_data = {}
    for problem in problems:
        if problem.topic not in problems_data:
            problems_data[problem.topic] = []
        problems_data[problem.topic].append({
            'Problem': problem.problem,
            'Link': problem.link
        })

    # Fetch attempted problems for the user (assuming user_id is passed in query params)
    user_id = request.args.get('user_id')
    user_attempts = UserAttempt.query.filter_by(user_id=user_id).all()

    # Add attempted status to problems_data
    attempted_dict = {attempt.problem: attempt.attempted for attempt in user_attempts}
    
    for topic, problems in problems_data.items():
        for problem in problems:
            problem['Attempted'] = attempted_dict.get(problem['Problem'], False)

    return jsonify(problems_data)

@app.route('/api/user_id', methods=['GET'])
def get_user_id():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()  # Assuming you have a User model
    if user:
        return jsonify({'user_id': user.id}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
@app.route('/api/playlists', methods=['GET'])
def get_playlists():
    playlists = [
        {"title": "Data Structures Playlist", "link": "https://www.youtube.com/watch?v=qNGyI95E5AE&list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT&ab_channel=GateSmashers"}, 
        {"title": "Algorithms Playlist", "link": "https://www.youtube.com/watch?v=0IAPZzGSbME&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O&ab_channel=AbdulBari"}
        # Add more playlists as needed
    ]
    return jsonify(playlists)


@app.route('/api/attempt', methods=['POST'])
def save_attempt():
    data = request.json
    user_id = data['user_id']
    problem = data['problem']
    attempted = data['attempted']

    attempt = UserAttempt.query.filter_by(user_id=user_id, problem=problem).first()

    if attempt:
        attempt.attempted = attempted
    else:
        new_attempt = UserAttempt(user_id=user_id, problem=problem, attempted=attempted)
        db.session.add(new_attempt)
    
    db.session.commit()
    
    return jsonify({'message': 'Attempt status updated successfully'})



@app.route('/register', methods=['POST'])
def register():
    input_data = request.get_json()
    email = input_data.get('email')
    username = input_data.get('username')
    password = input_data.get('password')

    if not email or not username or not password:
        return jsonify({'message': 'Email, Username, and Password are required.'}), 400

    # Check if the username or email already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        if existing_user.username == username:
            return jsonify({'message': 'Username already registered.'}), 400
        if existing_user.email == email:
            return jsonify({'message': 'Email already registered.'}), 400

    # Create new user
    new_user = User(username=username, email=email, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and Password are required."}), 400

    user = User.query.filter_by(username=username).first()
    
    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            session['user_id'] = user.id
            return jsonify({"message": "Logged in successfully"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "User not found"}), 404

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user ID from session
    return jsonify({"message": "Logout successful"}), 200

# API route to get topics
@app.route('/api/topics', methods=['GET'])
def get_topics():
    return jsonify(topics)

genai.configure(api_key="AIzaSyDeKg1EOwB9V92dkSjbI5ao91wgH4wJEmQ")

# Set up the configuration for the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

# Create the model with system instructions
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="You are a teaching assistant focused exclusively on Data Structures and Algorithms (DSA). "
                       "You use the Socratic method to guide users towards answers by asking probing questions, "
                       "helping them think critically about DSA problems. If a question is not related to DSA, "
                       "politely decline and encourage them to ask DSA-related questions."
)
chat_session = model.start_chat(
  history=[
  ]
)


@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    student_question = data.get('question', '')
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        response = chat_session.send_message(student_question)
        chatbot_response = response.text

        # Store the user message and assistant response in the database
        user_message = ChatMessage(user_id=user_id, message=student_question, response=chatbot_response)
        db.session.add(user_message)
        db.session.commit()

        return jsonify({"response": chatbot_response})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/chat_sessions', methods=['GET'])
def get_chat_sessions():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # Fetch previous chat messages for the user
        sessions = ChatMessage.query.filter_by(user_id=user_id).all()

        # Prepare the response
        chat_sessions = [{"id": session.id, "user_message": session.message, "assistant_response": session.response} for session in sessions]

        return jsonify(chat_sessions)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/chat_sessions/<int:session_id>', methods=['GET'])
def get_chat_session(session_id):
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        chat_message = ChatMessage.query.filter_by(id=session_id, user_id=user_id).first()

        if not chat_message:
            return jsonify({"error": "Chat session not found"}), 404

        return jsonify({
            "user_message": chat_message.message,
            "assistant_response": chat_message.response
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Fallback route for SPA (Single Page Application)
@app.route('/<path:path>')
def fallback(path):
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
