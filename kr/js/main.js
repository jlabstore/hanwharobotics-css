let headerScrollTrigger = null;
let pcImageScrollTriggers = [];
let pcObserver = null;
let tabletSectionScrollTriggers = [];
let translateYValues = {};
let lastScrollY = window.scrollY;
let isAnimating = false;
let scrollEventHandler = null;

// pc, table, mobile
$(window).on("load", function (e) {
  const win = $(this); //this = window
    
  if (win.width() <= 743) {
    $('html').removeClass('scroll-lock');
    $("body").attr("class", "mobile");
    $(".main .mobile").css('visibility', 'visible');
    $(".main .pc, .main .tablet").css('visibility', 'hidden');
    hideHeader();
  } else if (win.width() < 1026) {
    $('html').removeClass('scroll-lock');
    $("body").attr("class", "tablet");
    $(".main .tablet").css('visibility', 'visible');
    $(".main .pc, .main .mobile").css('visibility', 'hidden');

    setTimeout(function() {
      $(window).scrollTop(0);
      tabletAnimation();
    }, 200);
  } else {
    $("body").attr("class", "pc");

    $(".main .tablet, .main .mobile").css('visibility', 'hidden');

    setTimeout(function() {
      $(window).scrollTop(0);
      $('html').removeClass('scroll-lock');
      $(".main .pc").css('visibility', 'visible');
      hideHeader();
      initializeImagePositioning();
      imageAnimation();
    }, 500);

  }

  $("header").css('visibility', 'visible');
});


$(window).on("resize", function (e) {
  throttle(function() {
    const win = $(this); //this = window

    if (win.width() <= 743) {
      killAllScrollTriggers();
      $("body").attr("class", "mobile");
      $(".main .mobile").css('visibility', 'visible');
      $(".main .pc, .main .tablet").css('visibility', 'hidden');
      hideHeader();

    } else if (win.width() < 1026) {
      killAllScrollTriggers();
      $("body").attr("class", "tablet");
      $(".main .tablet").css('visibility', 'visible');
      $(".main .pc, .main .mobile").css('visibility', 'hidden');

      setTimeout(function() {
        $(window).scrollTop(0);
        tabletAnimation();
      }, 500);

    } else {
      killAllScrollTriggers();
      $('html').addClass('scroll-lock');
      $("body").attr("class", "pc");
      $(".main .pc").css('visibility', 'visible');
      $(".main .tablet, .main .mobile").css('visibility', 'hidden');
      $('.main .pc .img').css('transform', '');
      $('.main .pc .img .image').css('transform', '');
      
      setTimeout(function() {
        $(window).scrollTop(0);
        hideHeader();
        initializeImagePositioning(); 
        imageAnimation();
        $('html').removeClass('scroll-lock');
      }, 600);
    }

    $("header").css('visibility', 'visible');
  }, 200)();
});


function killAllScrollTriggers() {

  // ScrollTrigger.getAll().forEach(st => st.kill());
  if(pcImageScrollTriggers.length > 0) {
    pcImageScrollTriggers.forEach(st => st.scrollTrigger.kill());
    pcImageScrollTriggers = [];
  }
  // headerScrollTrigger && headerScrollTrigger.kill();
  if(tabletSectionScrollTriggers.length > 0) {
    tabletSectionScrollTriggers.forEach(st => st.scrollTrigger.kill());
    tabletSectionScrollTriggers = [];
  }
  gsap.globalTimeline.clear();

  const imgElements = document.querySelectorAll('.main .pc .img');
  imgElements.forEach(img => {
    img.style.top = ``;
    img.style.left = ``;
  });
  const title = document.querySelector('.main .pc #section3 .title');
  title.style.left = ``;

  // const $fixedLine = $('.main .pc .fixed .line');
  // $fixedLine.css({
  //   'position': 'fixed',
  //   'top': `17vw`,
  //   'transform': 'translateY(0)'
  // });
  
  imgElements.forEach((img, index) => {
    img.style.position = 'fixed';
    img.style.top = '';
  });
}

