const { createApp } = require('vue');
import Examples from './Examples.vue';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';

const app = createApp(Examples);
app.use(ConfirmationService);
app.use(PrimeVue);

app.use(ToastService);
app.mount('#app');
