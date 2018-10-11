(function(){
	/**
	 * 1.先引入该js
	 * 
	 * 2.var appBridge = AppBridge()//初始化
	 * 
	 * 3.appBridge.establishLink(object)
	 * 
	 * 4.object={
	 * 	interlinkageApp:'interlinkage_app',//链接App参数
	 * 	interlinkageData:{},	//传给App的数据
	 * 	interlinkageCallBack:function(data){//app返回的数据
	 * 		
	 *   }
	 * }
	 */
	var pluginThis;
	var appBridge = function(){
		this.option = {};
		pluginThis = this;
	}
	
	appBridge.prototype.establishLink = function(option){
		if(option){
			pluginThis.option = option;
			pluginThis.buildBridge();
		}else{
			pluginThis.buildBridge();
		}
	}	
	//嫁接app的桥梁
	appBridge.prototype.buildBridge = function(){
		if(pluginThis.getUserAgen().isGolfplus){
			//app内部登录
			if(window.WebViewJavascriptBridge){
				//优先使用WebViewJavascriptBridge桥接
				pluginThis.golfplusBridgeAction(WebViewJavascriptBridge);
			}else{
				if(pluginThis.getUserAgen().isAndroid){
					document.addEventListener('WebViewJavascriptBridgeReady',function(){
						//ready后window对象中就会自动创建WebViewJavascriptBridge
						pluginThis.golfplusBridgeAction(WebViewJavascriptBridge);
					});
				}else if(pluginThis.getUserAgen().isIos){
					if(window.WVJBCallbacks){
						window.WVJBCallbacks.push(pluginThis.golfplusBridgeAction);
					}else{
						window.WVJBCallbacks = [pluginThis.golfplusBridgeAction];
			            var WVJBIframe = document.createElement('iframe');
			            WVJBIframe.style.display = 'none';
			            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
			            document.documentElement.appendChild(WVJBIframe);
			            setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
					}
				}else{
					//其它，留给公司以后对接安卓和ios以外app的设备使用
				}
			}
		}else{
			//app外部登录
			
		}	
	};
	
	//云高app桥接响应方法
	appBridge.prototype.golfplusBridgeAction = function(bridge){
		if(bridge){
			if(bridge.init){
				bridge.init();
			}
			bridge.callHandler(pluginThis.option.interlinkageApp,pluginThis.option.interlinkageData, function(data) {
					pluginThis.reverseBack(data)   
		    });
		}	
	};
	
	//app里回调出来的数据
	appBridge.prototype.reverseBack = function(data){
		if(data){
			pluginThis.option.interlinkageCallBack(data)
		}
	}

	//获取浏览器信息
	appBridge.prototype.getUserAgen = function(){
		var userAgent = navigator.userAgent.toLowerCase();
		return {
			isGolfplus: userAgent.indexOf('golfplus') > -1,
			isIos: userAgent.match(/iPhone|iPad|iPod/i),
			isIphone: userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1,
			isAndroid: userAgent.match(/Android/i),
			isWechat: userAgent.match(/MicroMessenger/i) == "micromessenger",
			isIpad: userAgent.indexOf('iPad') > -1
		};
	};

	
	window.AppBridge = function(){
		var tempPlugin = new appBridge();
	    return tempPlugin;
	};
	
})();