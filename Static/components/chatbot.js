export default {
    template: `
      <div class="chat-interface">
        <!-- Sidebar -->
        <div class="chat-sidebar p-4">
          <h5 class="sidebar-title mb-3">Previous Chats</h5>
          <ul class="chat-sessions-list">
            <li v-for="session in chatSessions" :key="session.id" 
                @click="loadPreviousChat(session.id)"
                class="chat-session-item">
              {{ session.user_message }}
            </li>
          </ul>
          <button class="new-chat-btn w-100 mt-3" @click="startNewChat">New Chat</button>
        </div>
        
        <!-- Chat Area -->
        <div class="chat-container">
          <div class="chat-window" ref="chatWindow">
            <div v-for="(message, index) in messages" :key="index" 
                 class="chat-message"
                 :class="{'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant'}">
              <div class="message-bubble">
                <span>{{ message.text }}</span>
              </div>
            </div>
          </div>
  
          <div class="chat-input-area">
            <form @submit.prevent="sendMessage">
              <input 
                v-model="newMessage" 
                type="text" 
                class="chat-input"
                placeholder="Type your message..." 
                aria-label="User message" 
                aria-describedby="send-btn">
              <button class="send-btn" type="submit" id="send-btn">Send</button>
            </form>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        newMessage: '',
        messages: [{ role: 'assistant', text: 'Hello! How can I help you today?' }],
        chatSessions: []
      };
    },
    methods: {
      startNewChat() {
        this.messages = [{ role: 'assistant', text: 'Hello! How can I help you today?' }];
        this.loadChatSessions();
      },
      loadChatSessions() {
        fetch('/api/chat_sessions')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch chat sessions');
            }
            return response.json();
          })
          .then(data => {
            this.chatSessions = data;
          })
          .catch(error => {
            console.error('Error fetching chat sessions:', error);
            alert('Failed to load chat sessions. Please try again.');
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
            this.messages = [
              { role: 'user', text: data.user_message },
              { role: 'assistant', text: data.assistant_response }
            ];
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
      sendMessage() {
        if (this.newMessage.trim()) {
          const userMessage = this.newMessage;
          this.messages.push({ role: 'user', text: userMessage });
          this.newMessage = '';
  
          this.$nextTick(() => {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
  
          this.getAssistantResponse(userMessage);
        }
      },
      getAssistantResponse(userMessage) {
        fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: userMessage }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            this.messages.push({ role: 'assistant', text: data.response });
            this.$nextTick(() => {
              const chatWindow = this.$refs.chatWindow;
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
          })
          .catch(error => {
            console.error('Fetch error:', error);
            this.messages.push({
              role: 'assistant',
              text: 'There was an error processing your request. Please try again later.',
            });
            this.$nextTick(() => {
              const chatWindow = this.$refs.chatWindow;
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
          });
      },
    },
    created() {
      this.loadChatSessions();
    }
  };
  