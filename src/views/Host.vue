<template>
  <div class="hosts">
    <b-table striped hover :items="hostList"></b-table>
  </div>
</template>
<script lang="ts">
import _ from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import fanService, { SocketData } from "@/services/fanService";
import Host, { HostState } from "@/model/Host";

@Component
export default class HostPage extends Vue {
  private hostList: Host[] = [];
  created() {
    fanService.on("update", this.onStateUpdate);
    this.connect();
  }
  onStateUpdate(data: SocketData) {
    this.hostList = data.hostList || [];
  }
  connect() {
    fanService.connect();
  }
}
</script>
