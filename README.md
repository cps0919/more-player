## 多屏插件
    基于@easydarwin/easywasmplayer、vue3.x、typescript封装的多屏播放组件
### 依赖
    -Vue3.x
    -typescript
    -@easydarwin/easywasmplayer
### 安装插件
```
npm install more-player
```
### 引入方式
````javascript
import { createApp } from 'vue'
import App from './App.vue'
import MorePlayer from 'more-player'
import 'more-player/more-player.css'

const app = createApp(App)
app.use(MorePlayer)
app.mount('#app')
````
### 事例
```javascript
<template>
  <more-player
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
  </more-player>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "App",
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




```
### 参数
  #### 1.属性
    -src：视频流地址
    -equipment：设备信息
    -backgroundColor：背景色
    -borderColor：边框颜色
    -textCorlor：字体颜色
    -activeColor：当前激活窗口颜色
  #### 2.方法
    -videoClick(e)：返回当前选中视频的设备信息
        -参数e：active,当前激活窗口；num：当前宫格数；info：当前设备信息

