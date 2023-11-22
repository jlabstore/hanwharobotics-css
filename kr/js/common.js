// pc, table, mobile 여부
$(window).on("load resize", function (e) {
  const win = $(this); //this = window

  $(document).on('mouseover', '#header .header_inner', function() {
    $(this).closest('#header').css({'height': '332px'});
    $(this).find('.header__nav__items_sub').addClass('active');
    $(this).closest('#header').addClass('active');
  })
  .on('mouseleave', '#header', function() {
    $(this).find('.header__nav__items_sub').removeClass('active');
    $(this).closest('#header').removeClass('active');
    $(this).closest('#header').css({'height': 'auto'});
  });


  if (win.width() <= 1325) {
    $(document).off('mouseover mouseleave');
    $('header').removeClass('active');
    $('header .gnb_layer').removeClass('active');
    $('header .gnb_menu').removeClass('active');
  }

  if (win.width() <= 1024) {
    $("body").attr("class", "mobile");
  } else if (win.width() < 1500) {
    $("body").attr("class", "tablet");
  } else {
    $("body").attr("class", "pc");
  }
  $("header").css('visibility', 'visible');
});


$(document).ready(async function() {
  $('#header').load('../includes/header.html');
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

    $(this).removeClass('active');
    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');
    $('html').removeClass('scroll-lock');
  });

  $(document).on('click', 'header button.inquiry', function() {
    $('body').addClass('scroll-lock');
    $('.layer.inquiry').show();
    $('.layer_bg').show();

    $(this).removeClass('active');
    $('header .btn_menu button').removeClass('active');
    $('.gnb_menu, .gnb_layer').removeClass('active');
    $('html').removeClass('scroll-lock'); 
  });

  $(document).on('click', '.layer_bg, .layer .btn_close', function() {
    $('body').removeClass('scroll-lock');
    $('.layer.inquiry').hide();
    $('.layer_bg').hide();
  });


});
  