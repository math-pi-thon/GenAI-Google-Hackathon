export default {
    template: `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
              <a class="navbar-brand" href="/">Codey</a>
              
              <!-- Navbar toggler for mobile -->
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
  
              <!-- Navbar links -->
              <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">
                      <li class="nav-item" v-if="!is_logged_in">
                          <button class="nav-link" @click="home">Home</button>
                      </li>
                      <li class="nav-item" v-if="!is_logged_in">
                          <button class="nav-link" @click="login">Login</button>
                      </li>
                      <li class="nav-item" v-if="!is_logged_in">
                          <button class="nav-link" @click="register">Register</button>
                      </li>
                      <li class="nav-item" v-if="is_logged_in">
                          <button class="nav-link" @click="dashboard">Chatbot</button>
                      </li>                   
                      <li class="nav-item" v-if="is_logged_in">
                          <button class="nav-link" @click="logout">Logout</button>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>`,
    data() {
        return {
            role: [], // This can be adjusted based on your requirements
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('username'); // Remove username or any relevant data
            this.$router.push('/'); // Redirect to the home page
        },
        dashboard() {
            this.$router.push('/api/chatbot');
        },
        home() {
            this.$router.push('/');
        },
        register() {
            this.$router.push('/register');
        },
        login() {
            this.$router.push('/login');
        },
    },
    computed: {
        is_logged_in() {
            return localStorage.getItem('username') !== null; // Check if the username exists in local storage
        },
    },
};
