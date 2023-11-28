const win = $(this); //this = window
let headerMinHeight = '90px';

// pc, table, mobile 여부
$(window).on("load resize", function (e) {
  $('#header .header__nav__items_sub').removeClass('active');
  $(this).closest('#header').removeClass('active');
  $(this).removeClass('active');
  $('header .btn_menu button').removeClass('active');
  $('.gnb_menu, .gnb_layer').removeClass('active');
  $('html').removeClass('scroll-lock');

  let top = 0;
  
  if (win.width() <= 950) {
    top = 100;
  } else if (win.width() > 950 && win.width() <= 1190) {
    top = 167;
  } else {
    top = 207;
  }

  let headerHeight = '332px';
  if(win.width() <= 1024) {
    headerMinHeight = '70px';
  }

  // if(win.width() <= 1550) {
  //   headerHeight = '450px';
  // }


  if (win.width() <= 1024) {
    $(document).off('mouseover mouseleave');
    $('header').removeClass('active');
    $('header .gnb_layer').removeClass('active');
    $('header .gnb_menu').removeClass('active');


    $(document).on('click', '#header .header_inner .gnb_menu', function(e) {
      e.stopPropagation();

      if(e.target.tagName !== 'A') {
        $(this).closest('#header').stop().animate({'height': headerHeight}, 'fast', () => {
          $(this).find('.header__nav__items_sub').addClass('active');
          $(this).closest('#header').addClass('active');
        });
        // $(this).closest('.header__nav__items_sub').addClass('active');
      }
    });
  } else {

    $(document).on('mouseover', '#header .gnb_menu', function() {

      $(this).closest('#header').addClass('active');
      $(this).closest('#header').stop().animate({'height': headerHeight}, 100, () => {
        $(this).find('.header__nav__items_sub').addClass('active');
      });
    })
    .on('mouseleave', '#header', function() {
      $(this).closest('#header').stop().animate({'height': headerMinHeight}, 100, () => {
        $(this).find('.header__nav__items_sub').removeClass('active');
        $(this).closest('#header').removeClass('active');
      });
    });
  
  }

  $('#header').css('height', headerMinHeight);

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

  let headerHeight = '332px';

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

    if(win.width() > 950) {
      $(this).closest('#header').stop().animate({'height': headerMinHeight}, 'fast');
    }
    $('#header .header__nav__items_sub').removeClass('active');
    $(this).closest('#header').removeClass('active');
    $(this).removeClass('active');
    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');
    $('html').removeClass('scroll-lock');
  });

  $(document).on('click', 'header .gnb_menu .header__nav__items .header__nav__items_sub a', function(e) {
    e.stopPropagation();

    if(win.width() > 950) {
      $(this).closest('#header').stop().animate({'height': headerMinHeight}, 'fast');
    }
    $('#header .header__nav__items_sub').removeClass('active');
    $(this).closest('#header').removeClass('active');
    $(this).removeClass('active');
    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');
    $('html').removeClass('scroll-lock');
  });

  $(document).on('click', '#header button.inquiry, #aside button.inquiry', function(e) {
    e.stopPropagation();

    // $('body').addClass('scroll-lock');
    $('.layer.inquiry').show('fast');
    $('.layer_bg').show();
    $(this).removeClass('active');
    $('html').removeClass('scroll-lock'); 

    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');

    $('.header__nav__items_sub').removeClass('active');
    $(this).closest('#header').stop().animate({'height': headerMinHeight}, 'fast');
    $('#header').removeClass('active');
  });

  $(document).on('click', '.layer_bg, .layer .btn_close', function() {
    $('body').removeClass('scroll-lock');
    $('.layer.inquiry').hide('fast');
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