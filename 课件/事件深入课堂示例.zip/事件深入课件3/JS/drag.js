/**
 * Created by 珠峰培训 on 2015/1/10.
 */
function down(e){//把down发布为一个事件：就是把这个行为的发
    //发生写成一个让别人能够约定的标识符
    //"selfDragStart"

    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx= e.pageX;
    this.my= e.pageY;
    if(this.setCapture){
        this.setCapture();
        on(this,"mousemove",move);
        on(this,"mouseup",up);
    }else{
        this.MOVE=processThis(this,move);
        this.UP=processThis(this,up);
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP)
    }
    e.preventDefault();
    fire.call(this,"selfDragStart",e);
    //fly()
}
function move(e){
    this.style.left=this.x+(e.pageX-this.mx)+"px";
    this.style.top=this.y+(e.pageY-this.my)+"px";
    fire.call(this,"selfDragging",e);

}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,"mousemove",move);
        off(this,"mouseup",up);

    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }

    fire.call(this,"selfDragEnd",e);
}