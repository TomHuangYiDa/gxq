<template>
	<Layout>
		<Content>
			<Breadcrumb>
				<!-- <BreadcrumbItem>高新翼云</BreadcrumbItem> -->
				<BreadcrumbItem>{{title}}</BreadcrumbItem>
			</Breadcrumb>
			<Card>
				<Form ref="formValidate" inline :label-width="100" :model="searchCondition">
					<FormItem label="主机IP：">
						<Input v-model="searchCondition.ip" type="text">
						</Input>
					</FormItem>
					<FormItem label="型号：">
						<Input v-model="searchCondition.model" type="text">
						</Input>
					</FormItem>
					<FormItem label="处理器数量：">
						<Input v-model="searchCondition.cpuCount" type="text">
						</Input>
					</FormItem>
					<FormItem label="内存大小：">
						<Input v-model="searchCondition.memory" type="text">
						</Input>
					</FormItem>
					<FormItem label="网卡数量：">
						<Input v-model="searchCondition.netcardCount" type="text">
						</Input>
					</FormItem>
					<FormItem :label-width="20">
						<Button type="primary" @click="handleSubmit">查询</Button>
						<Button type="primary" v-if="checkButton('hardware_gxyy_zjxxgl_xz')" @click="createEngine">新增</Button>
					</FormItem>
				</Form>
				<hy-table ref="selection" :data="data" :columns="columns" :current="pageOption.current" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
			</Card>
		</Content>
		<Modal v-model="delectState" title="删除确认" width="300" :mask-closable="false">
			<div>您确定删除吗？</div>
			<div slot="footer">
				<Button type="primary" @click="deleteMachine">确定</Button>
				<Button type="text" @click="delectClose">关闭</Button>
			</div>
		</Modal>
		<Modal v-model="editState" :title="editStateTitle" width="70%" :mask-closable="false">
			<engine-edit ref="engineEdit" v-on:examine="editSave"></engine-edit>
			<div slot="footer">
				<Button type="primary" @click="editSubmit('engineEdit')">确定</Button>
				<Button type="text" @click="editClose">关闭</Button>
			</div>
		</Modal>
	</Layout>
</template>

