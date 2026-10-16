import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PollingUnitResultView from '../views/PollingUnitResultView.vue';
import LgaSumResultView from '../views/LgaSumResultView.vue';
import AddPollingUnitView from '../views/AddPollingUnitView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/polling-unit', name: 'polling-unit', component: PollingUnitResultView },
  { path: '/lga-sum', name: 'lga-sum', component: LgaSumResultView },
  { path: '/add-polling-unit', name: 'add-polling-unit', component: AddPollingUnitView }
];

export default createRouter({
  history: createWebHistory(),
  routes
});