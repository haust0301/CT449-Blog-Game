import { createApp } from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

const options = {
  confirmButtonColor: '#6b00d7',
  cancelButtonColor: '#404449',
};

app.use(router).use(store).use(VueAxios, axios).use(VueSweetalert2, options);

app.config.globalProperties.axios = axios;

// Development
axios.defaults.baseURL = "http://localhost:5000/api";

// Production
// axios.defaults.baseURL = `/api`;

app.mount("#app");