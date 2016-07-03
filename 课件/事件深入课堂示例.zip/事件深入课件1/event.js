/**
 * Created by 珠峰培训 on 2015/1/10.
 */
function on(ele,type,fn){
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

function run(){
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
function off(ele,type,fn){
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