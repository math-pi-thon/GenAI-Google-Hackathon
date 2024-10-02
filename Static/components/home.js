export default {
  template: `
    <div class="container-fluid px-0">
      <!-- Main Banner Section -->
      <div class="jumbotron jumbotron-fluid bg-primary text-white text-center py-5 mb-0">
        <div class="container">
          <h1 class="display-4 font-weight-bold">Welcome to the AI Teaching Assistant</h1>
          <p class="lead">
            Master Data Structures and Algorithms through an interactive Socratic method, guided by our AI assistant.
          </p>
          <hr class="my-4 bg-white">
          <p class="mb-4">
            Enhance your problem-solving skills with personalized feedback and challenges.
          </p>
          <button class="btn btn-light btn-lg" @click="startChat">
            Start Learning
          </button>
        </div>
      </div>

      <!-- Socratic Method Section -->
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="mb-4">The Power of the Socratic Method</h2>
            <p class="lead">
              Discover a learning approach that dates back to ancient Greece, now enhanced with cutting-edge AI technology.
            </p>
            <p>
              The Socratic method, rooted in the philosophy of Socrates, believes that knowledge emerges through questioning and dialogue. Our AI assistant employs this method to guide you through complex topics, stimulating critical thinking and uncovering assumptions.
            </p>
            <p>
              By engaging in this cooperative argumentative dialogue, you'll develop a deeper understanding of Data Structures and Algorithms, constructing your own insights and connecting concepts in meaningful ways.
            </p>
          </div>
        </div>
      </div>

      <!-- AI Benefits Section -->
      <div class="container-fluid bg-light py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 order-lg-1">
              <h2 class="mb-4">AI-Powered Learning</h2>
              <p class="lead">
                Experience a revolutionary blend of ancient wisdom and modern technology.
              </p>
              <ul class="list-unstyled">
                <li class="mb-3"><i class="fas fa-check-circle text-success mr-2"></i> Personalized learning experience</li>
                <li class="mb-3"><i class="fas fa-check-circle text-success mr-2"></i> Real-time assessment and feedback</li>
                <li class="mb-3"><i class="fas fa-check-circle text-success mr-2"></i> Adaptive questioning based on your progress</li>
                <li class="mb-3"><i class="fas fa-check-circle text-success mr-2"></i> Self-paced exploration of complex concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Topics Section -->
      <div class="container py-5">
        <h2 class="text-center mb-5">Start Your Learning Journey</h2>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="(topic, index) in topics" :key="index">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ topic.name }}</h5>
                <p class="card-text flex-grow-1">{{ topic.description }}</p>
                <button class="btn btn-outline-primary mt-auto" @click="goToTopic(topic.name)">
                  Explore {{ topic.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Flash Layer Disclaimer Section -->
      <div class="container-fluid bg-danger text-white text-center py-3">
        <p class="mb-0">
          <strong>Disclaimer:</strong> The AI chatbot may make mistakes or provide inaccurate information. Always cross-check with trusted sources.
        </p>
      </div>
    </div>
  `,
  data() {
    return {
      topics: [
        { name: "Problems", description: "Tackle various algorithmic challenges to sharpen your problem-solving skills." },
        { name: "Notes", description: "Access comprehensive study materials covering key DSA concepts." },
        { name: "Playlists", description: "Follow curated learning paths designed to guide your DSA journey." },
      ],
    };
  },
  methods: {
    startChat() {
      if (this.is_logged_in) {
        this.$router.push('/api/chatbot');
      } else {
        this.showLoginWarning();
      }
    },
    goToTopic(topic) {
      if (this.is_logged_in) {
        if (topic === 'Problems') {
          this.$router.push('/api/problems');
        } else if (topic === 'Notes') {
          window.open('https://drive.google.com/drive/folders/1-dPY1TGo-odvVi40qHi7IrX3Q8-8PpaP?usp=sharing', '_blank');
        } else if (topic === 'Playlists') {
          this.$router.push('/api/playlist');
        }
      } else {
        this.showLoginWarning();
      }
    },
    showLoginWarning() {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in first to start learning.',
        confirmButtonText: 'Log In',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/login');
        }
      });
    },
    loadPreviousChat(sessionId) {
      fetch(`/api/chat_sessions/${sessionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load previous chat');
          }
          return response.json();
        })
        .then(data => {
          this.messages = data.map((session) => ({
            userMessage: session.user_message,
            assistantMessage: session.assistant_response,
          }));
          this.$nextTick(() => {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
        })
        .catch(error => {
          console.error('Error loading previous chat:', error);
          alert('Failed to load previous chat. Please try again.');
        });
    },
  },
  computed: {
    is_logged_in() {
      return localStorage.getItem('username') !== null;
    },
  },
};
