import { createApp } from 'vue'
/* storage is a var and app.vue is stored inside it */
import storage_variable from './App.vue'
import './index.css'

/* here it mount that storage var under .con class of html file */
createApp(storage_variable).mount('.con');