const swiper = new Swiper('.swiper', {
    pagination: {
        el: '.swiper-pagination',
    },

});

swiper.on('slideChange', function () {
    if (swiper.activeIndex === 0){
        $('body').removeClass('dark');
    } else {
        $('body').addClass('dark');
    }
});


$(document).ready(function() {
    $('.folder-cases').on('click', function (){
        $('.window-cases').addClass('active');
    })
    $('.folder-awards').on('click', function (){
        $('.window-awards').addClass('active');
    })
    $('.folder-team').on('click', function (){
        $('.window-team').addClass('active');
    })
});

$(document).ready(function() {
    $('.contact-open').on('click', function (){
        $('.window-contact').addClass('active');
        return false;
    })
});

$(document).ready(function() {
    $('.window-header-back').on('click', function (){
        $('.window').removeClass('active');
    })
});



function redirect(){
    var winW = $(window).width();
    if ( winW > 1024){
        window.location.replace("/");
    }
    // if ( winW <= 1024){
    //     location="/mobile"
    // }
} redirect();

$(window).on('resize', function (){
    redirect();
})
