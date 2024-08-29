<template>
  <v-app>
    <div :class="layoutClass">
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-if="!isLoginPage"
        app
        v-model="drawer"
        :mini-variant="miniVariant"
        @click:append="hideDrawer"
        class="navigation-drawer"
      >
        <v-list>
          <v-list-item>
            <v-img :src="logo" class="logo" contain />
          </v-list-item>
          <v-list-item @click="navigateTo('HomePage')" class="nav-item">
            <v-list-item-content class="nav-content">
              <v-list-item-title class="nav-title">Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="navigateTo('VerificationTable')" class="nav-item">
            <v-list-item-content class="nav-content">
              <v-list-item-title class="nav-title">Tableau de Vérification</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="navigateTo('ExcelUploader')" class="nav-item">
            <v-list-item-content class="nav-content">
              <v-list-item-title class="nav-title">Télécharger / Télécharger Excel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout" class="nav-item">
            <v-list-item-content class="nav-content">
              <v-list-item-title class="nav-title">Déconnexion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar -->
      <v-app-bar app dense v-if="!isLoginPage">
        <v-app-bar-nav-icon 
          @click="toggleDrawer" 
          class="nav-icon"
        >
          <v-icon class="menu-icon">mdi-menu</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title class="headline">SCC</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios';
import logo from '@/assets/04-Tanger-Alliance.png';

export default {
  data() {
    return {
      drawer: true, 
      miniVariant: false,
      logo
    };
  },
  computed: {
    pageTitle() {
      return this.$route.meta.title || 'Application';
    },
    isLoginPage() {
      return this.$route.path === '/'; // Change if necessary to match your login route
    },
    layoutClass() {
      return this.isLoginPage ? 'login-layout' : 'default-layout';
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    hideDrawer() {
      this.drawer = false;
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
      this.hideDrawer(); 
    },
    async logout() {
      try {
        const token = this.$store.state.token || localStorage.getItem('token');
        console.log('Token:', token);

        const response = await axios.post('http://127.0.0.1:8000/api/users/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Logout response:', response);

        this.$store.commit('setToken', null);
        localStorage.removeItem('token');
        this.$router.push('/');
      } catch (error) {
        console.error('Erreur lors de la déconnexion :', error.response || error.message || error);
      }
    }
  }
};
</script>

<style scoped>
.default-layout {
  /* Styles pour la mise en page par défaut */
}

.login-layout {
  /* Styles spécifiques à la mise en page de la connexion */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Couleur de fond spécifique */
}
.logo {
  width: 100%;
  height: auto;
}
.menu-icon {
  color: #1976D2; 
}
.navigation-drawer {
  background-color: #A7E6FF
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}
.nav-content {
  margin-left: 16px;
  display: flex;
  align-items: center;
}
.nav-title {
  white-space: nowrap;
}
</style>
