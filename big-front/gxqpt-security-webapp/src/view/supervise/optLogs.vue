<!-- 业务应用运行数据采集-->
<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>统一监管平台</BreadcrumbItem>
        <BreadcrumbItem>数据采集操作记录</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="110" :model="searchData">
          <FormItem label="接口名称：">
            <Input type="text" v-model="searchData.name" style="width:150px;"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="preSearch">查询</Button>
          </FormItem>
        </Form>
        <hy-table
          highlight-row
          border
          ref="unitTable"
          :current="pageInfo.pageNo"
          :columns="tableList.columns"
          :data="tableList.data"
          :total="Number(pageInfo.total)"
          :pageSize="Number(pageInfo.pageSize)"
          pageType="small"
          show-elevator
          @on-page-change="pageChange"
          show-sizer />
      </Card>
      <Modal v-model="detailModal" :title="modelTitle" width="50%" :mask-closable="false">
        <Form ref="detailForm" :model="detailForm" :label-width="90">
          <!-- <FormItem label="模块名称">
            <Input type="text" :value="detailForm.modularName" disabled></Input>
          </FormItem> -->
          <FormItem label="接口名称">
            <Input type="text" :value="detailForm.name" disabled></Input>
          </FormItem>
          <FormItem label="接口地址">
            <Input type="text" :value="detailForm.url" disabled></Input>
          </FormItem>
          <FormItem label="请求参数">
            <Input type="textarea" :value="detailForm.queryString" disabled :rows="3" style="overflow: auto;"></Input>
          </FormItem>
          <FormItem label="请求参数json格式">
            <Input type="textarea" :value="detailForm.requestQueryParams" disabled :rows="3" style="overflow: auto;"></Input>
          </FormItem>
          <FormItem label="响应参数">
            <Input type="textarea" :value="detailForm.responseBody" disabled :rows="5" style="overflow: auto;"></Input>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="调用日期">
                <Input type="text" :value="detailForm.createDate" disabled></Input>
              </FormItem>
              <FormItem label="调用月份">
                <Input type="text" :value="detailForm.createMonth" disabled></Input>
              </FormItem>
              <FormItem label="调用小时">
                <Input type="text" :value="detailForm.createHour" disabled></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="调用时间">
                <Input type="text" :value="detailForm.createTime" disabled></Input>
              </FormItem>
              <FormItem label="调用状态">
                <Input type="text" :value="status" disabled></Input>
              </FormItem>
              <FormItem label="操作人名称">
                <Input type="text" :value="detailForm.userName" disabled></Input>
              </FormItem>
              <FormItem label="账号">
                <Input type="text" :value="detailForm.account" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="失败原因" v-if="detailForm.errMsg">
            <Input type="textarea" :value="detailForm.errMsg" disabled></Input>
          </FormItem>
          
        </Form>
        <div slot="footer">
          <Button class="modalBtn" type="default" @click="detailModal = false" size="large">关闭</Button>
        </div>
      </Modal>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import superviseApiList from '@/api/superviseApiList'
import { validateNumber } from '@/api/formValidate'
import comApiList from '@/api/comApiList'
import { mapState } from 'vuex'
function getDetailForm() {
  return {
    modularName: '',
    name: '',
    url: '',
    createDate: '',
    createMonth: '',
    createHour: '',
    createTime: '',
    errMsg: '',
    userName: '',
    account: '',
    status: ''
  }
}
export default {
  data() {
    const vm = this
    return {
      // 当前操作的行数据的id
      currentId: null,
      remindTypes:'',
      appArr:[],//应用列表,
      searchData: { //查询参数
        name: ''
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
            title: '账号',
            key: 'account'
          },
          {
            title: '接口名称',
            key: 'name'
          },
          {
            title: '调用时间',
            key: 'createTime'
          },
          {
            title: '操作',
            key: 'act',
            width: 180,
            render: (h, params) => {
              const detail = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    vm.modelTitle = '详情'
                    vm.openModal(params.row.id)
                  }
                }
              }, "详情");
              return h('div', [detail]);
            }
          }
        ],
        data: []
      },
      // 分页数据
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      detailForm: getDetailForm(),
      detailModal:false
    }
  },
  computed: {
    status () {
      switch (this.detailForm.status) {
        case '0':
          return '成功'
        case '1':
          return '是解析json失败'
        default:
          return this.detailForm.status
      }
    }
  },
  mounted() {
    this.preSearch()
  },
  methods: {
    preSearch () {
      this.pageInfo.pageNo = 1
      this.getList()
    },
    pageChange (pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.getList()
    },
    getList () {
      const vm = this
      let data = {
        data: {
          ...vm.searchData,
          appId: vm.$route.params.id,
          type: vm.$route.params.type
        },
        pageNo: vm.pageInfo.pageNo,
        pageSize: vm.pageInfo.pageSize
      }
      api(superviseApiList.pageInterCallMainList, data)
      .then((res) => {
        if (res.data && res.data.errcode === 0) {
          vm.tableList.data = res.data.data.list
          vm.pageInfo.total = res.data.data.total
        } else {
          vm.tableList.data = []
          vm.$Message.error('查询失败');
        }
      }, (err) => {})
    },
    // 打开详情弹窗
    openModal (id) {
      const vm = this
      api(superviseApiList.interfaceCallFindById, { id })
      .then((res) => {
        if (res.data && res.data.errcode === 0) {
          vm.detailForm = res.data.data || {};
          vm.detailModal = true;
        } else {
          vm.$Message.error('获取详情失败');
        }
      }, (err) => {})
    }
  }
}
</script>
