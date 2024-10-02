
export default {
    template: `
    <div class="container mt-5 mb-5">
        <div class="card mx-auto p-5 bg-light" style="max-width: 400px;">
            <h2 class="text-center mb-4">Register</h2>
            <div class="mb-3">
                <label for="user_username" class="form-label">Username</label>
                <input type="text" class="form-control" id="user_username" placeholder="Username" v-model="register_details.username">
            </div>
            <div class="mb-3">
                <label for="user_email" class="form-label">Email</label>
                <input type="email" class="form-control" id="user_email" placeholder="Email" v-model="register_details.email">
            </div>
            <div class="mb-3">
                <label for="user_password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user_password" placeholder="Password" v-model="register_details.password">
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-primary w-100" @click="register">Register</button>
            </div>
            <p class="text-center mt-3"> 
                Already a User? <button type="button" class="btn btn-link p-0" @click="login">Login</button>
            </p>
        </div>
    </div>`,
    data() {
        return {
            register_details: {
                email: null,
                username: null,
                password: null,
            },
        };
    },
    methods: {
        async register() {
            // Check for empty fields
            if (!this.register_details.username || !this.register_details.email || !this.register_details.password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fields Reqiured',
                    text: 'Email, Username, and Password are required.',
                });
                return;
            }
            // Check for valid email
            if (!this.isValidEmail(this.register_details.email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid email address',
                    text: 'Please enter a valid email address.',
                });
                return;
            }
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.register_details)
                });
                if (response.status === 201) {
                    const response_data = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response_data.message,
                    });
                    this.$router.push('/login');
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong! Please try again later.',
                });
            }
        },

        login() {
            this.$router.push('/login');
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
};


