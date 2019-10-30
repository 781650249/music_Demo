//将index 抽离出来成一个模块
(function($,root){
    function Control(len){
      this.index = 0;
      this.len =len;
    }
    Control.prototype = {
        prev:function(){
            return this.getIndex(-1);
        },
        next:function(){
            return this.getIndex(1);
        },
        getIndex:function(val){
             var index =this.index; //当前对应索引
             var len = this.len; //数据总长度
             var curIndex =(index + val + len)%len;
             this.index = curIndex;
             return curIndex;
        }
    }
    root.controlIndex =Control;
})(window.Zepto,window.player || (window.player ={}))