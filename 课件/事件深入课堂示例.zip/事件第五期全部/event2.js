function processThis(obj,fn){
	return function(e){fn.call(obj,e)}	
}

function on(ele,type,handler){
	if(typeof ele["on"+type] =="undefined"){//这是自定义事件
		if(!ele["self"+type]){//判断这个数组是否存在
			ele["self"+type]=[];
		}
		var a=ele["self"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==handler){//避免数组里有重复的方法
				return;	
			}
		}
		a.push(handler);
		
	}else 	if(ele.addEventListener){
		ele.addEventListener(type,handler,false);
	}else if(ele.attachEvent){
		//ele.attachEvent("on"+type,handler);
		if(!ele["IEevent"+type]){//判断这个数组是否存在
			ele["IEevent"+type]=[];
		}
		var a=ele["IEevent"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==handler){//避免数组里有重复的方法
				return;	
			}
		}
		a.push(handler);
		
		if(!ele["attachEvent"+type]){
			ele["attachEvent"+type]=processThis(ele,run);
	//真正绑定的是run(改造之后的)，并且只能在同一事件上绑定一次
			ele.attachEvent("on"+type,ele["attachEvent"+type]);
		}
	}
}

function run(){
	
	var e=window.event;
	var type=e.type;
	var a=this["IEevent"+type];
	e.target=e.srcElement;
	e.preventDefault=function(){
		e.returnValue=false;
	}
	e.stopPropagation=function(){e.cancelBubble=true}
	e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
	e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
	for(var i=0;i<a.length;){
		if(a[i]===null){
			a.splice(i,1);					
		}else{
			a[i].call(this,e);
			i++;
		}
	}
}

function fire(typeSelf,event){
	//typeSelf是自定义事件的字符串（就是当前这个行为的标识符）
	//event是浏览器的（系统级）的事件
	var a=this["self"+typeSelf];
	for(var i=0;i<a.length;i++){
		a[i].call(this,event);
	}
}

function off(ele,type,handler){	
	if(typeof ele["on"+type] =="undefined"){//这是自定义事件
		var a=ele["self"+type];
		if(a)
			for(var i=0;i<a.length;i++){
				if(a[i]==handler){
					a[i]=null;
					return;
				}
			}		
	}else 	if(ele.removeEventListener){
		ele.removeEventListener(type,handler,false)
	}else if(ele.detachEvent){
		var a=ele["IEevent"+type];
		if(a){
			for(var i=0;i<a.length;i++){
				if(a[i]==handler){
					a[i]=null;
				}
			}
		}
	}	
}