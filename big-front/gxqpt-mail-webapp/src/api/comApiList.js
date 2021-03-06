/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  getOperateMenu: { // 通过账号Id和应用Id获取可访问资源树(只访问菜单)
    url: '/api/admin/p/resource/findcanoperatemenu',
    method: 'post'
  },
  getOperateButton: { // 通过账号Id、[分组、资源Id]获取可访问按钮
    url: '/api/admin/p/resource/findcanoperatebutton',
    method: 'post'
  },
  // 获取当前登录用户的所有单位
  getMyOrgList: {
    url: '/api/mt/userConfi/getMyOrgList',
    method: 'get'
  },
  // 获取消息
  getMessage: {
    url: '/api/msgs/bbs/msg/getNotReadMsg',
    method: 'post'
  },
  toHandlerMsg: {
    url: '/api/msgs/bbs/msg/flagReadedAndGetUrl',
    method: 'get'
  },
  saveAttachment: {// 保存附件
    url: '/api/file/file/saveAttachment',
    method: 'post',
  }
}
const ApiList = { ...serviceModule }

export default ApiList