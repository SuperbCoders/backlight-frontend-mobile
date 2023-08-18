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
    const appHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()

    $('.folder-cases').on('click', function (){
        $('.window-cases').addClass('active');
    })
    $('.folder-awards').on('click', function (){
        $('.window-awards').addClass('active');
    })
    $('.folder-team').on('click', function (){
        $('.window-team').addClass('active');
        $('.team-card-photo img').each(function(element) {
            if(!$(this).attr('src')) $(this).attr('src', $(this).data('src'));
        })
    })
    $('.folder-vacancies').on('click', function (){
        $('.window-vacancies').addClass('active');
    })
});

$(document).ready(function() {
    $('.contact-open').on('click', function (){
        $('.window-contact').addClass('active');
        return false;
    })
    $('.window-header-back').on('click', function (){
        $('.window').removeClass('active');
    })
});

$('body').on('click', '#vacancies .folder-content-list-item[data-type=text]', function() {
    $(this).toggleClass('open');
    $(this).next('.folder-content-list-item__description').slideToggle();
})



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
