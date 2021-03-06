<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>咨询管理</BreadcrumbItem>
        <BreadcrumbItem>咨询申请</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form
          ref="formValidate"
          inline
          :label-width="100"
          :model="searchCondition">
          <FormItem label="咨询时间：">
            <DatePicker
              v-model="searchTime"
              format="yyyy-MM-dd"
              type="daterange"
              :editable="false"
              style="width: 200px">
            </DatePicker>
          </FormItem>
          <FormItem label="咨询名称：">
            <Input
              type="text"
              v-model="searchCondition.consultName">
            </Input>
          </FormItem>
          <FormItem label="状态：">
            <Select v-model="searchCondition.status" style="width:200px">
              <Option v-for="item in statusList" v-model="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="任务编号" style="width: 200px">
            <Input v-model="searchCondition.applyCode"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="preSearch" v-if="authButton.includes('ops_consultation_apply_query')">查询</Button>
            <Button type="primary" @click="popModal(operationType.create)" v-if="authButton.includes('ops_consultation_apply_add')">新增咨询</Button>
          </FormItem>
        </Form>
        <hy-table
          highlight-row
          border
          :current="pageInfo.pageNo"
          :columns="tableList.columns"
          :data="tableList.data"
          :total="Number(pageInfo.total)"
          :pageSize="Number(pageInfo.pageSize)"
          pageType="small"
          show-elevator
          show-sizer
          class="refer-apply"
          @on-page-change="pageChange" />
        <Modal
          v-model="showModal"
          :mask-closable="false"
          :title="modalTitle"
          id="applyModal">
          <Form :label-width="85" :model="modalContent" :rules="ruleValidate" ref="modalForm">
            <template v-if="operationType.evaluate !== currentOperation">
              <FormItem label="咨询名称：" prop="consultName">
                <Input
                  type="text"
                  v-model="modalContent.consultName"
                  :maxlength="200"
                  :disabled="!isEditOrCreate">
                </Input>
              </FormItem>
              <FormItem label="咨询时间：" prop="consultTime">
                <DatePicker
                  v-model="modalContent.consultTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  style="width: 200px"
                  :disabled="!isEditOrCreate">
                </DatePicker>
              </FormItem>
              <FormItem label="申请单位：" prop="subDept">
               <Select v-model="modalContent.subDept">
                  <Option v-model="item.name" v-for="item in companyList" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="咨询内容：" prop="consultInfo">
                <Input
                  type="textarea"
                  v-model="modalContent.consultInfo"
                  :maxlength="999"
                  :rows="5"
                  :disabled="!isEditOrCreate">
                </Input>
              </FormItem>
            </template>
            <template v-else>
              <h4>咨询评价</h4>
              <FormItem label="服务态度：">
                <hy-rate v-model="modalContent.serviceAttitude" :sglValue="20"></hy-rate>
              </FormItem>
              <FormItem label="服务效率：">
                <hy-rate v-model="modalContent.serviceEfficiency" :sglValue="20"></hy-rate>
              </FormItem>
              <FormItem label="服务质量：">
                <hy-rate v-model="modalContent.serviceQuality" :sglValue="20"></hy-rate>
              </FormItem>
              <FormItem label="咨询建议：">
                <Input
                  type="textarea"
                  :rows="5"
                  :maxlength="200"
                  v-model="modalContent.consultAdvice">
                </Input>
              </FormItem>
            </template>
          </Form>
          <div slot="footer">
            <Button class="modalBtn" type="default" @click="showModal = false" size="large">取消</Button>
            <Button class="modalBtn" type="primary" @click="handleSubmit" size="large">确定</Button>
          </div>
        </Modal>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import apiList from '@/api/comApiList'
import operationApiList from '@/api/operationApiList'

const operationType = {
  // 新增
  create: 'create',
  // 评价
  evaluate: 'evaluate',
  // 修改
  edit: 'edit'
}

const statusList = [{
  label: '全部',
  value: -1
},{
  label: '未处理',
  value: 1
}, {
  label: '处理中',
  value: 2
}, {
  label: '已驳回',
  value: 3
}, {
  label: '已完结',
  value: 4
}]

function getDateRange(time) {
  if (!time) {
    return ''
  }
  // 结束日期
  const endDate = new Date(time)
  // 当前日期往前推30天
  const startDate = new Date(time - 30 * 24 * 60 * 60 * 1000)
  return {
    start: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
    end: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
  }
}

