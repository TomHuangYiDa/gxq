package com.hengyunsoft.platform.warn.entity.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 描述：预警处理台账分页响应DTO
 * @author sxy
 * @date 2018/07/09
 * @return
 */
@Data
@ApiModel(value = "QueryWarnHandleLedgerResDO", description = "预警处理台账分页响应DTO")
public class QueryWarnHandleLedgerResDO implements Serializable{

        /**
         * 主键TD
         * @mbggenerated
         */
        @ApiModelProperty(value = "id")
        private Long id;
        /**
         * 预警标题
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警标题" )
        private String title;
        /**
         * 预警类型
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警类型")
        private String type;
        /**
         * 应用程序名称
         * @mbggenerated
         */
        @ApiModelProperty(value = "应用程序")
        private String appName;
        /**
         * 预警时间
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警时间")
        private Date warntime;
        /**
         * 预警状态  未确认、已确认、已处理
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警状态 1、未确认 2、已确认 3、已处理")
        private String status;
        /**
         * 预警级别
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警级别")
        private Integer level;

        /**
         * 预警责任人名称
         * @mbggenerated
         */
        @ApiModelProperty(value = "预警接收人名称")
        private String recName;

        /**
         * 接收类型
         * @mbggenerated
         */
        @ApiModelProperty(value = "接收类型")
        private String recType;

        /**
         * 处理信息
         * @mbggenerated
         */
        @ApiModelProperty(value = "处理信息")
        private String remarks;

        /**
         * 是否属实
         * @mbggenerated
         */
        @ApiModelProperty(value = "是否属实")
        private boolean result;

        /**
         * 处理时间
         * @mbggenerated
         */
        @ApiModelProperty(value = "处理时间")
        private Date updateTime;


    private static final long serialVersionUID = 1L;


}
