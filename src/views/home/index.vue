<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>-->


<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <customer-chart id="custoer-chart" height="650px" width="100%" />
    </el-row>-->

  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import CustomerChart from './components/CustomerChart'

export default {
  name: 'home',
  components: {
    PanelGroup, LineChart,CustomerChart
  },
  setup() {
    const state = reactive({
      lineChartData: {},
      lineChartDataObj: {
        tms: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145]
        },
        xb: {
          expectedData: [200, 192, 120, 144, 160, 130, 140],
          actualData: [180, 160, 151, 106, 145, 150, 130]
        },
        tmsIssue: {
          expectedData: [80, 100, 121, 104, 105, 90, 100],
          actualData: [120, 90, 100, 138, 142, 130, 130]
        },
        xbIssue: {
          expectedData: [130, 140, 141, 142, 145, 150, 160],
          actualData: [120, 82, 91, 154, 162, 140, 130]
        }
      }
    })
    const handleSetLineChartData = (type) => {
      state.lineChartData = state.lineChartDataObj[type]
    }
    return {
      ...toRefs(state),
      handleSetLineChartData
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
