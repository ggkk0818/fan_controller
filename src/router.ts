import Vue from "vue";
import Router from "vue-router";
import Home from "./views/dashboard/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/host",
      name: "host",
      component: () => import("./views/Host.vue")
    }
  ]
});
