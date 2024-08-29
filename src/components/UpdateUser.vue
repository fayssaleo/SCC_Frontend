<template>
  <div>
    <h2>Update User Information</h2>
    <form @submit.prevent="updateUser">

      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="user.password">
      </div>
      <button type="submit">Update</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {

        email: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async fetchUser() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async updateUser() {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://127.0.0.1:8000/api/users/update/${this.user.id}`, this.user, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.$router.push('/Userslist');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = 'Failed to update user information!';
        } else {
          this.errorMessage = 'An error occurred during update. Please try again later.';
        }
        console.error('Update error:', error);
      }
    }

  },
  mounted() {
    this.fetchUser();
  }
};
</script>

<style>
/* Votre style ici */
</style>
