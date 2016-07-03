function Emitter(){
	
}
Emitter.prototype.on=function(type,fn){
	if(!this[type]){
		this[type]=[]
	}
	var a=this[type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;
	}
	a.push(fn);
	
}
Emitter.prototype.run=function(type,event,context){
	var a=this[type];
	context=context||this;
	if(a){
		for(var i=0;i<a.length;i++){
			a[i].call(context,event)
			
		}
	}
}
Emitter.prototype.off=function(type,fn){
	var a=this[type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				return;
			}
		}
	}
}

function processThis(obj,fn){
	
	return function(e){fn.call(obj,e)}	
}
function Drag(ele){
	this.ele=ele;
	this.x=null;
	this.y=null;
	this.mx=null;
	this.my=null;
	this.DOWN=processThis(this,this.down);
	this.MOVE=processThis(this,this.move);
	this.UP=processThis(this,this.up);
	on(this.ele,"mousedown",this.DOWN);
	
}

Drag.prototype=new Emitter;
Drag.prototype.down=function(e){
	this.x=this.ele.offsetLeft;
	this.y=this.ele.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	if(this.ele.setCapture){
		this.ele.setCapture();
		on(this.ele,"mousemove",this.MOVE);
		on(this.ele,"mouseup",this.UP)
	}else{
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}	
	e.preventDefault();
	this.run("dragStart",e,this.ele)
}
//obj.on("dragStart",fn)
Drag.prototype.move=function(e){
	this.ele.style.left=e.pageX-this.mx+this.x+"px";
	this.ele.style.top=e.pageY-this.my+this.y+"px";
	this.run("dragging",e,this.ele);
}
Drag.prototype.up=function(e){
	if(this.ele.releaseCapture){
		off(this.ele,"mousemove",this.MOVE);
		off(this.ele,"mouseup",this.UP);
		this.ele.releaseCapture();
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP)
	}
	this.run("dragEnd",e,this.ele);
}