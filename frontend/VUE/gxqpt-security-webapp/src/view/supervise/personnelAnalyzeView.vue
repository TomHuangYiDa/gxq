<template>
    <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>预警分析</BreadcrumbItem>
        <BreadcrumbItem>个人预警分析</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="100">
          <FormItem label="时间">
            <DatePicker
              v-model="defaultDate"
              type="year"
              placeholder="选择时间"
              :options="pickerOptions"
              style="width: 200px">
            </DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="init">查看分析</Button>
          </FormItem>
          <FormItem class="rt" v-if="dpmId">
            <router-link to="/personnelAnalyze">
              <Button type="primary">返回</Button>
            </router-link>
          </FormItem>
        </Form>
      </Card>
      <Layout>
        <Layout style="background:#fff;">
          <Row type="flex" justify="space-between">
            <Col span="11">
              <div class="lt lt_tle">预警级别</div>
              <div class="lt lt_item" v-for="item in warnlevel" :class="item.className">
                <h3>{{item.title}}</h3>
                <p><span class="fontSize">{{item.num}}</span>{{item.quantifier}}</p>
              </div>
            </Col>
            <Col span="13">
              <!-- 预警类型 -->
              <!-- <Col span="8">
                <div class="warning-level">
                  <unit-warning-level ref="warnType"></unit-warning-level>
                </div>
              </Col> -->
              <Col span="12"><!-- 预警级别 -->
                <div class="warning-level">
                  <level-warning ref="warnLevel"></level-warning>
                </div>
              </Col>
              <Col span="12"><!-- 预警处理情况 -->
                <div class="warning-level">
                  <back-warning ref="warnBack"></back-warning>
                </div>
              </Col>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span="11"><!-- 对比分析 -->
              <chart-card title="各预警类型处理水平对比分析">
                <contrast-analyze ref="contrastAnalyze"></contrast-analyze>
              </chart-card>
            </Col>
            <Col span="13"><!-- 预警产生处理情况 -->
              <chart-card title="个人预警产生处理情况">
                <deal-state ref="dealState"></deal-state>
              </chart-card>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import {mapState} from 'vuex'
// echart图外层容器，包括卡片样式
import chartCard from './echarts/chartCard.vue'
import superviseApiList from '@/api/superviseApiList'
// 对比分析
import contrastAnalyze from './echarts/contrastAnalyze.vue'
// 单位预警处理情况
import unitWarnDealState from './echarts/unitWarnDealState.vue'
// 预警类型
import unitPieCharts from './echarts/unitPieCharts'
// 预警级别
import levelPieCharts from './echarts/levelPieCharts'
// 退出理由
import backPieCharts from './echarts/backPieCharts'
// 顶部滑动列表模块
import carouseList from "./modal/carouseList.vue";

