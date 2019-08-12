<template>
  <div class="host-wrapper">
    <b-row>
      <b-col>1 of 3</b-col>
      <b-col>2 of 3</b-col>
      <b-col>3 of 3</b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import "vue-slider-component/theme/default.css";
import Host, { HostState, OFF_LINE, ON_LINE } from "@/model/Host";

@Component
export default class StatePanel extends Vue {
  @Prop() private hostList!: Host[];
}
</script>
<style lang="scss" scoped>
.host-wrapper {
  margin: 20px auto;
}
</style>
