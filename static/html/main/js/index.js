//index 页面初始化数据,事件监听
$(function(){

    var mySwiper = new Swiper('.swiper-container1', {
        navigation: {
            nextEl: '.swiper-button-next1',  //左右按钮
            prevEl: '.swiper-button-prev1',
        },
        direction: 'vertical',
        simulateTouch: false,//禁止鼠标模拟  手机可以滑动
        allowTouchMove: false,//手机也不能滑动
        slidesPerView: 3,     //一页显示多少swiper_slide
        slidesPerGroup: 1,      //一次滚动几个swiper_slide

        autoplay: {
            disableOnInteraction: false,
            delay: 7000
        },
        loop : true,

        observer: true,//修改swiper自己或子元素时，自动初始化swiper

        observeParents: true,//修改swiper的父元素时，自动初始化swiper
    });

    var mySwiper2 = new Swiper('.swiper-container2', {
        navigation: {
            nextEl: '.swiper-button-next2',  //左右按钮
            prevEl: '.swiper-button-prev2',
        },
        direction: 'vertical',
        simulateTouch: false,//禁止鼠标模拟  手机可以滑动
        allowTouchMove: false,//手机也不能滑动
        slidesPerView: 5,     //一页显示多少swiper_slide
        slidesPerGroup: 1,      //一次滚动几个swiper_slide

        autoplay: {
            disableOnInteraction: false,
            delay: 5000
        },
        loop : true,

        observer: true,//修改swiper自己或子元素时，自动初始化swiper

        observeParents: true,//修改swiper的父元素时，自动初始化swiper
    });

// 鼠标移入停止自动滚动
    $('.noticeBox1').mouseenter(function() {
        mySwiper.autoplay.stop();
    })
    // 鼠标移出开始自动滚动
    $('.noticeBox1').mouseleave(function() {
        mySwiper.autoplay.start();
    })

    // 鼠标移入停止自动滚动
    $('.noticeBox2').mouseenter(function() {
        mySwiper2.autoplay.stop();
    })
    // 鼠标移出开始自动滚动
    $('.noticeBox2').mouseleave(function() {
        mySwiper2.autoplay.start();
    })



});
