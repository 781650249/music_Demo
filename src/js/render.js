//实现页面渲染 img+info+like-btn
//对jquery源码的深入剖析 理解为何封闭作用域，避免全局变量的冲突
(function($,root){
 function renderImg(src){
    var img = new Image();
    img.src = src;
    img.onload = function(){
        $('.img-box img').attr('src',src);
        root.blurImg(img,$('body')); //给背景设置高斯模糊
    } 
 }
 function renderInfo(info){
    var str ='<div class="song-name">'+info.song+'</div>\
    <div class="singer-name">'+info.singer+'</div>\
    <div class="album-name">'+info.album+'</div>';
     $('.song-info').html(str);
 }
 function renderIsLike(like){
        if(like){
           $('.like').addClass('liking')
        }else{
            $('.like').removeClass('liking')
        }
 }
 
 root.render=function(data){
     renderImg(data.image);
     renderInfo(data);
     renderIsLike(data.isLike);
 }
})(window.Zepto,window.player || (window.player = {}));


//多次调用Zepto会每次去全局上着，赋给$就不用去全局上找，一次变量传入就可以直接拿到$
//window.player是暴露在全局上的方法的临时对象