export default {
  template: `
    <div class="container-fluid dsa-problems-list py-5">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <h1 class="display-4 text-primary font-weight-bold">🚀 DSA Challenge Zone 🚀</h1>
          <p class="lead text-secondary">Level up your coding skills! Pick a topic, solve problems, and track your progress.</p>
        </div>
      </div>

      <div v-for="(problems, topic) in problemsList" :key="topic" class="mb-4">
        <div class="card shadow border-0 topic-card">
          <div class="card-header bg-gradient">
            <button class="btn btn-link w-100 text-white d-flex align-items-center justify-content-between" @click="toggleTopic(topic)">
              <h5 class="mb-0 font-weight-bold text-dark">{{ topic }}</h5>
              <span class="toggle-icon">{{ expandedTopics.includes(topic) ? '▲' : '▼' }}</span>
            </button>
          </div>
          <div v-show="expandedTopics.includes(topic)" class="card-body bg-light">
            <ul class="list-group">
              <li v-for="(problem, index) in problems" :key="index" 
                  class="list-group-item d-flex justify-content-between align-items-center problem-item"
                  :class="{'completed': attempted[problem['Problem']]}">
                <a :href="problem['Link']" target="_blank" class="problem-link">{{ problem['Problem'] }}</a>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" 
                         class="custom-control-input"
                         :id="'checkbox-' + topic + '-' + index"
                         v-model="attempted[problem['Problem']]"
                         @change="updateAttempted(problem['Problem'], attempted[problem['Problem']])">
                  <label class="custom-control-label" :for="'checkbox-' + topic + '-' + index">Attempted</label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      problemsList: {},
      expandedTopics: [],
      attempted: {},
      username: localStorage.getItem('username'),
      userId: null
    };
  },
  methods: {
    fetchUserId() {
      fetch(`/api/user_id?username=${this.username}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('User not found');
        })
        .then(data => {
          this.userId = data.user_id;
          this.fetchProblems();
        })
        .catch(error => {
          console.error('Error fetching user ID:', error);
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load user data. Please try logging in again!',
          });
        });
    },
    fetchProblems() {
      if (!this.userId) return;
      fetch(`/api/problems?user_id=${this.userId}`)
        .then(response => response.json())
        .then(data => {
          this.problemsList = data;
          this.initializeAttemptedStatus();
        })
        .catch(error => {
          console.error('Error fetching problems:', error);
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load problems. Please try again later!',
          });
        });
    },
    toggleTopic(topic) {
      if (this.expandedTopics.includes(topic)) {
        this.expandedTopics = this.expandedTopics.filter(t => t !== topic);
      } else {
        this.expandedTopics.push(topic);
      }
    },
    initializeAttemptedStatus() {
      for (const topic in this.problemsList) {
        this.problemsList[topic].forEach(problem => {
          this.$set(this.attempted, problem['Problem'], problem['Attempted']);
        });
      }
    },
    updateAttempted(problem, attemptedStatus) {
      if (!this.userId) return;
      fetch('/api/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: this.userId,
          problem: problem,
          attempted: attemptedStatus
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        this.$swal({
          icon: 'success',
          title: 'Progress Saved!',
          text: attemptedStatus ? 'Keep up the great work!' : 'No worries, you can always try again!',
          timer: 1500,
          showConfirmButton: false
        });
      })
      .catch(error => {
        console.error('Error saving attempt:', error);
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save your progress. Please try again!',
        });
      });
    }
  },
  mounted() {
    this.fetchUserId();
  }
};