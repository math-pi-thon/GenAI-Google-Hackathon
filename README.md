# Codey - Socratic DSA Teaching Assistant

Codey is an AI-powered teaching assistant designed to help users learn Data Structures and Algorithms (DSA) using the Socratic method. It guides students to solutions by asking progressively specific and detailed questions, fostering deep understanding and critical thinking in the domain of DSA. Built using the power of Google's Gemini API, Codey serves as an intelligent and interactive learning tool for those looking to master DSA concepts.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Challenges](#challenges)
- [Future Opportunities](#future-opportunities)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Socratic Learning**: Guides students to answers by asking questions.
- **Interactive Chat UI**: Similar to modern conversational AI interfaces (e.g., ChatGPT).
- **Conversation History**: Stores the full chat history, allowing the model to keep track of context and respond intelligently.
- **Data Structures and Algorithms (DSA) Focused**: Custom-designed for teaching DSA topics.

## Technologies Used
- **Backend**: Flask, Google Gemini API
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Database**: SQLite
- **Deployment**: Vercel
- **Others**: Jinja2 for templating

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/math-pi-thon/GenAI-Google-Hackathon.git
   cd GenAI-Google-Hackathon
   ```
2. Set up a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Add your Gemini API key:
   - Open app.py and replace the API_KEY with your Gemini API key.
4. Run the Flask application:
   ```bash
   flask run
   ```
5. Visit http://localhost:5000 in your browser to use Codey.
