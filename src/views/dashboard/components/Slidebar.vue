<template>
  <div class="slidebar-wrapper">
    <vue-slider
      direction="btt"
      :width="8"
      :height="180"
      :dot-size="48"
      :max="1"
      :interval="0.01"
      v-model="percent"
    ></vue-slider>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

@Component({
  components: {
    VueSlider
  }
})
export default class Slidebar extends Vue {
  @Prop() private value!: number;
  get percent(): number {
    return this.value;
  }
  set percent(val: number) {
    this.$emit("input", val);
  }
}
</script>
<style lang="scss" scoped>
.slidebar-wrapper {
  width: 52px;
  margin: 20px auto;
}
</style>