function convertDateTime(data) {
  if (!data) return ''
  let dateVal = new Date(data)
  return `${dateVal.getFullYear()}-${(dateVal.getMonth() + 1).toString().padStart(2, '0')}-${(dateVal.getDate()).toString().padStart(2, '0')} ${(dateVal.getHours()).toString().padStart(2, '0')}:${(dateVal.getMinutes()).toString().padStart(2, '0')}:${(dateVal.getSeconds()).toString().padStart(2, '0')}`
}

function defaultDisplay(h, params, key) {
  return h('span', params.row[key] || '--')
}

export default {
  data () {
    const vm = this
    const validatorTime = (rule, value, callback) => {
      if (!vm.modalContent.consultTime) {
        callback(new Error('不可为空'))
      } else {
        callback()
      }
    }
    return {
      showModal: false,
      statusList,
      operationType,
      // 当前登录人的所有单位
      companyList: [],
      // 咨询时间
      searchTime: [],
      searchCondition: {
        // 咨询名称
        consultName: '',
        // 状态
        status: -1,
        // 任务编号
        applyCode: this.$route.query.code || ''
      },
      // 当前操作行的信息
      currentConsultInfo: {},
      currentOperation: '',
      modalTitle: '',
      modalContent: {
        // 咨询内容
        consultInfo: '',
        // 咨询名称
        consultName: '',
        // 咨询时间
        consultTime: '',
        // 申请单位
        subDept: -1,
        // 服务态度
        serviceAttitude: 80,
        // 服务效率
        serviceEfficiency: 80,
        // 服务质量
        serviceQuality: 80,
        // 咨询建议
        consultAdvice: ''
      },
      tableList: {
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '任务编号',
            key: 'applyCode'
          },
          {
            title: '咨询名称',
            key: 'consultName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: params.column._width * 0.9 + 'px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.consultName
                  }
                }, params.row.consultName)
                // h('Tooltip', {
                //   props: { placement: 'top' }
                // }, [
                //   h('span', {
                //     style: {
                //       display: 'inline-block',
                //       width: params.column._width * 0.9 + 'px',
                //       overflow: 'hidden',
                //       textOverflow: 'ellipsis',
                //       whiteSpace: 'nowrap'
                //     }
                //   }, params.row.consultName),
                //   h('span', {
                //     slot: 'content',
                //     style: { whiteSpace: 'normal', wordBreak: 'break-all', maxHeight: '40vh', overflow: 'auto', display: 'inline-block' }
                //   }, params.row.consultName)
                // ])
              ])
            }
          },
          {
            title: '咨询时间',
            key: 'consultTime'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const status = params.row.status
              return h('span', statusList[status].label)
            }
          },
          {
            title: '评分',
            key: 'score',
            render: (h, params) => {
              return defaultDisplay(h, params, 'score')
            }
          },
          {
            title: '操作',
            key: 'address',
            render: (h, params) => {
              const vm = this
              const {status, id, score} = params.row
              const style = {
                marginRight: '5px'
              }
              // 详情
              const info = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                domProps: {
                  innerHTML: '详情'
                },
                on: {
                  click () {
                    vm.$router.push({
                      name: 'referDetail',
                      params: {
                        id: id
                      },
                      query: {
                        status
                      }
                    })
                  }
                }
              })
              // 评价
              const evaluate = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                domProps: {
                  innerHTML: '咨询评价'
                },
                on: {
                  click () {
                    vm.currentConsultInfo = params.row
                    vm.popModal(operationType.evaluate)
                  }
                }
              })
              // 编辑
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                domProps: {
                  innerHTML: '修改'
                },
                on: {
                  click () {
                    vm.currentConsultInfo = {...params.row}
                    vm.modalContent = {...params.row}
                    vm.popModal(operationType.edit)
                  }
                }
              })
              const btns = []
              switch (status) {
                // 未处理
                case 1:
                // 处理中
                case 2:
                  break
                // 已驳回
                case 3:
                  if (vm.authButton.includes('ops_consultation_apply_update')) {
                    btns.push(edit)
                  }
                  break
                case 4:
                  if (vm.authButton.includes('ops_consultation_apply_evaluate') && (!score && score != 0)) {
                    btns.push(evaluate)
                  }
                  break
              }
              if (vm.authButton.includes('ops_consultation_apply_detail')) {
                btns.push(info)
              }
              return h('span', btns)
            }
          }
        ],
        data: []
      },
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      ruleValidate: {
        consultName: [{ required: true, message: '不可为空', trigger: 'blur' }],
        consultTime: [{ required: true, message: '不可为空', trigger: 'blur', validator: validatorTime }],
        subDept: [{ required: true, message: '不可为空', trigger: 'change' }],
        consultInfo: [{ required: true, message: '不可为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
    isEditOrCreate () {
      return this.currentOperation === operationType.create || this.currentOperation === operationType.edit
    },
    ...mapState(['authButton'])
  },
  mounted () {
    this.search()
    this.getMyOrgList()
  },
  methods: {
    preSearch() {
      this.pageInfo.pageNo = 1
      this.search()
    },
    pageChange(pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.search()
    },
    // 获取所有单位
    getMyOrgList() {
      const vm = this
      api(apiList.getMyOrgList)
      .then(res => {
        if (res.data.errcode === 0) {
          vm.companyList = res.data.data.orgList
        }
      }, error => {console.log(error)})
    },
    search () {
      this.getList()
    },
    // 获取所有咨询的列表
    getList (pageNo, pageSize) {
      const vm = this
      const endTime = vm.searchTime.length > 0 ? getDateRange(vm.searchTime[1]).end : ''
      const startTime = vm.searchTime.length > 0 ? getDateRange(vm.searchTime[0]).end : ''
      api(operationApiList.consultPage, {
        pageNo: pageNo || vm.pageInfo.pageNo,
        pageSize: pageSize || vm.pageInfo.pageSize,
        data: {
          endTime: endTime ? `${endTime} 23:59:59` : '',
          startTime: startTime ? `${startTime} 00:00:00` : '',
          ...vm.searchCondition
        }
      }).then(res => {
        if (res.data.errcode === 0) {
          const result = res.data.data
          vm.pageInfo.pageNo = result.pageNum
          vm.pageInfo.total = result.total
          vm.tableList.data = result.list
        }
      }, error => {console.log(error)})
    },
    popModal (operation) {
      const vm = this
      switch (operation) {
        case operationType.create:
          vm.modalTitle = '新增咨询'
          break
        case operationType.evaluate:
          vm.modalTitle = '咨询评价'
          break
        case operationType.edit:
          vm.modalTitle = '咨询修改'
          break
      }
      vm.$refs.modalForm.resetFields()
      vm.currentOperation = operation
      vm.showModal = true
    },
    // 提交弹窗的表单
    handleSubmit() {
      const vm = this
      vm.$refs.modalForm.validate((valid) => {
        if (valid) {
          let apiUrl = ''
          let data = {}
          switch (vm.currentOperation) {
            case operationType.edit:
              apiUrl = 'consultUpdate'
              // 咨询id
              data.id = vm.currentConsultInfo.id
            case operationType.create:
              apiUrl = apiUrl || 'consultSave'
              data = {
                // 咨询内容
                consultInfo: vm.modalContent.consultInfo,
                // 咨询名称
                consultName: vm.modalContent.consultName,
                // 咨询时间
                consultTime: convertDateTime(vm.modalContent.consultTime),
                // 提交单位
                subDept: vm.modalContent.subDept || -1,
                ...data
              }
              break
            case operationType.evaluate:
              apiUrl = 'consultEval'
              data = {
                consultAdvice: vm.modalContent.consultAdvice,
                id: vm.currentConsultInfo.id,
                serviceAttitude: vm.modalContent.serviceAttitude || 80,
                serviceEfficiency: vm.modalContent.serviceEfficiency || 80,
                serviceQuality: vm.modalContent.serviceQuality || 80
              }
              break
          }
          api(operationApiList[apiUrl], data)
          .then(res => {
            if (res.data.errcode === 0) {
              vm.$Message.success('操作成功！！！')
              vm.showModal = false
              vm.search()
            }
          }, error => {console.log(error)})
        } else {
          this.$Message.error('表单验证失败！');
        }
      })
    }
  }
}
</script>

<style lang='less'>
.refer-apply{
  .handle{
    margin: 0 5px;
    display: inline-block;
    cursor: pointer;
    color: #2d8cf0;
  }
}
#applyModal .ivu-form-item-content{
  height: auto !important;
}
</style>
