<template>
  <div class="home">
    <fan-list :fanList="fanList" />
    <slidebar v-model="speed" @input="setSpeed" />
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import FanList from "./components/FanList.vue";
import Slidebar from "./components/Slidebar.vue";
import Fan from "@/model/Fan";
import fanService, { SocketData } from "@/services/fanService";
@Component({
  components: {
    FanList,
    Slidebar
  }
})
export default class Home extends Vue {
  private fanList: Fan[] = [];
  private speed: number = 0;
  private setSpeedLoading = false;
  private setSpeedTemp: number | null = null;
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
  }
  connect() {
    fanService.connect();
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
