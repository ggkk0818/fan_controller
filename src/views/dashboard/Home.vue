<template>
  <div class="home">
    <fan-list :fanList="fanList" />
    <slidebar v-model="speed" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FanList from "./components/FanList.vue";
import Slidebar from "./components/Slidebar.vue";
import Fan from "@/model/Fan";

@Component({
  components: {
    FanList,
    Slidebar
  }
})
export default class Home extends Vue {
  fanList: Fan[] = [];
  speed: number = 0;
  created() {
    this.fanList.push({
      id: 1,
      name: "Fan1",
      load: 0,
      rpm: 0
    });
    setTimeout(() => {
      this.fanList[0].load = 1;
      this.speed = 1;
    }, 3000);
  }
  @Watch("speed")
  onSpeedChange(val: number) {
    this.fanList.forEach(item => {
      item.load = val;
    });
  }
}
</script>
