<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { reactive, toRefs } from 'vue'
import { onMounted } from "vue"
import * as echarts from 'echarts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  setup(props) {
    const state = reactive({
      myChart: null,
      id: props.id
    })
    const setOptions = (columnList, xData, dataList) => {
      state.myChart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '客户维度统计',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: columnList
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '已预报',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: dataList['forecast']
          },
          {
            name: '签入',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: dataList['checkIn']
          },
          {
            name: '已签收',
            type: 'bar',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: dataList['signData']
          },
          {
            name: '总单量',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: '#3888fa',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: dataList['total']
          }
        ]
      })
    }
    onMounted(() => {
      state.myChart = echarts.init(document.getElementById(state.id));
      const columnList = ['已预报', '签入', '已签收', '总单量']
      const xData = (function () {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + '客户')
        }
        return data
      }())
      const dataList = {
        forecast: [
          709,
          1917,
          2455,
          2610,
          1719,
          1433,
          1544,
          3285,
          5208,
          3372,
          2484,
          4078
        ],
        checkIn: [
          327,
          1776,
          507,
          1200,
          800,
          482,
          204,
          1390,
          1001,
          951,
          381,
          220
        ],
        signData: [
          1036,
          3693,
          2962,
          3810,
          2519,
          1915,
          1748,
          4675,
          6209,
          4323,
          2865,
          4298
        ],
        total: [
          1036,
          3693,
          2962,
          3810,
          2519,
          1915,
          1748,
          4675,
          6209,
          4323,
          2865,
          4298
        ]
      }
      setOptions(columnList, xData, dataList)
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
