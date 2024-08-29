import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Import des icônes Material Design
import '@mdi/font/css/materialdesignicons.css';

// Importer le store Vuex
import store from './store';

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(vuetify) // Utiliser Vuetify
  .use(router) // Utiliser Vue Router
  .use(store) // Utiliser Vuex
  .mount('#app');
