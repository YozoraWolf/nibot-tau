import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";

import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const pinia = createPinia();
const app = createApp(App);

app.use(Quasar, {
    config: {
        dark: true /* look at QuasarConfOptions from the API card */
      }
});


app.use(pinia);
app.use(router);

app.mount("#app");
