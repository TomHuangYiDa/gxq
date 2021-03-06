<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>运维分析</BreadcrumbItem>
        <BreadcrumbItem>共性服务监控</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Row type="flex" justify="space-between">
          <Col style="width: 49%">
            <chart-card title="服务使用数量分析">
              <chartLine ref="serviceChart1" el="serviceChart1" :lineOption="serviceChart1Option">
                <div id="serviceChart1" style="height: 400px;"></div>
              </chartLine>
            </chart-card>
          </Col>
          <Col style="width: 49%">
            <chart-card title="服务故障处理分析">
              <chartBar ref="serviceChart2" el="serviceChart2" :barOption="serviceChart2Option">
                <div id="serviceChart2" style="height: 400px;"></div>
              </chartBar>
            </chart-card>
          </Col>
        </Row>
        <Row type="flex" justify="space-between">
          <Col style="width: 49%">
            <chart-card title="服务使用top10">
              <chartBar ref="serviceChart3" el="serviceChart3" :barOption="serviceChart3Option">
                <div id="serviceChart3" style="height: 400px;"></div>
              </chartBar>
            </chart-card>
          </Col>
          <Col style="width: 49%">
            <chart-card title="服务使用率">
              <chartLine ref="serviceChart4" el="serviceChart4" :lineOption="serviceChart4Option">
                <div id="serviceChart4" style="height: 400px;"></div>
              </chartLine>
            </chart-card>
          </Col>
        </Row>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import operationApiList from '@/api/operationApiList'
// echart图外层容器，包括卡片样式
import chartCard from '@/view/home/chartCard.vue'
import chartLine from './../echarts/ChartLine.vue'
import chartBar from './../echarts/bar.vue'
// echart图的一些共用的配置
import {symbolLine, symbolBar, horizontalBar} from '@/assets/js/echartOption'

export default {
  components: {
    chartCard,
    chartLine,
    chartBar
  },
  data () {
    return {
      serviceChart1Option: symbolLine(),
      serviceChart2Option: symbolBar(),
      serviceChart3Option: horizontalBar(),
      serviceChart4Option: symbolLine(),
      commonXData: []
    }
  },
  mounted() {
    this.serviceAnalysis()
    this.dataAnalysis()
  },
  methods: {
    // 获取服务故障处理分析数据
    serviceAnalysis () {
      const vm = this
      api(operationApiList.serviceAnalysis)
      .then(res => {
        if (res.data.errcode === 0) {
          const data = res.data.data
          vm.drawServiceChart2(data)
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => {console.log(err)})
    },
    // 获取数量分析、top10、使用率
    dataAnalysis () {
      const vm = this
      api(operationApiList.dataAnalysis)
      .then(res => {
        if (res.data.errcode === 0) {
          const data = res.data.data
          vm.commonXData = data.yMonthArray
          vm.drawServiceChart1(data.serverNum)
          vm.drawServiceChart3(data.useTop)
          vm.drawServiceChart4(data.serverRate)
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => {console.log(err)})
    },
    // 服务使用数量分析
    drawServiceChart1 (yData) {
      this.serviceChart1Option.xAxis.data = this.commonXData
      this.serviceChart1Option.series[0].data = yData
      this.$refs.serviceChart1.refresh()
    },
    // 服务故障处理分析
    drawServiceChart2 (data) {
      this.serviceChart2Option.xAxis.data = data.yMonthArray
      this.serviceChart2Option.series[0].barWidth = 20
      this.serviceChart2Option.series[0].symbolSize = ['50%', 4]
      this.serviceChart2Option.series[0].data = data.faultList
      this.serviceChart2Option.series[0].name = '故障产生量'
      this.serviceChart2Option.series.push({
        name: '故障处理量',
        type: 'pictorialBar',
        barGap: 0.1,
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          fontSize: 20,
          color: '#000'
        },
        itemStyle: {
          normal: {
            color: '#0f375f'
          }
        },
        symbol: 'rect',
        symbolRepeat: true,
        symbolSize: [10, 4],
        symbolMargin: 1,
        data: data.dealList
      })
      this.$refs.serviceChart2.refresh()
    },
    // 服务使用top10
    drawServiceChart3 (top) {
      const name = []
      const count = []
      top.map(item => {
        name.unshift(item.serverName)
        count.unshift(item.totalNum || 0)
      })
      this.serviceChart3Option.yAxis = {
        show: true
      }
      this.serviceChart3Option.yAxis.data = name
      this.serviceChart3Option.series[0].data = count
      this.$refs.serviceChart3.refresh()
    },
    // 服务使用率
    drawServiceChart4 (yData) {
      this.serviceChart4Option.xAxis.data = this.commonXData
      this.serviceChart4Option.yAxis.name = '使用率（%）'
      this.serviceChart4Option.series[0].data = yData
      this.$refs.serviceChart4.refresh()
    }
  }
}
</script>
