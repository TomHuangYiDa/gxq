package com.hengyunsoft.commons.exception.core;

import com.hengyunsoft.exception.code.BaseExceptionCode;

/***
 * 移动端（gxqpt-mt项目）相关的异常代码
 * 移动端异常编码 范围：90000-94999
 */
public enum MtExceptionCode implements BaseExceptionCode {
    //应用管理90000-90499
    CREATEAPP_CREATEAPPFIRSTREQDTO(90000, "创建应用第一步提交参数,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_ID(90001, "应用id,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_APPNAME(90002, "应用名称,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_APPTYPE(90003, "应用类型,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_ICON(90004, "应用图标,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_STATE(90005, "审核状态,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_PATH(90006, "应用路径,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_APPDESC(90007, "应用说明,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_ISSHOW(90008, "是否显示,不能为空"),
    CREATEAPP_CREATEAPPFIRSTREQDTO_APPORDER(90009, "排序,不能为空"),

    APP_NOT_EXIST(90010, "应用不存在"),
    APP_FIND_LIST(90011, "查询应用列表参数不能为空"),

    AUDITAPP_AUDITAPPREQDTO(90012, "审核应用请求参数,不能为空"),
    AUDITAPP_AUDITAPPREQDTO_ID(90013, "应用id,不能为空"),
    AUDITAPP_AUDITAPPREQDTO_STATE(90014, "审核状态(2通过,3驳回),不能为空"),
    AUDITAPP_AUDITAPPREQDTO_AUDITCONTENT(90015, "审批内容,不能为空"),

    APP_CAN_NOT_AUDIT(90016, "你没有审核应用权限"),

    CREATEAPPSECOND_CREATEAPPSECONDREQDTO(90017, "创建应用第二步（选择接口）请求参数,不能为空"),
    CREATEAPPSECOND_CREATEAPPSECONDREQDTO_ID(90018, " 应用id,不能为空"),
    CREATEAPPSECOND_CREATEAPPSECONDREQDTO_INTERFACEIDS(90019, "选择的接口id,不能为空"),

    CREATEFUNCTION_CREATEFUNCTIONREQDTO(90020, "创建功能请求参数,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_ID(90021, "功能id,编辑有id，新增无id,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_APPNAME(90022, "功能名称,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_PARENTID(90023, "功能的父id,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_SHOWURL(90024, "显示该功能的名称和提示的数量数据的接口,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_APPPATH(90025, "功能路径,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_APPDESC(90026, "功能说明,不能为空"),
    CREATEFUNCTION_CREATEFUNCTIONREQDTO_ISSHOW(90027, "是否显示,不能为空"),
    //客户端版本管理90500-90999
    CREATEVERSION_CREATEVERSIONPARAMDTO(90500, "创建版本请求参数,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_ID(90501, "版本id,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_CNAME(90502, "版本名称,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_NUMBER(90503, "版本号,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_UPDATECONTENT(90504, "升级内容,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_APKFILEID(90505, "文件id,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_APKFILENAME(90506, "文件名称,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_APKFILEPATH(90507, "文件路径,不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_PWUPDATE(90508, "是否强制更新(1不强制,2强制),不能为空"),

    CAN_NOT_PUBLISH(90509, "没有发布版本权限"),
    VERSION_HAS_NOT(90510, "版本不存在"),
    VERSION_IS_PUBLISH(90511, "该版本已经发布"),
    VERSION_FIND_PARAM_NULL(90512, "查询版本类参数不能为空"),
    CREATEVERSION_CREATEVERSIONPARAMDTO_SIZE(90513, "文件大小不能为空"),
    //使用帮助 91000-91499
    HELP_TITLE_NULL(91000, "标题不能为空"),
    HELP_CONTENT_NULL(91001, "内容不能为空"),
    //日志管理 91500-91999
    WORK_TYPE_NULL(91500, "工作类型不能为空"),
    WORK_DESCRIPTION_NULL(91501, "工作描述不能为空"),
    WORK_CONTENT_NULL(91502, "回复内容不能为空"),
    WORK_LOG_ID_NULL(91503, "日志ID不能为空"),
    WORK_USER_ID_NULL(91504, "用户ID不能为空"),

    //意见反馈 92000 - 92499
    CREATEFEEDBACK_CREATEFEEDBACKDTO(92000, "创建意见反馈请求参数,不能为空"),
    CREATEFEEDBACK_CREATEFEEDBACKDTO_ID(92001, "主键id,不能为空"),
    CREATEFEEDBACK_CREATEFEEDBACKDTO_FBTITLE(92002, "反馈标题,不能为空"),
    CREATEFEEDBACK_CREATEFEEDBACKDTO_FBCONTENT(92003, "反馈内容,不能为空"),
    CREATEFEEDBACK_CREATEFEEDBACKDTO_FBEMERGENCY(92004, "紧急程度(,不能为空"),
    CREATEFEEDBACK_CREATEFEEDBACKDTO_IMAGES(92005, "应用id,不能为空"),

    FINDLIST_OPENAPIREQ(92006, "分页参数,不能为空"),
    FEEDBACK_HAS_NOT(92007, "意见反馈不存在"),
    REPLYFEEDBACK_CONTEXT(92008, "回复内容不能为空"),
    REPLYFEEDBACK_CLOSE(92009, "意见反馈已经关闭"),

    //用户设置 92500 - 92999
    UNITY_ID_IS_NULL(92500, "单位id，不能为空"),
    NOT_SET_MAIN_UNITY_ID(92501, "没有设置主单位"),
    //考勤相关 93000 - 93499
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO(93000, "创建规则,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_INTIME(93001, "签到时间,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_OUTTIME(93002, "签退时间,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_STARTTIME(93003, "午休开始时间,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_ENDTIME(93004, "午休结束时间,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_DISTANCERANGE(93005, " 签到距离范围(米),不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_LNG(93006, "经度,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_LAT(93007, "纬度,不能为空"),
    CRATEEPUNCHCLOCKRULE_CREATEPUNCHCLOCKRULEDTO_LOCATION(93008, "打卡地点,不能为空"),

    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO(93009, "创建打卡,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_CLOCKTYPE(93010, " 打卡类型:1,签到；2，签退,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_ADCETYPE(93011, "考勤类型:1,内勤；2，外勤,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_AUTOSIGNINFLAG(93012, "是否自动签到:1,手动；2，自动,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_AUTOSIGNOFFFLAG(93013, "是否自动签退:1,手动；2，自动,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNINLNG(93014, "签到经度,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNINLAT(93015, "签到纬度,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNLOCATION(93016, "签到地点,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNOFFLNG(93017, "签退经度,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNOFFLAT(93018, " 签退纬度,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_SIGNOFFLOCATION(93019, "签退地点,不能为空"),
    CREATEPUNCHCLOCK_CREATEPUNCHCLOCKDTO_IMAGES(93020, "打卡图片,不能为空"),

    UNIOTY_HAS_ATEPUNCHCLOCK_ROLE(93021, "该单位没有创建考勤规则"),
    QUERY_PUNCHCLOCK_PARAM(93022, "查询打卡记录参数不能为空"),
    PUNCHCLOCK_ID_NULL(93023, "打卡记录id不能为空"),
    PUNCHCLOCK_IS_NOT_HAS(93024, "打卡记录不存在"),
    QUERY_APPRAPPLY_PARAM(93025, "查询申请列表记录参数不能为空"),
    APPLYID_HAS_NOT(93026, "审批id不能为空"),
    APPLY_HAS_NOT(93027, "审批申请不存在"),
    APPLY_HAS_NOT_RREACH(93028, "当前不到你审批"),
    APPLY_HAS_IS_AGREE(93029, "是否同意不能为空"),
    APPLY_HAS_IS_CONTENT(93030, "处理内容不能为空"),
    APPLY_PERSON_HAS_NOT(93031, "审批人不存在"),
    APPLY_HAS_NOT_ING(93032, "该申请没有在审批中"),

    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO(93032, "创建申请参数,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_APRTYPE(93033, "审批类型(overtime:加班，leave:请假，business:出差，outside:外勤，:supply:补签),不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_STARTTIME(93034, "开始时间,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_ENDTIME(93035, "结束时间,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_LEAVETYPE(93036, "请假类型,出差类型（从数据字典中获取name来存放）,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_CONTENT(93037, "加班内容,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_LEAVEHOUR(93038, "请假小时,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_LEAVEREASON(93039, "请假事由,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_PROVINCE(93040, "出差省,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_CITY(93041, "出差市,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_ADDRESS(93042, "详细地址,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_VEHICLE(93043, " 交通工具,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_ENTOURAGE(93044, "随行人员,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_ENTOURAGEPHONE(93045, " 联系电话,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_BUSINESSHOUR(93046, "出差 小时,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_BUSINESSREASON(93047, "出差事由,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_SUPPLYTYPE(93048, "补签类型(1:签到、2:签退),不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_DATA(93049, "补签日期,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_REASON(93050, "补签理由,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_DESCRIPTION(93051, "外出描述,不能为空"),


    CANCEL_CAN_NOT_CANCEL(93052, "撤销申请不能撤销"),

    CANCELLAPPRAPPLY_CANCELLAPPRAPPDTO(93053, "撤销申请,不能为空"),
    CANCELLAPPRAPPLY_CANCELLAPPRAPPDTO_ID(93054, "申请id,不能为空"),
    CANCELLAPPRAPPLY_CANCELLAPPRAPPDTO_CANCEREASONL(93055, "撤销理由,不能为空"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_OVER_TIME_NOT_SAME_DAY(93056, "加班申请不能跨天"),
    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_OTU_WORK_NOT_SAME_DAY(93057, "外勤申请不能跨天"),
    APPLY_HAS_NOT_CACALE(93057, "撤销中或者已撤销或者被驳回的申请不能撤销"),

    WEB_QUERY_MY_STATICS_PARAM_EMPTY(93058,"查询参数不能为空"),
    QUERY_ATTMONTH_HAS_NULL(93059,"查询月不能为空"),
    QUERY_TYPE_HAS_NULL(93060,"查询类型不能为空"),

    CREATEAPPRAPPLY_CREATEAPPRAPPLYDTO_APPRR_PERSON(93061,"审批人不能为空"),

    COMPONENT_NAME_NOT_NULL(94000,"主件名称不能为空"),
    COMPONENT_CONTENT_NOT_NULL(94001,"主件内容不能为空"),
    COMPONENT_NOT_NULL(94002,"主件对象不能为空"),
    COMPONENT_ID_NOT_NULL(94003,"主件ID不能为空"),
    ;
    private int code;
    private String msg;

    MtExceptionCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMsg() {
        return msg;
    }
}