<template>
	<Layout>
		<Content>
			<Breadcrumb>
				<BreadcrumbItem>运维服务管理</BreadcrumbItem>
				<BreadcrumbItem>服务审核</BreadcrumbItem>
			</Breadcrumb>
			<Card>
				<Form :model="serviceData" ref="searchformData" inline :label-width="80">
					<FormItem label="服务类别">
						<Select class="queryItem" v-model="serviceData.serviceType">
							<Option v-for="item in serviceTypeList" :value="item.id" :key="item.id">{{item.type}}</Option>
						</Select>
					</FormItem>
					<FormItem label="服务时间">
						<DatePicker class="queryItem" type="daterange" :editable="false" @on-change="changeTime" placement="bottom-end" placeholder="请选择服务时间"></DatePicker>
					</FormItem>
					<FormItem label="评分" style="width: 280px">
						<Input v-model="serviceData.startScore" type="number" placeholder="最小评分" style="width: 40%"></Input>
						至
						<Input v-model="serviceData.endScore" type="number" placeholder="最大评分" style="width: 40%"></Input>
					</FormItem>
					<FormItem label="状态">
						<Select v-model="serviceData.status">
							<Option value="">全部</Option>
							<Option value="1">未处理</Option>
							<Option value="2">已驳回</Option>
							<Option value="3">已同意</Option>
							<Option value="4">已完结</Option>
						</Select>
					</FormItem>
					<FormItem label="任务编号" style="width: 200px">
						<Input v-model="serviceData.applyCode"></Input>
					</FormItem>
					<FormItem :label-width="20">
						<Button type="primary" v-if="authButton.includes('ops_server_examine_query')" @click="preSearch">查询</Button>
					</FormItem>
				</Form>
				<hy-table
					ref="selection"
					border
					:current="pageInfo.pageNo"
					:data="safetyEvalData"
					:columns="safetyEvalCol"
					:total="pageInfo.total"
					:page-size="pageInfo.pageSize"
					@on-change="pageChange"
					@on-page-size-change="changePageSize"
					show-sizer
					show-elevator />
			</Card>
		</Content>
		<dealDetailModal ref="dealModal" :evalModal='dealDetail' :closeModal='closeDealDetail'></dealDetailModal>
		<serviceDocModal ref="serviceDocModal"></serviceDocModal>
		<agreeModal :evalModal='agree' :closeModal='closeAgreeModal'></agreeModal>
		<rejectModal :evalModal='reject' :closeModal='closeRejectModal'></rejectModal>
	</Layout>
