var root = window.player;
var dataList;
var len;
var audio = root.audioManager;
var control;
var timer;

//暴露一个构造函数，为什么不暴露一个对象New AudioManager(src)
//因为在播放音频资源之前，需要传一个音频资源的参数，所以直接暴露 AudioManager构造函数，调用它直接new AudioManager(src)

function getData (url) {
  $.ajax ({
    type: 'GET',
    url: url,
    success: function (data) {
      dataList = data;
      len = data.length;
      control = new root.controlIndex (len); //此时control是个对象，有len和index 还拥有暴露的prev和next方法
      console.log (data);
      changeLike(dataList);
      changeSong(dataList);
      // renderPro(dataList);
      root.render (data[0]);
      audio.getAudio (data[0].audio); //默认加载第一条音频
      bindEvent ();
      bindTouch();
      $ ('body').trigger ('play:change', 0);
    },
    error: function () {
      console.log ('error');
    },
  });
}

function bindEvent () {
  //触发自定义事件
  $ ('body').on ('play:change', function (e, index) {
    audio.getAudio (dataList[index].audio);
    root.pro.renderAllTime(dataList[index].duration);
    root.render (dataList[index]);
    if (audio.status == 'play') {
      audio.play ();
      rotated (0 );
    }
    $ ('.img-box').attr ('data-deg', 0);
    $ ('.img-box').css ({
      transform: 'rotateZ(0deg)',
      transition: 'none',
    });
  });
  $ ('.prev').on ('click', function () {
    var i = control.prev ();
    // renderPro(dataList)
    $ ('body').trigger ('play:change', i);
    root.pro.start(0);
  });
  $ ('.next').on ('click', function () {
    var i = control.next ();
    // renderPro(dataList)
    $ ('body').trigger ('play:change', i);
    root.pro.start(0);
  });
  $ ('.play').on ('click', function () {
    if (audio.status == 'pause') {
      audio.play ();
      root.pro.start();
      var deg = $ ('.img-box').attr ('data-deg');
      rotated (deg);
    } else {
      audio.pause ();
      root.pro.stop();
      clearInterval (timer);
    }
    $ ('.play').toggleClass ('playing');
  });
}

function rotated (deg ) {
  clearInterval (timer);
  //每次暂停之后又想到去取上次暂停时的角度，可以设置一个data-deg属性来记录当前的角度值,每次从当前传入的实参开始变化
  timer = setInterval (function () {
      deg = +deg;  //将变量转化为字符串
    deg += 2;
    $ ('.img-box').attr ('data-deg', deg);
    $ ('.img-box').css ({
      transform: 'rotateZ(' + deg + 'deg)',
      transition: 'all 1s ease-out',
    });
  }, 200);
}

function changeLike(data){
    $('.like').on('click',function(){
        if(data){
            $('.like').toggleClass('liking')
        }
    })
}


function changeSong(info){
    var len = info.length;
    var str='';
    for(var i=0;i<len;i++){
        str +='<li class="song-name"  data-index ='+ i +'>'+info[i].song+' - '+info[i].singer+ '</li>'
    }
    $('.songs').html(str);
    
    info.forEach(function(ele,index){
      console.log(index,ele);
      audio.getAudio (info[index].audio);   
    })

   $('.song').on('click','li',function(e,index){
        i = ($(e.target).data('index'));
        $(this).addClass('ceshi')
        
        control.index = i;
       audio.getAudio(info[i].audio)
       root.render (info[i]);
       audio.play();
       root.pro.start(0)
       if(audio.status =='play'){
        $ ('.play').addClass ('playing');
       }
        $('.song').css({
            display:'none'
        });
       if (audio.status == 'pause') {
        audio.play (); 
       }
      
   })
} 

function  hideSong(){
    $('.list').on('click',function(){
        $('.song').css({
            'display':'block'
        })
    })
    $('.close').on('click',function(){
        $('.song').css({
            'display':'none'
        })
    }) 
}
hideSong()


function bindTouch(){
  var $slider = $('.slider');
  var offset = $('.pro-bottom').offset();
  var left  =offset.left;
  var width  =offset.width;
  console.log(left,width);
  $slider.on('touchstart',function(){
    root.pro.stop();
  }).on('touchmove',function(e){
    var x= e.changedTouches[0].clientX;
    var per = (x-left)/width;
    if(per>0&&per<1){
      root.pro.update(per);
    }
  }).on('touchend',function(e){
    var x =e.changedTouches[0].clientX;
    var per = (x - left)/width;
    if(per>0 && per<1){
      var curTime  =  per *dataList[control.index].duration;
      $('.play').addClass('playing');
      audio.playTo(curTime);
      audio.status =  'play';
      audio.play();
      root.pro.start(per);
    }
  })

}

// function renderPro(dataList){
//     index = control.index;
//       var str = ''; 
//       str+= '<div class="all-time">'+ Math.floor(dataList[index].duration/60)+':'+dataList[index].duration%60+'</div>'
//       $('.all-time').html(str);
// }
getData ('/dist/mock/data.json'); 




// 信息+图片的渲染
// 点击按钮
// 音乐的播放与暂停 切歌
// 进度条的运动与拖拽
// 图片的旋转
// 列表切歌

//模块化开发  每个模块对外暴露接口 封装与暴露
