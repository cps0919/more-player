<template>
  <div class="video-content">
    <div class="video" ref="videoContent">
      <div
        class="video-item"
        v-for="(item, index) in acModel.num"
        :key="index"
        :style="[modelFun(acModel.num)]"
      >
        <!-- <LivePlayer :src="equipmentArr[0]['src']"></LivePlayer> -->
        <div
          class="video-main"
          @click="modelClick(acModel.num, index)"
          :style="[mianFun(), acModelFUc(index)]"
        >
          <div :id="`videoElement${index}`"></div>
        </div>
      </div>
    </div>
    <div class="option" ref="option">
      <span
        v-for="(item, index) in options"
        :key="index"
        class="video-icon"
        :class="{ [item.icon]: true }"
        :style="acIconClor(item)"
        @click="iconClick(item)"
      >
        <slot :name="`num${item.num}`">{{ item.name }}</slot>
      </span>
    </div>
  </div>
</template>
<script lang='ts'>
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  toRefs,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import WasmPlayer from "@easydarwin/easywasmplayer";
// import LivePlayer from '@liveqing/liveplayer'
interface StateProps {
  options: Array<{ icon: string; name: string; num: number }>;
  acModel: { num: number; active: number; info: any };
  videoArr: any[];
  equipmentArr: any[];
  kbs: number;
}
export default defineComponent({
  props: {
    backgroundColor: {
      type: String,
      default: "transparent",
    },
    textColor: {
      type: String,
      default: "white",
    },
    borderColor: {
      type: String,
      default: "rgba(69, 162, 255, 0.8)",
    },
    activeColor: {
      type: String,
      default: "#ffe100",
    },
    //摄像机以及流信息
    src: {
      type: String,
      default: "",
      requred: true,
    },
    equipment: {
      type: Object,
      default: () => null,
    },
    //窗口个数
    model: {
      type: Number,
      default: 4,
    },
  },
  setup(props, { emit }) {
    const state = reactive<StateProps>({
      options: [
        {
          name: "删除",
          icon: "",
          num: 0,
        },
        {
          name: "截屏",
          icon: "",
          num: -1,
        },
        {
          name: "一宫格",
          icon: "",
          num: 1,
        },
        {
          name: "四宫格",
          icon: "",
          num: 4,
        },
        {
          name: "九宫格",
          icon: "",
          num: 9,
        },
        {
          name: "十六宫格",
          icon: "",
          num: 16,
        },
      ],
      acModel: {
        num: props.model, //窗口个数
        active: 0, //当前选中窗口
        info: null, //选中窗口的设备信息
      },
      videoArr: [], //视频数组对象
      equipmentArr: [], //设备数组对象
      kbs: 0, //返回码流的次数
    });

    const videoContent: any = ref(null);
    const option: any = ref(null);
    //主题颜色
    onMounted(() => {
      //容器样式
      videoContent.value.style.background = props.backgroundColor;
      videoContent.value.style.borderTop = `1px solid ${props.borderColor}`;
      videoContent.value.style.borderLeft = `1px solid ${props.borderColor}`;
      //  底部操作样式
      option.value.style.background = props.backgroundColor;
      option.value.style.color = props.textColor;
      option.value.style.borderBottom = `1px solid ${props.borderColor}`;
      option.value.style.borderLeft = `1px solid ${props.borderColor}`;
      option.value.style.borderRight = `1px solid ${props.borderColor}`;
    });
    //宫格变换
    const iconClick = (item: any) => {
      if (item.num == 0) destoryPlayer(state.acModel.active);
      else if (item.num == -1) capture(state.acModel.active);
      else (state.acModel.num = item.num), (state.acModel.active = 0);
    };

    //生成video对象
    const createPlayer = (acIndex: number, src: string, info: any) => {
      state.equipmentArr[acIndex] = info;
      destoryPlayer(state.acModel.active);
      //异步执行渲染有问题，加了定时器(具体原因还没分析清楚)
      setTimeout(() => {
        nextTick(() => {
          state.videoArr[acIndex] = new WasmPlayer(
            null,
            `videoElement${acIndex}`,
            callbackfun,
            {
              Height: true,
              logo: false,
              closeAudio: true,
              live: true,
              cfKbs: (e: any) => {
                //码流返回5次都为零，播放失败
                state.kbs = state.kbs + 1;
                if (state.kbs > 4) {
                  cfKbs(e, acIndex);
                  state.kbs = 0;
                }
              },
            }
          );
          state.videoArr[acIndex].play(src, 1);
        });
      }, 500);
    };
    //销毁video对象
    const destoryPlayer = (acIndex: number) => {
      if (state.videoArr[acIndex]) {
        try {
          state.videoArr[acIndex].pause();
          state.videoArr[acIndex].destroy();
          state.videoArr[acIndex] = null;
          state.equipmentArr[acIndex] = null;
        } catch (error) {
          console.log("销毁视频");
        }
      }
    };
    //码流监听
    const cfKbs = (e: any, acIndex: number) => {
      if (
        e.averageKbs == 0 &&
        e.averageKbps == 0 &&
        e.currentKbps == 0 &&
        e.currentKbs == 0
      ) {
        destoryPlayer(acIndex);
        let videoHtml: any = document.getElementById(`videoElement${acIndex}`);
        let span = document.createElement("span");
        span.style.position = "absolute";
        span.style.left = "50%";
        span.style.top = "50%";
        span.style.transform = "translate(-60%,-50%)";
        span.style.color = "#999";
        span.style.fontSize = "14px";
        span.className = "iconfont icon-shipin";
        span.innerHTML = "&ensp;播放失败";
        videoHtml.appendChild(span);
      }
    };
    const callbackfun = (e: any) => {
      console.log("监听", e);
    };
    //video-icon样式
    const acIconClor = (data: any) => {
      if (data.num == state.acModel.num) {
        return { color: props.activeColor };
      }
      return { color: props.textColor };
    };
    const modelClick = (num: any, index: number) => {
      state.acModel.num = num;
      state.acModel.active = index;
      state.acModel.info = state.equipmentArr[index]
        ? Object.assign({}, state.equipmentArr[index])
        : null;
      emit("videoClick", state.acModel);
    };
    //多频样式
    const modelFun = (num: number) => {
      let obj: any = {};
      if (num == 1)
        obj = {
          flex: "0 0 100%",
          height: "100%",
          // boxShadow: `inset 0px 0px 0px 5px ${props.activeColor}`,
        };
      else if (num == 4)
        obj = {
          flex: "0 0 50%",
          height: "50%",
        };
      else if (num == 9)
        obj = {
          flex: "0 0 33.3%",
          height: "33.3%",
        };
      else if (num == 16)
        obj = {
          flex: "0 0 25%",
          height: "25%",
        };

      return {
        ...obj,
        borderRight: `1px solid ${props.borderColor}`,
        borderBottom: `1px solid ${props.borderColor}`,
      };
    };
    const mianFun = () => {
      return {
        border: `1px solid ${props.borderColor}`,
      };
    };
    //多频激活样式
    const acModelFUc = (ac: number) => {
      if (ac == state.acModel.active) {
        return {
          boxShadow: `0 0 2px 3px  ${props.activeColor}`,
          // border: `1px solid ${props.activeColor}`,
        };
      }
    };
    //src监听
    watch(
      () => props.src,
      (newVal) => {
        if (newVal != "") {
          createPlayer(state.acModel.active, newVal, props.equipment);
          if (state.acModel.num == 4) {
            if (state.acModel.active < 3) {
              state.acModel.active = state.acModel.active + 1;
            } else {
              state.acModel.active = 0;
            }
          } else if (state.acModel.num == 9) {
            if (state.acModel.active < 8) {
              state.acModel.active = state.acModel.active + 1;
            } else state.acModel.active = 0;
          } else if (state.acModel.num == 16) {
            if (state.acModel.active < 15) {
              state.acModel.active = state.acModel.active + 1;
            } else state.acModel.active = 0;
          }
        }
      },
      { deep: true, immediate: true }
    );
    //画面截取
    const capture = (acIndex: number) => {
      let el: any | null = document.getElementById(`videoElement${acIndex}`)
        ?.childNodes[3];
      if (!el) {
        el = document.createElement("video");
      }
      var canvas: any = document.createElement("canvas"); //创建一个canvas
      canvas.width = 1920; //设置canvas的宽度为视频的宽度
      canvas.height = 1080; //设置canvas的高度为视频的高度
      canvas.getContext("2d").drawImage(el, 0, 0, canvas.width, canvas.height); //绘制图像

      var img = document.createElement("a");
      img.href = canvas
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      let name = "截图";
      if (state.equipmentArr.length != 0) {
        if (state.equipmentArr[acIndex]?.name) {
          name = `${state.equipmentArr[acIndex]?.name}(${getTime()})`;
        } else {
          name = `窗口${acIndex + 1}(${getTime()})`;
        }
      }
      img.download = `${name}.jpg`;
      img.click();
    };
    //获取当前时间
    const getTime = () => {
      let time = new Date();
      console.log(time);
      let y = time.getFullYear();
      let mouth: string | number = time.getMonth();
      mouth = mouth < 10 ? `0${mouth}` : mouth;
      let date: string | number = time.getDate();
      date = date < 10 ? `0${date}` : date;
      let hour: string | number = time.getHours();
      hour = hour < 10 ? `0${hour}` : hour;
      let minutes: string | number = time.getMinutes();
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      let seconds: string | number = time.getSeconds();
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${y}年${mouth}月${date}日 ${hour}时${minutes}分${seconds}秒`;
    };
    onBeforeUnmount(() => {
      state.kbs = 0;
      for (let index = 0; index < state.acModel.num; index++) {
        if (state.videoArr[index]) destoryPlayer(index);
      }
    });
    return {
      ...toRefs(state),
      videoContent,
      option,
      acIconClor,
      iconClick,
      modelFun,
      modelClick,
      acModelFUc,
      capture,
      mianFun,
    };
  },
});
</script>
<style scoped>
.video-content {
  height: 100%;
  width: 100%;
}
.video {
  height: calc(100% - 30px);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.video-item {
  box-sizing: border-box;
  background: black;
  padding: 2px;
  overflow: hidden;
}
.video-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.player-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.option {
  width: 100%;
  height: 30px;
  overflow: hidden;
  font-size: 14px;
  line-height: 30px;
  vertical-align: middle;
  padding: 0 10px;
  box-sizing: border-box;
  text-align: right;
}
.option span {
  margin-left: 10px;
  cursor: pointer;
}

/* .player-box {
  position: relative;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
} */
</style>