export default {
  components: {
    chartCard,
    carouseList,
    'dealState': unitWarnDealState,
    'unitWarningLevel': unitPieCharts,
    'levelWarning': levelPieCharts,
    'backWarning': backPieCharts,
    'contrastAnalyze': contrastAnalyze,
  },
  data(){
    return{
      defaultDate:new Date(),//获取今年年份
      // 部门id
      dpmId: '',
      empIds:[],
      unitLevel:[],
      GxqptPublicLevel: {
        1:'一般',
        2:'较重',
        3:'严重',
        4:'特别严重'
      },
      warnlevel: [{
          title:"特别严重",
          num:0,
          quantifier:"个",
          className:"red",
        },
        {
          title:" 严重",
          num:0,
          quantifier:"个",
          className:"yellow",
        },
        {
          title:"较重",
          num:0,
          quantifier:"个",
          className:"golden",
        },
        {
          title:"一般",
          num:0,
          quantifier:"个",
          className:"golden",
        }
      ],
      caOptions: {
        legendData:[],
      },
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (year) => {
          var myYear = year.getFullYear()
          var myDate = new Date();
          // 如果函数处理比较简单,可以直接在这里写逻辑方法
          return !(myYear <= myDate.getFullYear() && myYear >= 1900)
        //return this.dealDisabledDate(time)
        }
      } // 日期设置对象
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    // 人员id，如果是预警系统路由就没有传人员id，就取当前登录人的id
    this.empId = this.$route.params.id || this.userInfo.userId;
    this.dpmId = this.$route.params.dpmId;
    this.init();
  },
  methods:{
    init(){
      let year = this.defaultDate.getFullYear().toString()
      this.findPublicContrast(year);
      // this.warntype(year);
      this.warnlevels(year);
      this.warnHandleStatistical(year);
    },
    //该人员各预警级别情况
    warnlevels(y){
      const vm = this
      let data = {
        empId: vm.empId
      }
      if (vm.dpmId)data.depId=vm.dpmId
      if(y)data.year=y;
      api(superviseApiList.empanalysisWarnlevel,data).then((res) => {
        if(res.data.errcode == 0) {
          const data = res.data.data
          const num = data.length
          for (var i = 0 ; i < num; i++) {
                let level = data[i].level
                if (1 === Number(level)) {
                this.warnlevel[3].num = data[i] ? data[i].count : 0;
                }
                if (2 === Number(level)) {
                this.warnlevel[2].num = data[i] ? data[i].count : 0;
                }
                if (3 === Number(level)) {
                this.warnlevel[1].num = data[i] ? data[i].count : 0;
                }
                if (4 === Number(level)) {
                this.warnlevel[0].num = data[i] ? data[i].count : 0;
                }
          }
          this.$refs.warnLevel.refresh(res.data.data);
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    //该人员各预警类型情况
    warntype(y){
      const vm = this
      let data = {
        empId: vm.empId
      }
      if (vm.dpmId)data.depId=vm.dpmId
      if(y)data.year=y;
      api(superviseApiList.empanalysisWarntype,data).then((res) => {
        if(res.data.errcode == 0) {
          this.$refs.warnType.refresh(res.data.data);
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    //各人员预警处理时长对比分析
    warnHandleStatistical(y){
      let data = {}
      data.depId=this.dpmId || 'whatever'
      data['id'] = this.empId;
      if(y)data.year=y;
      api(superviseApiList.warnHandleStatistical,data)
      .then((res) => {
        if(res.data.errcode == 0) {
          this.$refs.warnBack.refresh(res.data.data);
          this.$refs.dealState.refresh(res.data.data);
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    //公用查询对比分析
    findPublicContrast(y){
      const vm = this
      let data = {};
      data['empId'] = vm.empId;
      if (vm.dpmId)data['empDpmId'] = vm.dpmId
      if(y)data.date=y;
      api(superviseApiList.findPublicContrast,data).then((res) => {
        if(res.data.errcode == 0) {
          console.log(vm.userInfo)
          res.data.data.legendData=["平均水平", vm.$route.query.app || vm.userInfo.name];
          vm.$refs.contrastAnalyze.refresh(res.data.data);
        }else{
          vm.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    }
  }
}
</script>

<style lang="less" scoped>
.lt{
  float: left;
}
.rt{
  float: right;
}
.lt_tle{
  width: 1em;
  padding: 1em 2em;
  line-height: 30px;
}
.lt_item{
  width: 110px;
  height: 110px;
  border: 1px solid #0066CC;
  border-radius: 50%;
  text-align: center;
  margin: 1.3em;
  h3{
    margin: 2.5em 0 1em;
  }
}
.red{
  color: red;
}
.yellow{
  color: #d48265;
}
.golden{
  color: #F7645D;
}
.fontSize{
  font-size: 18px;
}
.radioMod{
    width:80%;
    height:100%;
    padding:10px 0;
    border:1px solid #ccc;
    border-radius: 50%;
    margin: 30px auto;
}
.mf{
    margin-left:2%;
}
.radioTxt{
    width:100px;
    height:100px;
    margin:35px auto;
    font-size:20px;
    text-align: center
}
.warning-level,
.app-warning-analysis,
.warning-occur-handle{
  height: 300px;
}
</style>
