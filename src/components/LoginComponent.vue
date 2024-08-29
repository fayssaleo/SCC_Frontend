<template>
  <v-container fluid fill-height class="login-container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-5" elevation="10">
          <v-card-title>
            <v-img
              src="https://your-logo-url.com/logo.png"
              max-width="150"
              class="mx-auto"
            ></v-img>
          </v-card-title>
          <v-card-subtitle class="text-center mb-4">
            <span class="headline">Login</span>
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="login" ref="form">
              <v-text-field
                label="Email"
                v-model="email"
                :rules="[rules.required, rules.email]"
                required
                prepend-icon="mdi-email"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                :rules="[rules.required]"
                required
                prepend-icon="mdi-lock"
                type="password"
                outlined
                dense
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                block
                class="mt-4"
                elevation="2"
                :loading="loading"
              >
                Login
              </v-btn>
            </v-form>
            <v-alert v-if="errorMessage" type="error" class="mt-4">
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
      }
    };
  },
  methods: {
    async login() {
  if (this.$refs.form.validate()) {
    this.loading = true;
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', {
        email: this.email,
        password: this.password
      });

      if (response.data.status === 200) {
        localStorage.setItem('token', response.data.payload.token);
        this.$store.commit('setToken', response.data.payload.token);  // Stocker le token dans le store Vuex
        this.$router.push('/home');
      } else {
        this.errorMessage = 'Incorrect email or password!';
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          this.errorMessage = 'Incorrect email or password!';
        } else if (error.response.status === 400) {
          this.errorMessage = 'Validation error!';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      } else {
        this.errorMessage = 'An error occurred during login. Please try again later.';
      }
      console.error('Login error:', error);
    } finally {
      this.loading = false;
    }
  }
}
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 15px;
}

.v-text-field {
  margin-bottom: 20px;
}

.v-btn {
  text-transform: none;
  font-weight: bold;
}

.v-alert {
  border-radius: 5px;
}

.headline {
  font-size: 24px;
  font-weight: bold;
}

.mt-4 {
  margin-top: 16px;
}

.login-container {
  /* Assurez-vous que la page de connexion est centrée et prend toute la hauteur */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Couleur de fond spécifique */
}
</style>