function hideHeader() {
  let lastScrollPos = 0;

  const $header = $("#header");

  // ScrollTrigger
  headerScrollTrigger = ScrollTrigger.create({
    trigger: "#header",
    start: "top top",
    end: "+=100%",
    onRefreshInit: function(self) {
      lastScrollPos = self.scroll();
    },
    onUpdate: function(self) {
      const currentScrollPos = self.scroll();
      
      if (currentScrollPos > lastScrollPos) {
        $header.css('opacity', 0);
      } else {
        $header.css('opacity', 1);
      }
      lastScrollPos = currentScrollPos;
    }
  });
}

function initializeImagePositioning() {
  // If we've attached the event before, remove it
  if (scrollEventHandler) {
    $(window).off('scroll', scrollEventHandler);
  }

  if ($('body').hasClass('pc')) {

    // const targetElements = document.querySelectorAll('.main .pc .section');
    const $fixed = $('.main .pc .fixed');
    // const $fixedLine = $('.main .pc .fixed .line');
    const imgElements = document.querySelectorAll('.main .pc .img');
    const vhInPixels = window.innerWidth / 100;
    const fiftyVHInPixels = vhInPixels * 17;
    const pixels = [vhInPixels * 6.2, vhInPixels * -6.8, vhInPixels * 26.8];
    const fixedTop = $fixed.offset().top;
    const fixedHeight = $fixed.outerHeight();
    const maxTranslate = fixedTop + fixedHeight - fiftyVHInPixels;
    let yFixed = 0;
  
    // Attach the event (re-calculating any necessary variables)
    scrollEventHandler = throttle(function() {
      requestAnimationFrame(() => {
        const scrollTop = $(this).scrollTop();
        const translateY = Math.min(scrollTop, maxTranslate);
  
        if (scrollTop < maxTranslate) {
          
          yFixed = translateY;
  
          // $fixedLine.css({
          //   'position': 'fixed',
          //   'top': `17vw`,
          //   'transform': 'translateY(0)'
          // });
          
          imgElements.forEach((img, index) => {
            img.style.position = 'fixed';
            img.style.top = '';
          });
        } else {
  
          yFixed = maxTranslate;
        
          // $fixedLine.css({
          //   'position': 'absolute',
          //   'top': `${yFixed}px`
          // });
  
          imgElements.forEach((img, index) => {
            img.style.position = 'absolute';
            img.style.top = `${yFixed + pixels[index]}px`;
          });
        }
  
        
        // 애니메이션이 진행 중이라면 반환
        // if(isAnimating) return;
        
        // const rect = targetElements[1].getBoundingClientRect();
        
        // if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          
        //   isAnimating = true;
          
        //   targetElements[1].scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'start'
        //   });
  
        //   setTimeout(() => {
        //     isAnimating = false;
        //   }, 200);
            
        // }
      });
    }, 6);
    
    $(window).on('scroll', scrollEventHandler);
  }
}

function imageAnimation() {
  document.querySelectorAll('.main .pc .img1 .image:nth-child(2)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/370)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 100;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });
  document.querySelectorAll('.main .pc .img2 .image:nth-child(2)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/248)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 100;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });
  document.querySelectorAll('.main .pc .img3 .image:nth-child(2)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/1600)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 100;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });

  document.querySelectorAll('.main .pc .img1 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/170)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 200;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });
  document.querySelectorAll('.main .pc .img2 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/148)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 580;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });
  document.querySelectorAll('.main .pc .img3 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/250)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              translateYValues[index] = (1 - self.progress) * 200;
              gsap.set(img, { y: `${translateYValues[index]}%` });
            }
          }
        });

        pcImageScrollTriggers.push(animation);
      }
    });
  });
}

function tabletAnimation() {
  if(tabletSectionScrollTriggers.length > 0) {
    tabletSectionScrollTriggers.forEach(st => st.scrollTrigger.kill());
    tabletSectionScrollTriggers = [];
  }

  let lastScrollPos = 0;
  const $header = $("#header");
  
  document.querySelectorAll('.main .tablet .section').forEach((section, index, array) => {
    const animation = gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onRefreshInit: function(self) {
          lastScrollPos = self.scroll();
        },
        onUpdate: function(self) {
          const currentScrollPos = self.scroll();
          
          if (currentScrollPos > lastScrollPos) {
            $header.css('opacity', 0);
          } else {
            $header.css('opacity', 1);
          }
          lastScrollPos = currentScrollPos;
        }
      }
    });
    tabletSectionScrollTriggers.push(animation);
  });
}

$(document).ready(function() {
});