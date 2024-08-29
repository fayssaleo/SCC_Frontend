import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import UsersListComponent from '../components/UsersListComponent.vue';
import ExcelUploader from '../components/ExcelUploader.vue';
import AnomaliesPage from '../components/AnomaliesPage.vue';
import VerificationTable from '../components/VerificationTable.vue';
import HomePage from '../components/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'LoginComponent',
    component: LoginComponent
  },
  {
    path: '/userslist',
    name: 'UsersListComponent',
    component: UsersListComponent
  },
  {
    path: '/importexcel',
    name: 'ExcelUploader',
    component: ExcelUploader
  },
  {
    path: '/anomalies',
    name: 'AnomaliesPage',
    component: AnomaliesPage
  },
  {
    path: '/verifications',
    name: 'VerificationTable',
    component: VerificationTable
  },
  {

  
  path: '/home',
  name: 'HomePage',
  component: HomePage
}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
