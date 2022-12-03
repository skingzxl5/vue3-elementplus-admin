<template>
  <div :id="className" :style="{ height: height, width: width }" />
</template>

<script>
import { reactive, toRefs } from 'vue'
import { onMounted } from "vue"
import * as echarts from 'echarts'
export default {
  name: "data_page",
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  watch: {
    chartData(val) {
      this.setOptions(val)
    }
  },
  setup(props) {
    const state = reactive({
      myChart: null,
      className: props.className,
      data: props.chartData,
    })
    const setOptions = ({ expectedData, actualData } = {}) => {
      state.myChart.setOption({
        xAxis: {
          data: ['2021-12', '2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06'],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['国际快递', '跨境小包']
        },
        series: [
          {
            name: '国际快递', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '跨境小包',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
    onMounted(() => {
      state.myChart = echarts.init(document.getElementById(state.className));
      state.data = {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      }
      setOptions(state.data)
      window.onresize = function () {
        //自适应大小
        state.myChart.resize();
      };
    });
    return {
      ...toRefs(state),
      setOptions
    }
  }
}
</script>
