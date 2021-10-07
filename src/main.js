import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)

library.add(faUpload)
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
