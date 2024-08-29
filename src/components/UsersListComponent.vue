<template>
  <div class="container mt-4">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="editUser(user.id)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UsersListComponent',
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      const token = localStorage.getItem('token');
      axios.get('http://127.0.0.1:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        this.users = response.data.payload;
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
    },
    // editUser(userId) {
    //   this.$router.post(`/updateuser/`);
    // },
//    deleteUser(userId) {
//   const token = localStorage.getItem('token');
//   axios.post(`http://127.0.0.1:8000/api/users/delete`, {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(response => {
//     this.fetchUsers();
//     console.log('User deleted successfully:', response.data);
//   })
//   .catch(error => {
//     console.error('Error deleting user:', error);
//   });
// }

  }
};
</script>
