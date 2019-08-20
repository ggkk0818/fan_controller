<template>
  <div class="hosts">
    <b-table striped hover :items="hostList" :fields="fields">
      <template slot="index" slot-scope="data">
        {{ data.index + 1 }}
      </template>
      <template slot="name" slot-scope="data">
        {{ data.item.name
        }}<b-badge variant="primary" v-if="data.item.isCurrent">me</b-badge>
      </template>
      <template slot="cmdList" slot-scope="data">
        <b-badge variant="info" v-for="cmd of data.item.cmdList" :key="cmd">{{
          cmd
        }}</b-badge>
      </template>
      <template slot="hostData" slot-scope="data">
        <template v-if="data.item.hostData">
          CPU:{{ data.item.hostData.cpuTemp }}&#8451;<br />
          GPU:{{ data.item.hostData.gpuTemp }}&#8451;
        </template>
        <template v-else>
          N/A
        </template>
      </template>
    </b-table>
  </div>
</template>
<script lang="ts">
import _ from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import fanService, { SocketData } from "@/services/fanService";
import Host, { HostState, OFF_LINE, ON_LINE } from "@/model/Host";

@Component
export default class HostPage extends Vue {
  private hostList: Host[] = [];
  private fields: Array<string | Object> = [
    { key: "index", label: "#" },
    { key: "name", label: "Host Name" },
    { key: "ip", label: "Ip" },
    { key: "cmdList", label: "Commands" },
    { key: "hostData", label: "Temperature" }
  ];
  get HOST_STATE() {
    return { OFF_LINE, ON_LINE };
  }
  created() {
    fanService.on("update", this.onStateUpdate);
    this.connect();
  }
  onStateUpdate(data: SocketData) {
    if (data.hostList) {
      this.hostList = data.hostList;
    }
  }
  connect() {
    fanService.connect();
  }
}
</script>
<style lang="scss" scoped>
.badge {
  margin: 0 5px;
  vertical-align: text-bottom;
}
</style>
