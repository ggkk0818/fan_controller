<template>
  <div class="home">
    <fan-list :fanList="fanList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FanList from "./components/FanList.vue"; // @ is an alias to /src
import Fan from "@/model/Fan";

@Component({
  components: {
    FanList
  }
})
export default class Home extends Vue {
  fanList: Fan[] = [];
  created() {
    this.fanList.push({
      id: 1,
      name: "Fan1",
      load: 0,
      rpm: 0
    });
    setTimeout(() => {
      this.fanList[0].load = 1;
    }, 3000);
  }
}
</script>