<script>
	import engineEdit from './engineEdit'
	import api from '@/api/axiosApi'
	import softhardApiList from '@/api/softhardApiList'
	import hyTable from '@/components/hengyun/table'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title:this.$store.state.title,
				delectState: false,
				editState: false,
				editStateTitle:'编辑',
				actId:null,
				searchCondition: { //查询参数
					ip: '',
					model: '',
					cpuCount: null,
					memory: null,
					netcardCount: null,
				},
				pageOption: { //分页参数
					current: 1,
					total: 0,
					pageSize: 10
				},
				columns: [{ //列表表头数据
						type: 'index',
						title: '序号',
						width: 60,
						align: 'center'
					},
					{
						title: '主机IP',
						key: 'ip'
					},
					{
						title: '所属集群',
						key: 'cluster'
					},
					{
						title: '型号',
						key: 'model'
					},
					{
						title: '处理器类型',
						key: 'cpuType'
					},
					{
						title: '处理器数量（核）',
						key: 'cpuCount',
						width: 140
					},
					{
						title: '网卡数量（个）',
						key: 'netcardCount',
						width: 120
					},
					{
						title: '内存（G）',
						key: 'memory',
						width: 100
					},
					{
						title: '磁盘大小（G）',
						key: 'diskSize',
						width: 120
					},
					{
						title: '操作',
						key: 'address',
						align: 'center',
						minWidth: 80,
						render: (h, params) => {
							const vm = this
							const update = h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									display:this.checkButton('hardware_gxyy_zjxxgl_xg')?'inline-block':'none'
								},
								on: {
									click: () => {
										var id=params.row.id;
										vm.updateEngine(id);
									}
								}
							}, '修改')
							const delect = h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									display:this.checkButton('hardware_gxyy_zjxxgl_sc')?'inline-block':'none'
								},
								on: {
									click: () => {
										var id=params.row.id;
										vm.delectEngine(id);
									}
								}
							}, '删除')
							return h('div', [update, delect])
						}
					}
				],
				data: [], //表格数据
			}
		},
		components: {
			engineEdit,
		},
		mounted() {
			this.findMachineList(); //查询主机列表
		},
		methods: {
			handleSubmit() { // 点击查询按钮
				this.pageOption.current=1;
				this.findMachineList();
			},
			findMachineList() { // 查询主机列表
				this.data = [];
				var formData = {
					"data": { ...this.searchCondition
					}, //Object.assign({}, this.searchCondition),
					"pageNo": this.pageOption.current,
					"pageSize": this.pageOption.pageSize
				};
				api(softhardApiList.findMachineList, formData).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.data = res.data.data.list;
						if(this.data.length>0){
							this.pageOption.pageSize = res.data.data.pageSize;
							this.pageOption.total = res.data.data.total;
							this.pageOption.current = res.data.data.pageNum;
						};
					}
				}, (err) => {
					//dong something...
				})
			},
			pageChange(num) { //页码改变的回调
				this.pageOption.current = num;
				this.findMachineList();
			},
			changePageSize(num) { //切换每页条数时的回调
				this.pageOption.pageSize = num;
				this.findMachineList();
			},
			editSave(param) { //保存主机数据
				if(this.actId){
					this.updateMachine(param);
					return false;
				};
				api(softhardApiList.saveMachine, param).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.$Message.success({
							content: '新增主机成功！',
							duration: 3
						});
						this.pageOption.current = 1;
						this.findMachineList();
						this.editState = false;
					}else{
						this.error(res.data.errmsg);
					}
				}, (err) => {
					//dong something...
				})
			},
			updateMachine(param) { //修改主机数据
				param.id=this.actId;
				api(softhardApiList.updateMachine, param).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.success();
						this.findMachineList();
						this.editState = false;
						this.actId = null;
					}else{
						this.error(res.data.errmsg);
					}
				}, (err) => {
					//dong something...
				})
			},
			deleteMachine() { //删除主机数据
				api(softhardApiList.deleteMachine, {id:this.actId}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.deleteSuccess();
						this.findMachineList();
						this.delectState = false;
						this.actId = null;
					}else{
						this.error(res.data.errmsg);
						this.delectState = false;
						this.actId = null;
					}
				}, (err) => {
					//dong something...
				})
			},

			// 操作
			success() { //成功提示
				this.$Message.success({
					content: '编辑主机成功！',
					duration: 3
				});
			},
			deleteSuccess() { //删除成功提示
				this.$Message.success({
					content: '删除主机成功！',
					duration: 3
				});
			},
			error(errormsg) { //错误提示
				this.$Message.error({
					content: errormsg,
					duration: 3
				});
			},
			createEngine() { //新增
				this.editState = true;
				this.editStateTitle = '新增';
			},
			updateEngine(id) { //修改
				this.actId = String(id);
				this.editState = true;
				this.editStateTitle = '编辑';
				this.$refs['engineEdit'].getMachineDetail(this.actId);
			},
			editClose() { //关闭编辑
				this.editState = false;
				this.actId = null;
			},
			delectEngine(id) { //删除
				this.actId = String(id);
				this.delectState = true;
			},
			delectClose() { //关闭删除
				this.delectState = false;
				this.actId = null;
			},
			editSubmit(name) {
				this.$refs[name].handleSubmit("engine");
			},
			checkButton(code){
				if(this.authButton.indexOf(code) >= 0){
					return true;
				}else{
					return false;
				}
			}
		},
		computed: {
			...mapState([
			'authButton'
			])
		},
		watch:{
			editState(val){
				if(!val){
					this.$refs['engineEdit'].reload();
				}
			}
		}
	}
</script>

<style lang='less'>
	.access-list {
		span.handle {
			margin: 0 5px;
			display: inline-block;
			cursor: pointer;
			&:hover {
				color: #57a3f3;
			}
		}
	}
	.ivu-btn{
		margin-right: 5px;
	}
</style>
