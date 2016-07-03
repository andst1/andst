/**
 * Created by 珠峰培训 on 2015/1/10.
 */
function processThis(obj,fn){
    return function(e){fn.call(obj,e)}
}
function on(ele,type,fn){
    if(/^self/.test(type)){//判断是否是自定义事件
        if(!ele[type]){
            ele[type]=[];
        }
        var a=ele[type];
        for(var i=0;i< a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);

    }else{
        if(ele.addEventListener){
            ele.addEventListener(type,fn,false)
        }else{//IE的专用方案
            if(!ele["aEvent"+type]){
                ele["aEvent"+type]=[];
                ele.attachEvent("on"+type,function(){run.call(ele)})
            }
            var a=ele["aEvent"+type];
            for(var i=0;i< a.length;i++){
                if(a[i]==fn)return;
            }
            a.push(fn);
        }
    }

}

function run(){//这个方法只系统事件的兼容性问题
    var e=window.event;
    var type= e.type;
    var a= this["aEvent"+type];
    e.target= e.srcElement;
    e.stopPropagation=function(){e.cancelBubble=true}
    e.preventDefault=function(){e.returnValue=false};
    e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)
    + e.clientX;
    e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    for(var i=0;i< a.length;){
        if(typeof a[i]!="function"){
            a.splice(i,1);
        }else{
            a[i].call(this,e);
            i++;
        }

    }
}
function fire(selfType,e){//第一个参数是自定义事件的类型，第二个参数是系统的事件
    var a=this[selfType];
    if(a){
        for(var i=0;i< a.length;){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
                i++
            }else{
                a.splice(i,1);
            }

        }
    }

}
function off(ele,type,fn){
    if(/^self/.test(type)){
        var a=ele[type];
        if(a){
            for(var i=0;i< a.length;i++){
                if(a[i]==fn){
                    a[i]=null;
                    return;
                }
            }
        }
    }else{
        if(ele.removeEventListener){
            ele.removeEventListener(type,fn,false);
        }else{
            var a=ele["aEvent"+type];
            if(a&& a.length){
                for(var i=0;i< a.length;i++){
                    if(a[i]==fn){
                        a[i]=null;
                        return;
                    }
                }
            }
        }
    }


}