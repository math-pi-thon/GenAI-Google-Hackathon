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

## Usage
Open the chat UI in your browser.
Type in your DSA-related question or problem.
The AI will guide you to the solution through a series of Socratic questions.

## Challenges
One of the key challenges was handling conversation history effectively to ensure the AI could maintain context across multiple exchanges. We overcame this by passing the conversation history back to the Gemini model on each API call, allowing it to understand and respond based on prior interactions. Additionally, we faced rate-limiting issues from the Gemini API, which required optimizing how we structure and batch our requests to ensure smooth user interactions.

## Future Opportunities
Expansion to Other Domains: While currently focused on DSA, Codey can be extended to cover additional subjects such as Operating Systems, Computer Networks, or even non-technical fields.
Fine-tuning the Model: In the future, the model could be fine-tuned specifically for DSA concepts, making it even more adept at Socratic teaching in this domain.
Multi-lingual Support: Introduce support for multiple languages to make Codey accessible to non-English speakers.

## Contributing
We welcome contributions from the community! Please feel free to submit issues or pull requests. If you'd like to contribute, here's how to get started:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Submit a pull request.
