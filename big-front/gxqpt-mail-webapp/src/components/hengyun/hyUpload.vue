<template>
	<div class="hy-upload">
		<Upload :action="action" :headers="self_headers" :data="self_data" :multiple="multiple" 
			:type="type" :show-upload-list="showUploadList" :accept="accept" :max-size="maxSize" :before-upload="beforeUpload" 
			:on-progress="onProgress" :on-success="onSuccess" :on-error="onError" :on-remove="onRemove" 
			:on-format-error="onFormatError" :on-exceeded-size="onExceededSize" :default-file-list="defaultFileList" ref="upload">
			<Button :id="uploadBtn" type="ghost" icon="ios-cloud-upload-outline" :on-preview="onPreview"><slot>选择文件</slot></Button>
		</Upload>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		name: 'hyUpload',
		props: {
			uploadBtn: String,
			action: { //上传的地址，必填
				type: String,
				default: '/api/file/p/file/simple'
			},
			headers: Object, //设置上传的请求头部
			data: Object, //上传时附带的额外参数
			multiple: Boolean, //是否支持多选文件
			showUploadList: { //是否显示已上传文件列表
				type: Boolean,
				default: true
			},
			type: String, //上传控件的类型，可选值为 select（点击选择），drag（支持拖拽）
			accept: String, //接受上传的文件类型
			maxSize: Number, //文件大小限制，单位 kb
			beforeUpload: Function, //上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
			onProgress: Function, //文件上传时的钩子，返回字段为 event, file, fileList
			onSuccess: Function, //文件上传成功时的钩子，返回字段为 response, file, fileList
			onError: Function, //文件上传失败时的钩子，返回字段为 error, file, fileList
			onPreview: Function, //点击已上传的文件链接时的钩子，返回字段为 file， 可以通过 file.response 拿到服务端返回数据
			onRemove: Function, //文件列表移除文件时的钩子，返回字段为 file, fileList
			onFormatError: Function, //文件格式验证失败时的钩子，返回字段为 file, fileList
			onExceededSize: Function, //文件超出指定大小限制时的钩子，返回字段为 file, fileList
			defaultFileList:Array //设置默认已上传的列表
		},
		data() {
			return {}
		},
		computed: {
			...mapState([
				'userInfo'
			]),
			self_headers() {
				return Object.assign({
					token: this.userInfo.token,
					_user_id: this.userInfo.userId,
				}, this.headers, true);
			},
			self_data() {
				return Object.assign({
					folderId: '-1'
				}, this.data, true);
			}
		},
		methods: {
			clearFiles () {
				this.$refs.upload.clearFiles()
			},
		}
	}
</script>
<style lang="less" scoped="scoped">
	.hy-upload {
		text-align: left;
		display: table;
	}
</style>