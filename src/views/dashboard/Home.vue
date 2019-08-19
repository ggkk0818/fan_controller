<template>
  <div class="home">
    <fan-list :fanList="fanList" />
    <mode-switch v-model="controlMode" @input="setMode" />
    <slidebar v-model="speed" @input="setSpeed" />
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import FanList from "./components/FanList.vue";
import Slidebar from "./components/Slidebar.vue";
import ModeSwitch from "./components/ModeSwitch.vue";
import Fan from "@/model/Fan";
import fanService, {
  SocketData,
  MODE_MANUAL,
  MODE_PERFORMANCE,
  MODE_SILENCE,
  ControlMode
} from "@/services/fanService";
@Component({
  components: {
    FanList,
    Slidebar,
    ModeSwitch
  }
})
export default class Home extends Vue {
  private controlMode: ControlMode | null = null;
  private fanList: Fan[] = [];
  private speed: number = 0;
  private setModeLoading = false;
  private setModeTemp: ControlMode | null = null;
  private setSpeedLoading = false;
  private setSpeedTemp: number | null = null;
  get CONTROL_MODE() {
    return { MODE_MANUAL, MODE_PERFORMANCE, MODE_SILENCE };
  }
  created() {
    fanService.on("update", this.onStateUpdate);
    this.connect();
  }
  @Watch("speed")
  onSpeedChange(val: number) {
    this.fanList.forEach(item => {
      item.load = val;
    });
  }
  onStateUpdate(data: SocketData) {
    if (data.fanList) {
      this.updateFanList(data.fanList);
    }
    if (typeof data.speed === "number") {
      this.updateSpeed(data.speed);
    }
    if (typeof data.mode === "number") {
      this.updateMode(data.mode);
    }
  }
  connect() {
    fanService.connect();
  }
  setMode(val: ControlMode): Promise<any> {
    if (this.setModeLoading) {
      this.setModeTemp = val;
      return Promise.resolve();
    }
    this.setModeLoading = true;
    return fanService
      .setMode(val)
      .finally(() => {
        this.setModeLoading = false;
      })
      .then(() => {
        if (this.setModeTemp !== null) {
          const temp = this.setModeTemp;
          this.setModeTemp = null;
          return this.setMode(temp);
        }
      });
  }
  setSpeed(val: number): Promise<any> {
    if (this.setSpeedLoading) {
      this.setSpeedTemp = val;
      return Promise.resolve();
    }
    this.setSpeedLoading = true;
    return fanService
      .setSpeed(val)
      .finally(() => {
        this.setSpeedLoading = false;
      })
      .then(() => {
        if (this.setSpeedTemp !== null) {
          const temp = this.setSpeedTemp;
          this.setSpeedTemp = null;
          return this.setSpeed(temp);
        }
      });
  }
  updateMode(mode: ControlMode) {
    this.controlMode = mode;
  }
  updateSpeed(speed: number) {
    this.speed = speed;
  }
  updateFanList(list: Fan[]) {
    if (this.fanList.length) {
      let i = this.fanList.length;
      while (--i >= 0) {
        if (!_.find(list, { id: this.fanList[i].id })) {
          this.fanList.splice(i, 1);
        }
      }
    }
    if (list && list.length) {
      list.forEach(item => {
        let fan = _.find(this.fanList, { id: item.id });
        if (!fan) {
          fan = item;
          this.fanList.push(item);
        }
        Object.assign(fan, item);
      });
    }
  }
}
</script>
