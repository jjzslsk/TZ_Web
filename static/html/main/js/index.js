//index 页面初始化数据,事件监听
$(function(){

    var mySwiper = new Swiper('.swiper-container1', {
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

    var mySwiper = new Swiper('.swiper-container2', {
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



});
