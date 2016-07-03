function processThis(obj,fn){
	return function(e){fn.call(obj,e)}	
}

function on(ele,type,handler){
	
	if(ele.addEventListener){
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

function off(ele,type,handler){
	if(ele.removeEventListener){
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