</template>
<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import operationApiList from '@/api/operationApiList'
import dealDetailModal from "./serviceApplyModal/dealDetailModal.vue";
import serviceDocModal from "./serviceApplyModal/serviceDocModal.vue";
import agreeModal from "./serviceApplyModal/agreeModal.vue";
import rejectModal from "./serviceApplyModal/rejectModal.vue";
export default {
	components: {
		dealDetailModal,
		serviceDocModal,
		agreeModal,
		rejectModal
	},
	data() {
		const vm = this
		return {
			serviceTypeList: [], // 服务类别list
			pageInfo: { //分页参数
				pageNo: 1,
				total: 0,
				pageSize: 10
			},
			dealDetail: false,
			serviceDoc: false,
			agree: false,
			reject: false,
			serviceData: {
				"applyOrg": "",
				"applyUser": "",
				"endScore": "",
				"endTime": "",
				"serviceType": "",
				"startScore": "",
				"startTime": "",
				"status": '',
				applyCode: this.$route.query.code || ''
			},
			safetyEvalCol: [{
				title: '序号',
				type: 'index',
				fixed: 'left',
				width: 80,
				align: 'center'
			}, {
				title: '任务编号',
				fixed: 'left',
				width: 180,
				key: 'applyCode'
			}, {
				title: '服务类别',
				width: 200,
				key: 'serviceType'
			}, {
				title: '服务名称',
				width: 200,
				key: 'serviceName'
			}, {
				title: '涉及系统',
				width: 160,
				key: 'systemName',
				// tooltip: 'true',
				// ellipsis: 'true',
				render: (h, params) => {
					let systemArray = [];
					let systemList = params.row.systemName ? params.row.systemName : [];
					if(systemList.length > 0) {
						for(let i in systemList) {
							systemArray.push(systemList[i].systemName);
						}
					}
					// return h('span', systemArray.join("，"));
					return h('div', [ // 超出长度用省略号代替
						h('span', {
							style: {
							display: 'inline-block',
							width: params.column._width * 0.9 + 'px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'
							},
							domProps: {
							title: systemArray.join(',')
							}
						}, systemArray.join(','))
				// 　　　　h('Tooltip', {
				// 　　　　props: { placement: 'top' }
				// 　　　　}, [
				// 　　　　h('span', {
				// 　　　　　　style: {
				// 　　　　　　　　display: 'inline-block',
				// 　　　　　　　　width: params.column._width * 0.9 + 'px',
				// 　　　　　　　　overflow: 'hidden',
				// 　　　　　　　　textOverflow: 'ellipsis',
				// 　　　　　　　　whiteSpace: 'nowrap',
				// 　　　　　　},
				// 　　　　　　},  systemArray.join("，")),
				// 　　　　　　h('span', {
				// 　　　　　　　　slot: 'content',
				// 　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				// 　　　　　　}, systemArray.join("，"))
				// 　　　　])
				　　])
				}
			}, {
				title: '服务时间',
				key: 'serviceDate',
				width: 300,
				// maxWidth: 112,
				render: (h, params) => {
					return (
						<p>
							<span>{params.row.startTime}</span>
							<span v-if="params.row.endTime">至{params.row.endTime}</span>
						</p>
					)
				}
			}, {
				title: '申请人',
				width: 120,
				key: 'applyUser'
			}, {
				title: '申请单位',
				width: 200,
				key: 'applyOrg'
			}, {
				title: '结束时间',
				key: 'endTime',
				width: 160
			}, {
				title: '状态',
				key: 'status',
				width: 80,
				render: (h, params) => {
					var statusText;
					switch(params.row.status) {
						case 1:
							statusText = "未处理";
							break;
						case 2:
							statusText = "已驳回";
							break;
						case 3:
							statusText = "已同意";
							break;
						case 4:
							statusText = "已完结";
							break;
						default:
							statusText = "";
							break;
					};
					return h('span', statusText);
				}
			}, {
				title: '评分',
				key: 'score',
				width: 66,
			}, {
				title: '操作',
				type: 'act',
				width: 200,
				fixed: 'right',
				align: 'center',
				render: (h, params) => {
					const row = params.row;
					const deal = h('Button', {
						props: {
							type: 'primary',
							size: 'small'
						},
						style: {
							marginRight: '5px'
						},
						on: {
							click: () => {
								let id = params.row.id;
								this.$refs['dealModal'].getId(id);
								this.dealDetail = true;
							}
						}
					}, '处理');
					const serverBg = h('Button', {
						props: {
							type: 'primary',
							size: 'small'
						},
						style: {
							marginRight: '5px',
						},
						on: {
							click: () => {
								this.$refs.serviceDocModal.open(row.id)
							}
						}
					}, '服务报告');
					const detail = h('Button', {
						props: {
							type: 'primary',
							size: 'small'
						},
						style: {
							marginRight: '5px',
						},
						on: {
							click: () => {
								this.$router.push({
									name: 'serviceView',
									params: {
										id: row.id
									}
								})
							}
						}
					}, '详情')
					let actBtnArray = [];
					switch(params.row.status) {
						case 1:
							if (vm.authButton.includes('ops_server_examine_auditing')) {
								actBtnArray.push(deal)
							}
							break
						case 2:
						case 3:
							break
						case 4:
							if (vm.authButton.includes('ops_server_examine_server')) {
								actBtnArray.push(serverBg)
							}
							break
					}
					if (vm.authButton.includes('ops_server_examine_detail')) {
						actBtnArray.push(detail)
					}
					return h('div', actBtnArray)
				}
			}],
			safetyEvalData: [],
		}
	},
	computed: {
		...mapState(['authButton'])
	},
	mounted() {
		this.getServiceType(); //获取服务分类列表
		this.pageAuditList(); //查询服务审核分页信息
	},
	methods: {
	    preSearch() {
	        this.pageInfo.pageNo = 1
	        this.pageAuditList()
	    },
		pageChange(num) { //页码改变的回调
			this.pageInfo.pageNo = num;
			this.pageAuditList();
		},
		changePageSize(num) { //切换每页条数时的回调
			this.pageInfo.pageSize = num;
			this.pageAuditList();
		},
		changeTime(val) { //选择时间
			if(val[0] && val[1]) {
				var startTime = val[0].replace(/\//g, "-");
				var endTime = val[1].replace(/\//g, "-");
				this.serviceData.startTime = startTime + " 00:00:00";
				this.serviceData.endTime = endTime + " 23:59:59";
			} else {
				this.serviceData.startTime = "";
				this.serviceData.endTime = "";
			}
		},
		getServiceType() { //获取服务分类列表
			const data = {
				level: 1,
				parentId: -1
			};
			api(operationApiList.getServiceType, data).then(res => {
				if(res.data.errcode === 0) {
					this.serviceTypeList = res.data.data;
				}
			}, error => {
				console.log(error)
			})
		},
		pageAuditList() { //查询服务审核分页信息
			let searchString = (JSON.stringify(this.serviceData)).replace(/\ +/g, "");
			let searchJson = JSON.parse(searchString);
			searchJson.startTime = this.serviceData.startTime
			searchJson.endTime = this.serviceData.endTime
			let formData = {
				"data": searchJson,
				"pageNo": this.pageInfo.pageNo,
				"pageSize": this.pageInfo.pageSize
			};
			api(operationApiList.pageAuditList, formData).then(res => {
				if(res.data.errcode === 0) {
				  if(res.data.data.list){
				    this.safetyEvalData = res.data.data.list;
				    this.pageInfo.total = res.data.data.total
				  }
				}
			}, error => {
				console.log(error)
			})
		},
		closeDealDetail() { //关闭处理详情modal
			this.pageAuditList(); //查询服务审核分页信息
			this.dealDetail = false;
		},
		closeServiceDoc() { //关闭服务报告modal
			this.serviceDoc = false;
		},
		closeAgreeModal() { //关闭同意modal
			this.agree = false;
		},
		closeRejectModal() { //关闭驳回modal
			this.reject = false;
		},
	}
}
</script>
<style lang="less" scoped="scoped">
	.act-btn-group {
		button {
			margin: 0 12px;
		}
	}
	
	.ivu-modal-footer {
		display: none;
	}
	
	.queryItem {
		width: 200px;
	}
	/deep/.ivu-card-body{
	  min-height: 310px;
	}
</style>