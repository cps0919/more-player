<template>
  <MorePlayer
    :src="src"
    :equipment="equipment"
    :backgroundColor="backgroundColor"
    :borderColor="borderColor"
    :activeColor="activeColor"
    :textColor="textColor"
    @videoClick="videoClick"
  >
    <!-- <template #option0>删除icon </template>
    <template #option-1>截屏icon </template>
    <template #option1>一宫格icon </template>
    <template #option4>四宫格icon </template>
    <template #option9>九宫格icon </template>
    <template #option16>十六宫格icon </template> -->
  </MorePlayer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
// import MorePlayer from "@/components/more-player.vue";

export default defineComponent({
  name: "App",
  // components: { MorePlayer },
  setup() {
    let state = reactive({
      src: "ws://10.0.60.168:80/rtp/00000001.flv",
      equipment: null, //设备信息
      backgroundColor: "transparent",
      borderColor: "rgba(69, 162, 255, 0.8)",
      activeColor: "#ffe100",
      textColor: "white",
    });
    const videoClick = (e: { active: number; num: number; info: any }) => {
      console.log(e);
    };
    return {
      ...toRefs(state),
      videoClick,
    };
  },
});
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
  background: url("./assets/bg.110420cf.png");
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
  box-sizing: border-box;
}
</style>
