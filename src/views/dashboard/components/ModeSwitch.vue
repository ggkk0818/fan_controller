<template>
  <div class="mode-switch-wrapper">
    <b-button-group>
      <b-button
        variant="outline-info"
        :pressed="mode === CONTROL_MODE.MODE_PERFORMANCE"
        @click="mode = CONTROL_MODE.MODE_PERFORMANCE"
        >Performance</b-button
      ><b-button
        variant="outline-info"
        :pressed="mode === CONTROL_MODE.MODE_SILENCE"
        @click="mode = CONTROL_MODE.MODE_SILENCE"
        >Silence</b-button
      ><b-button
        variant="outline-info"
        :pressed="mode === CONTROL_MODE.MODE_MANUAL"
        @click="mode = CONTROL_MODE.MODE_MANUAL"
        >Manual</b-button
      >
    </b-button-group>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import fanService, {
  MODE_MANUAL,
  MODE_PERFORMANCE,
  MODE_SILENCE,
  ControlMode
} from "@/services/fanService";

@Component
export default class ModeSwitch extends Vue {
  @Prop() private value!: ControlMode;
  get CONTROL_MODE() {
    return { MODE_MANUAL, MODE_PERFORMANCE, MODE_SILENCE };
  }
  get mode(): ControlMode {
    return this.value;
  }
  set mode(val: ControlMode) {
    if (val !== this.value) {
      this.$emit("input", val);
    }
  }
}
</script>
<style lang="scss" scoped>
.slidebar-wrapper {
  margin: 20px auto;
}
</style>
