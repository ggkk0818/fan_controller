<template>
  <div class="fan-list">
    <div class="fan" v-for="item of fanList" :key="item.id">
      <img ref="fan" :src="fanImg" />
      <p class="text text-muted">
        {{ item.rpm }}rpm<br />{{ item.load | toPercent }}%
        <!-- <count-to
          :start-val="0"
          :end-val="item.load * 100"
          :duration="300"
          :decimals="0"
          suffix="%"
        /> -->
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import countTo from "vue-count-to";
import fanImg from "@/assets/fan.png";
import { TweenLite, TimelineMax, Power0 } from "gsap";
import Fan from "@/model/Fan";
import { getTimeScale } from "@/utils";

declare type AnimateHolder = {
  percent: number;
  fromScale: number[];
};

@Component({
  components: {
    countTo
  },
  filters: {
    toPercent(val: number): string {
      return (val * 100).toFixed(0);
    }
  }
})
export default class FanList extends Vue {
  @Prop() private fanList!: Fan[];
  lastFanList: Fan[] = [];
  fanImg: any = fanImg;
  timeline: TimelineMax[] = [];
  animateHolder: AnimateHolder = { percent: 0, fromScale: [] };
  mounted() {
    if (this.fanList.length > 0 && this.timeline) {
      this.startAnimation();
    }
  }
  startAnimation() {
    if (this.timeline.length) {
      this.timeline.forEach(item => {
        item.kill();
      });
      this.timeline.splice(0, this.timeline.length);
    }
    (<Array<HTMLBaseElement>>this.$refs.fan).forEach(item => {
      let t = new TimelineMax({ repeat: -1 });
      t.fromTo(
        item,
        2,
        { rotation: 0 },
        { rotation: 360, ease: Power0.easeInOut }
      );
      this.timeline.push(t);
    });
  }
  updateAnimation() {
    const vm = this;
    this.animateHolder.fromScale = this.timeline.map(item => {
      return item.timeScale();
    });
    TweenLite.killTweensOf(this.animateHolder);
    TweenLite.to(this.animateHolder, 2, {
      percent: 1,
      onUpdate: function() {
        vm.fanList.forEach((item: Fan, index: number) => {
          let scale = getTimeScale(item.load);
          let oldScale = vm.animateHolder.fromScale[index];
          let current = oldScale + (scale - oldScale) * this.ratio;
          vm.timeline[index].timeScale(current);
        });
      }
    });
  }
  @Watch("fanList", { deep: true })
  onFanListChanged(val: Fan[]) {
    let isFanChanged = false;
    if (val.length !== this.lastFanList.length) {
      isFanChanged = true;
    } else {
      let index = val.length;
      while (index-- && !isFanChanged) {
        if (val[index] !== this.lastFanList[index]) {
          isFanChanged = true;
        }
      }
    }
    if (isFanChanged) {
      this.$nextTick(this.startAnimation);
    } else {
      this.updateAnimation();
    }
    this.lastFanList = Array.from(val);
  }
}
</script>

<style scoped lang="scss">
.fan-list {
  display: flex;
  width: 100%;
  margin-bottom: 50px;
  align-items: flex-start;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: center;
  .fan {
    position: relative;
    width: 45%;
    max-width: 200px;
    border: 5px solid #333;
    border-radius: 50%;
    margin: 10px 10px 30px;
    img {
      width: 100%;
      transform-origin: 50% 50%;
    }
    .text {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: 0;
      padding: 5px 10px;
      text-align: center;
    }
  }
}
</style>
