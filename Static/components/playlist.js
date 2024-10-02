export default {
  template: `
    <div class="container-fluid px-0 dsa-playlists">
      <!-- Main Banner Section -->
      <div class="jumbotron jumbotron-fluid bg-gradient text-white text-center py-5 mb-0">
        <div class="container">
          <h1 class="display-3 font-weight-bold text-dark">🚀 DSA Playlists</h1>
          <p class="lead text-secondary">
            Level up your coding skills with these awesome Data Structures and Algorithms playlists!
          </p>
          <hr class="my-4 bg-white">
          <p class="mb-4">
            Hand-picked by coding experts to supercharge your learning journey. 🎓💻
          </p>
        </div>
      </div>

      <!-- Playlist Section -->
      <div class="container py-5">
        <h2 class="text-center mb-5 section-title">🔥 Top Playlists 🔥</h2>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="(playlist, index) in playlists" :key="index">
            <div class="card h-100 playlist-card">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ playlist.title }}</h5>
                <p class="card-text flex-grow-1">{{ playlist.description }}</p>
                <a :href="playlist.link" target="_blank" class="btn btn-primary mt-auto">
                  <i class="fas fa-play-circle mr-2"></i> Watch Now
                </a>
              </div>
              <div class="card-footer text-muted">
                <i class="fas fa-video mr-2"></i> {{ playlist.videoCount }} videos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      playlists: [], // To hold the fetched playlists
    };
  },

  methods: {
    async fetchPlaylists() {
      try {
        const response = await fetch('/api/playlists');
        this.playlists = await response.json();
      } catch (error) {
        console.error('Error fetching playlists:', error);
        // Show error message to user
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load playlists. Please try again later!',
        });
      }
    },
  },

  mounted() {
    // Fetch playlists when component is mounted
    this.fetchPlaylists();
  },
};