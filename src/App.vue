<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">FanController</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#/">Dashboard</b-nav-item>
          <b-nav-item href="#/host">Hosts</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="javascript:void(0);">EN</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);">ZH</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-alert class="alert-conn" variant="danger" v-model="isReconnecting">
      Connection failed, reconnecting...
    </b-alert>
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import fanService from "@/services/fanService";
@Component
export default class AppPage extends Vue {
  private isReconnecting = false;
  created() {
    fanService.on("error", () => {
      if (fanService.autoReconnect) {
        this.isReconnecting = true;
      }
    });
    fanService.on("connected", () => {
      this.isReconnecting = false;
    });
  }
}
</script>
<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.alert-conn {
  position: fixed;
  top: 40px;
  left: 50%;
  display: inline-block;
  width: auto;
  transform: translateX(-50%);
  z-index: 1;
}
</style>
