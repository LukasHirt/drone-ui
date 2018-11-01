import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import Router from "vue-router";
import {messages, resolve} from "./locales";
import router from "./router/router";
import store from "./store";
import {sync} from 'vuex-router-sync';
import {authorizer, defaultParams} from "./router/gates";
import {fetcher} from "./router/fetch";

Vue.use(Router);
Vue.use(VueI18n)
Vue.config.productionTip = false;

sync(store, router)

// configure internationalization.
const i18n = new VueI18n({
  locale: resolve(window),
  messages,
});

// configure routing.
router.beforeEach(defaultParams);
router.beforeEach(authorizer(store, window));
router.beforeEach(fetcher(store));

// dispatch requests to subscribe to the global event
// feed and to load the currently authenticated user
// account.
store.dispatch('streamEvents');
store.dispatch('fetchViewer').then(() => {
  // once the attempt to ascertain the currently
  // authenticated user completes, load the application.
  new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});

