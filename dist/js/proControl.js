//根据播放的时间来显示pro的进度，给slider绑定拖拽事件
//进度条模块 
// 1.渲染总时间  2.播放音乐进度条运动 
// 3.左侧更新时间 4.交互 拖拽进度条（位置时间更新，跳到当前歌曲位置）
(function ($, root) {
     var startTime;
     var frameId;
     var dur;
     var lastPer  = 0;

     function renderAllTime(time){
         dur =time ;
         time = formatTime(time);
        $('.all-time').html(time);
     }
     function formatTime(t){
         t = Math.round(t);
         var m = Math.floor(t / 60);
         var s = t%60; 
        m= m < 10 ? '0'+ m:m;
        s= s < 10 ? '0'+ s:s;
         //考虑时间是个位数分位给它补0；
         return m +':'+ s
     }
     function start(p){
         //拖拽时当前位置的歌曲时间要取到上次托拽所占的百分比如果有值就赋值给lastper,没有则undefined
         lastPer  = p ==undefined ? lastPer : p;
        startTime  =new Date().getTime();
        function  frame(){
            var nowTime = new Date().getTime();
            var per = lastPer + (nowTime - startTime) / (dur*1000);
            if(per<1){
                update(per);
            }else{
               cancelAnimationFrame(frameId)
            }
            frameId = requestAnimationFrame(frame)
        }
        frame()
     }
     //根据传进来的百分比 进行渲染左侧时间和进度条位置
     function update(p){
          var time =formatTime(p * dur);
          $('.cur-time').html(time);
          var perX =(p - 1)*100 +'%';
          $('.pro-top').css({
              'transform':'translateX('+ perX +')'
          })
     }
     function stop(){
         cancelAnimationFrame(frameId);
         var stopTime = new Date().getTime();
         lastPer  = lastPer + (stopTime - startTime) /(dur *1000)
     }  



   root.pro  = {
       renderAllTime:renderAllTime,
       start:start,
       stop:stop,
       update:update,
   }


}) (window.Zepto, window.player || (window.player = {}));
