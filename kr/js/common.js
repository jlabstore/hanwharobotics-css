const win = $(this); //this = window

// pc, table, mobile 여부
$(window).on("load resize", function (e) {

  let top = 0;
  let headerHeight = '332px';
  
  if (win.width() <= 1023) {
    top = 70;
  } else if (win.width() > 1023 && win.width() <= 1190) {
    top = 167;
  } else {
    top = 207;
  }

  if(win.width() <= 1550) {
    headerHeight = '450px';
  }

  $(document).on('mouseover', '#header .header_inner', function() {
    $(this).closest('#header').css({'height': headerHeight});
    $(this).find('.header__nav__items_sub').addClass('active');
    $(this).closest('#header').addClass('active');
  })
  .on('mouseleave', '#header', function() {
    $(this).find('.header__nav__items_sub').removeClass('active');
    $(this).closest('#header').removeClass('active');
    $(this).closest('#header').css({'height': 'auto'});
  });

  if (win.width() <= 1024) {
    $(document).off('mouseover mouseleave');
    $('header').removeClass('active');
    $('header .gnb_layer').removeClass('active');
    $('header .gnb_menu').removeClass('active');


    $(document).on('click', '#header .header_inner .gnb_menu', function(e) {
      e.stopPropagation();

      $(this).find('.header__nav__items_sub').addClass('active');
      $(this).closest('#header').css({'height': headerHeight}).addClass('active');
      // $(this).closest('.header__nav__items_sub').addClass('active');
    })
  }

  if (win.width() <= 1024) {
    $("body").attr("class", "mobile");
  } else if (win.width() <= 1550) {
    $("body").attr("class", "tablet");
  } else {
    $("body").attr("class", "pc");
  }
  $("header").css('visibility', 'visible');

  setTimeout(function() {
    // more_btn 요소를 선택합니다.
    const moreBtn = $('#aside .more_btn');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;    
    // Convert the current top style to an integer and add the scroll position
    // const currentTop = parseInt(moreBtn.css('top'), 10);
    moreBtn.css('top', top + scrollPosition + 'px');
  }, 300);
});

$(document).ready(async function() {

  $('#header').load('../includes/header.html');
  $('#aside').load('../includes/aside.html');
  $('#footer').load('../includes/footer.html', function() {
    changeUrl();
  });

  $('.layer_wrap').load('../includes/layer.html', function() {
    $('.layer.inquiry').load('../includes/layer_inquiry.html');
  });

  $(document).on('click', 'header .btn_menu button', function() {
    const gnb = $('.gnb_menu, .gnb_layer');

    $('header .gnb_layer').addClass('active');
    $(this).addClass('active');
    gnb.addClass('active');
    $('html').addClass('scroll-lock');
  });

  $(document).on('click', 'header .gnb_layer, header .gnb_menu .btn_close', function(e) {
    e.stopPropagation();

    $('#header .header__nav__items_sub').removeClass('active');
    $(this).closest('#header').removeClass('active');
    $(this).removeClass('active');
    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');
    $('#header').css({'height': 'auto'});
    $('html').removeClass('scroll-lock');
  });

  $(document).on('click', '#header button.inquiry, #aside button.inquiry', function(e) {
    e.stopPropagation();
    
    // $('body').addClass('scroll-lock');
    $('.layer.inquiry').show();
    $('.layer_bg').show();
    $(this).removeClass('active');
    $('html').removeClass('scroll-lock'); 

    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');

    $('.header__nav__items_sub').removeClass('active');
    $('#header').removeClass('active');
    $('#header').css({'height': 'auto'});
  });

  $(document).on('click', '.layer_bg, .layer .btn_close', function() {
    $('body').removeClass('scroll-lock');
    $('.layer.inquiry').hide();
    $('.layer_bg').hide();
  });

});
  
// 스크롤 이벤트 리스너를 추가합니다.
window.addEventListener('scroll', throttle(function() {
  requestAnimationFrame(() => {
    let top = 0;

    if (win.width() <= 1024) {
      top = 70;
    } else if (win.width() > 1024 && win.width() <= 1190) {
      top = 167;
    } else {
      top = 207;
    }

    // more_btn 요소를 선택합니다.
    const moreBtn = $('#aside .more_btn');
    
    // 브라우저 창 상단으로부터의 현재 스크롤 위치를 얻습니다.
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
    // Convert the current top style to an integer and add the scroll position
    // const currentTop = parseInt(moreBtn.css('top'), 10);
    moreBtn.css('top', top + scrollPosition + 'px');
  });
},3));