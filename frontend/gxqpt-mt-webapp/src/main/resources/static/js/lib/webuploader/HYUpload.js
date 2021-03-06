/**
 *用户上传文件(推荐使用)
 *上传成功通过回调的方式进行
 *文件类型可配置
 * 使用demo见移动终端平台-版本管理-发布新版本 createOrEdit.js
 */

var fileUploadAddress=_GATE_URL+"/api/file";

// var uploader;
function FileUpload(obj){
    // (function( $ ){
        // 当domReady的时候开始初始化
        // $(function() {
            var that = this;
            that.$wrap = $('#'+obj.uploader);

            // 图片容器
            that.$queue = $( '<ul class="filelist"></ul>' )
                .appendTo( that.$wrap.find( '.queueList' ) );

            // 状态栏，包括进度和控制按钮
            that.$statusBar = that.$wrap.find( '.statusBar' ),

            // 文件总体选择信息。
            that.$info = that.$statusBar.find( '.info' ),

            // 上传按钮
            that.$upload = that.$wrap.find( '.uploadBtn' ),

            // 没选择文件之前的内容。
            that.$placeHolder = that.$wrap.find( '.placeholder' ),

            that.$progress = that.$statusBar.find( '.progress' ).hide(),

            // 添加的文件数量
            that.fileCount = 0,

            // 添加的文件总大小
            that.fileSize = 0,

            // 优化retina, 在retina下这个值是2
            that.ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            that.thumbnailWidth = 110 * that.ratio,
            that.thumbnailHeight = 110 * that.ratio,

            // 可能有pedding, ready, uploading, confirm, done.
            that.state = 'pedding';

            // 所有文件的进度信息，key为file id
            that.percentages = {};
            // 判断浏览器是否支持图片的base64
            that.isSupportBase64 = ( function() {
                var data = new Image();
                var support = true;
                data.onload = data.onerror = function() {
                    if( this.width != 1 || this.height != 1 ) {
                        support = false;
                    }
                }
                data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                return support;
            } )();

            // 检测是否已经安装flash，检测flash的版本
            that.flashVersion = ( function() {
                var version;

                try {
                    version = navigator.plugins[ 'Shockwave Flash' ];
                    version = version.description;
                } catch ( ex ) {
                    try {
                        version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                            .GetVariable('$version');
                    } catch ( ex2 ) {
                        version = '0.0';
                    }
                }
                version = version.match( /\d+/g );
                return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
            } )();
            that.supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })();

            // WebUploader实例
            that.uploader = null;

            if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {

                // flash 安装了但是版本过低。
                if (that.flashVersion) {
                    (function(container) {
                        window['expressinstallcallback'] = function( state ) {
                            switch(state) {
                                case 'Download.Cancelled':
                                    alert('您取消了更新！')
                                    break;

                                case 'Download.Failed':
                                    alert('安装失败')
                                    break;

                                default:
                                    alert('安装已成功，请刷新！');
                                    break;
                            }
                            delete window['expressinstallcallback'];
                        };

                        var swf = './expressInstall.swf';
                        // insert flash object
                        var html = '<object type="application/' +
                            'x-shockwave-flash" data="' +  swf + '" ';

                        if (WebUploader.browser.ie) {
                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                        }

                        html += 'width="100%" height="100%" style="outline:0">'  +
                            '<param name="movie" value="' + swf + '" />' +
                            '<param name="wmode" value="transparent" />' +
                            '<param name="allowscriptaccess" value="sameDomain" />' +
                            '</object>';

                        container.html(html);
                    })(that.$wrap);

                    // 压根就没有安转。
                } else {
                    that.$wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                }

                return;
            } else if (!WebUploader.Uploader.support()) {
                alert( 'Web Uploader 不支持您的浏览器！');
                return;
            }
            // 实例化
            that.uploader = new WebUploader.Uploader({
                pick: {
                    id: '#' + obj.filePicker,
                    multiple: obj.mutiple || false,
                    label: '选择文件'
                },
                formData: {
                    folderId: obj.folderId,
                },
                headers:{
                    token:obj.token,
                    _isAdmin:obj._isAdmin,
                    _user_id: $.cookie("_user_id"),
                    _user_name: "",
                },
                // dnd: '#'+obj.dndArea,
                // paste: '#'+obj.uploader,
                swf: '${_js}/webuploader/images/Uploader.swf',
                chunked: false,
                chunkSize: 512 * 1024,
                server:fileUploadAddress+'/p/file/simple',
                // runtimeOrder: 'flash',

                accept: obj.accept || null,
                auto:true,
                // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
                disableGlobalDnd: true,
                // fileNumLimit: 1,
                fileSizeLimit: 1024 * 1024 * 1024,    // 1G
                fileSingleSizeLimit: 2 * 1024 * 1024 * 1024,    // 2G
                duplicate: true
            }) ;
            // 拖拽时不接受 js, txt 文件。
            that.uploader.on( 'dndAccept', function( items ) {
                var denied = false,
                    len = items.length,
                    i = 0,
                    // 修改js类型
                    unAllowed = 'text/plain;application/javascript ';

                for ( ; i < len; i++ ) {
                    // 如果在列表里面
                    if ( ~unAllowed.indexOf( items[ i ].type ) ) {
                        denied = true;
                        break;
                    }
                }

                return !denied;
            });
            that.uploader.on('dialogOpen', function() {
                console.log('here');
            });

            // 添加“添加文件”的按钮，
            /*uploader.addButton({
                id: '#'+obj.jxButton,
                label: '继续添加'
            });*/

            that.uploader.on('ready', function() {
                // window.uploader = uploader;
            });
            that.uploader.on('fileQueued', function( file ) {
                // 返回的是 promise 对象
                this.md5File(file, 0, 1 * 1024 * 1024)
                // 可以用来监听进度
                    .progress(function(percentage) {
                        // console.log('Percentage:', percentage);
                    })
                    // 处理完成后触发
                    .then(function(ret) {
                        var fileName = file.name;
                        console.log(fileName+'-md5:', ret);
                        that.uploader.options.formData[fileName] = ret;
                    });
            });
            // 当有文件添加进来时执行，负责view的创建
            that.addFile = function ( file ) {
                $("#file_html").html("");
                var fileNameS=file.name.split(".");
                fileNameS.pop();
                var fileName=fileNameS.join();
                var $li = $( '<li id="' + file.id + '" >' +
                    '<p class="imgWrap"></p>'+
                    '<p class="wrapSize"></p>'+
                    '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span></div>');
                $prgress = $li.find('p.progress span'),
                    that.$wrap = $li.find( 'p.imgWrap' ),
                    that.$wrapSize = $li.find( 'p.wrapSize' ),
                    // that.$info = $('<p class="error"></p>'),
                    $removeBtns = '',
                    showError = function( code ) {
                        switch( code ) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '上传失败，请重试';
                                break;
                        }

                        that.$info.text( text ).appendTo( $li );
                    };

                if ( file.getStatus() === 'invalid' ) {
                    showError( file.statusText );
                } else {
                    // @todo lazyload
                    that.$wrap.text( '预览中' );
                    // that.uploader.makeThumb( file, function( error, src ) {
                    var name=file.name;
                    that.$wrap.text(name);
                    var size=file.size;
                    if(size){
                        size=size/1024;
                        if(size>1000){
                            size=Math.round(size/1024)+"M";
                        }else{
                            size=Math.round(size)+"KB";
                        }
                    }
                    that.$wrapSize.text(size);
                    that.$wrap.append('<span class="fa fa-close pull-right cancel fa-img"></span>');
                    $removeBtns = $($(that.$wrap).find('.cancel'));
                    $removeBtns.on( 'click', function() {
                        that.uploader.removeFile( file );
                    });
                    // }, that.thumbnailWidth, that.thumbnailHeight );

                    that.percentages[ file.id ] = [ file.size, 0 ];
                    file.rotation = 0;
                }

                file.on('statuschange', function( cur, prev ) {
                    if ( prev === 'progress' ) {
                        $prgress.hide().width(0);
                    } else if ( prev === 'queued' ) {
                        //$li.off( 'mouseenter mouseleave' );
                        //$btns.remove();
                    }

                    // 成功
                    if ( cur === 'error' || cur === 'invalid' ) {
                        console.log( file.statusText );
                        showError( file.statusText );
                        that.percentages[ file.id ][ 1 ] = 1;
                    } else if ( cur === 'interrupt' ) {
                        showError( 'interrupt' );
                    } else if ( cur === 'queued' ) {
                        that.$info.remove();
                        $prgress.css('display', 'block');
                        that.percentages[ file.id ][ 1 ] = 0;
                    } else if ( cur === 'progress' ) {
                        that.$info.remove();
                        $prgress.css('display', 'block');
                    } else if ( cur === 'complete' ) {
                        $prgress.hide().width(0);
                        $li.append( '<span class="success"></span>' );
                    }

                    $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
                });

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;

                    switch ( index ) {
                        case 0:
                            that.uploader.removeFile( file );
                            return;

                        case 1:
                            file.rotation += 90;
                            break;

                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if ( that.supportTransition ) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        that.$wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        that.$wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                    }


                });

                $li.appendTo( that.$queue );
            }

            // 负责view的销毁
            that.removeFile = function ( file ) {
                var $li = $('#'+file.id);
                var siblings=$($li).siblings();
                if($(siblings).length==0){
                    $("#file_html").html("<li>还未选择文件</li>");
                }
                delete that.percentages[ file.id ];
                that.updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
                if( typeof deleteFile === 'function'){
                    if(file.fileId)
                        deleteFile(file.fileId);
                }
            }

            that.updateTotalProgress = function () {
                var loaded = 0,
                    total = 0,
                    spans = that.$progress.children(),
                    percent;

                $.each( that.percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );

                percent = total ? loaded / total : 0;


                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
                that.updateStatus();
            }

            that.updateStatus = function () {
                var text = '';
                var stats;
                if( that.state === 'ready' ){
                    text = '选中' + that.fileCount + '个文件，共' + WebUploader.formatSize( that.fileSize ) + '。';
                }else if( that.state === 'confirm' ){
                    stats = uploader.getStats();
                    if ( stats.uploadFailNum ) {
                        text = '已成功上传' + stats.successNum+ '个文件，'+
                            stats.uploadFailNum + '个文件传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
                    }

                }else{
                    stats = that.uploader.getStats();
                    text = '共' + that.fileCount + '个（' +
                        WebUploader.formatSize( that.fileSize )  +
                        '），已上传' + stats.successNum + '个';

                    if ( stats.uploadFailNum ) {
                        text += '，失败' + stats.uploadFailNum + '个';
                    }
                }

                that.$info.text( text );
            }

            that.setState = function ( val ) {
                var file, stats;

                if ( val === that.state ) {
                    return;
                }

                that.$upload.removeClass( 'state-' + that.state );
                that.$upload.addClass( 'state-' + val );
                that.state = val;

                switch ( that.state ) {
                    case 'pedding':
                        that.$placeHolder.removeClass( 'element-invisible' );
                        that.$queue.hide();
                        that.$statusBar.addClass( 'element-invisible' );
                        that.uploader.refresh();
                        break;

                    case 'ready':
                        that.$placeHolder.addClass( 'element-invisible' );
                        $( '#' + obj.filePicker ).removeClass( 'element-invisible');
                        that.$queue.show();
                        that.$statusBar.removeClass('element-invisible');
                        that.uploader.refresh();
                        break;

                    case 'uploading':
                        $( '#' + obj.filePicker ).addClass( 'element-invisible' );
                        that.$progress.show();
                        // that.$upload.text( '暂停上传' );
                        that.$upload.text( '' );
                        break;

                    case 'paused':
                        that.$progress.show();
                        // that.$upload.text( '继续上传' );
                        that.$upload.text( '' );
                        break;

                    case 'confirm':
                        that.$progress.hide();
                        $( '#' + obj.filePicker ).removeClass( 'element-invisible' );
                        // that.$upload.text( '开始上传' );
                        that.$upload.text( '' );

                        stats = that.uploader.getStats();
                        if ( stats.successNum && !stats.uploadFailNum ) {
                            that.setState( 'finish' );
                            return;
                        }
                        break;
                    case 'finish':
                        stats = that.uploader.getStats();
                        if ( stats.successNum ) {
                            var parm = {
                                folderId: obj.folderId,
                                dataType: obj.dataType,
                                pageNo:1,
                                pageSize: 100,
                            };
                            // parent.layer.msg('上传成功',{time:1500});
                        } else {
                            // 没有成功的图片，重设
                            that.state = 'done';
                            location.reload();
                        }
                        break;
                }

                that.updateStatus();
            }

            that.uploader.onUploadProgress = function( file, percentage ) {
                var $li = $('#'+file.id),
                    $percent = $li.find('.progress span');

                $percent.css( 'width', percentage * 100 + '%' );
                that.percentages[ file.id ][ 1 ] = percentage;
                that.updateTotalProgress();
            };

            that.uploader.onFileQueued = function( file ) {
                that.fileCount++;
                that.fileSize += file.size;

                if ( that.fileCount === 1 ) {
                    that.$placeHolder.addClass( 'element-invisible' );
                    that.$statusBar.show();
                }

                that.addFile( file );
                that.setState( 'ready' );
                that.updateTotalProgress();
            };

            that.uploader.onFileDequeued = function( file ) {
                that.fileCount--;
                that.fileSize -= file.size;

                if ( !that.fileCount ) {
                    that.setState( 'pedding' );
                }

                that.removeFile( file );
                that.updateTotalProgress();

            };
            that.uploader.onUploadAccept = function( file, json ) {//后台返回参数
                if (obj.dateNode) {
                    var dateNodeVal = $("#"+obj.dateNode).val();
                    if(dateNodeVal){
                        json.dateNodeVal=dateNodeVal;
                    }
                }
                //file.file.fileId=json.fileInfo.id;
                if( typeof obj.successUpload === 'function'){
                    obj.successUpload(json, file);
                }
            };
            that.uploader.on( 'all', function( type ) {
                var stats;
                switch( type ) {
                    case 'uploadFinished':
                        that.setState( 'confirm' );
                        break;

                    case 'startUpload':
                        that.setState( 'uploading' );
                        break;

                    case 'stopUpload':
                        that.setState( 'paused' );
                        break;

                }
            });

            that.uploader.onError = function( code ) {
                if(code=="F_DUPLICATE"){
                    code="请不要重复上传文件！";
                }
                if(code=="Q_EXCEED_SIZE_LIMIT"){
                    code="单个文件大小不能超过1G！";
                }
                if(code=="F_EXCEED_SIZE"){
                    code="一次最多只能上传2G大小的文件！";
                }
                if (code == "Q_TYPE_DENIED") {
                    code="文件格式不正确!";
                }
                parent.layer.alert(code,{
                    title: "温馨提示"
                });
            };

            that.$upload.on('click', function() {
                if ( $(this).hasClass( 'disabled' ) ) {
                    return false;
                }

                if ( that.state === 'ready' ) {
                    if (obj.dateNode) {
                        var dateNodeVal = $("#"+obj.dateNode).val();
                        if(!dateNodeVal){
                            alert("请填写时间节点！");
                            return false;
                        }
                    }
                    that.uploader.upload();
                } else if ( that.state === 'paused' ) {
                    that.uploader.upload();
                } else if ( that.state === 'uploading' ) {
                    that.uploader.stop();
                }
            });

            that.$info.on( 'click', '.retry', function() {
                that.uploader.retry();
            } );

            that.$info.on( 'click', '.ignore', function() {
                alert( 'todo' );
            } );

            that.$upload.addClass( 'state-' + that.state );
            that.updateTotalProgress();

            return that.uploader;
        // });

    // })( jQuery );
}