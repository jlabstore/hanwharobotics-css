let headerScrollTrigger = null;
let pcImageScrollTriggers = [];
let pcObserver = null;
let tabletSectionScrollTriggers = [];
let translateYValues = {};
let lastScrollY = window.scrollY;
let isAnimating = false;

// pc, table, mobile 占싼됵옙
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
      imagePosition();
      imageAnimation();
    }, 500);

  }

  $("header").css('visibility', 'visible');
});


$(window).on("resize", function (e) {
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
      if(tabletSectionScrollTriggers.length > 0) {
        tabletSectionScrollTriggers.forEach(st => st.refresh());
      } else {

        tabletAnimation();
      }
    }, 200);

  } else {
    // killAllScrollTriggers();
    $('html').addClass('scroll-lock');
    $("body").attr("class", "pc");
    $(".main .pc").css('visibility', 'visible');
    $(".main .tablet, .main .mobile").css('visibility', 'hidden');
    
    setTimeout(function() {
      $('.main .pc .img').css('transform', '');
      $('.main .pc .img .image').css('transform', '');

      $(window).scrollTop(0);
      $('html').removeClass('scroll-lock');
      hideHeader();
      imagePosition(); 
      imageAnimation();
    }, 330);
  }

  $("header").css('visibility', 'visible');
});


function killAllScrollTriggers() {
  // ScrollTrigger.getAll().forEach(st => st.kill());
  if(pcImageScrollTriggers.length > 0) {
    pcImageScrollTriggers.forEach(st => st.kill());
    pcImageScrollTriggers = [];
  }
  // headerScrollTrigger && headerScrollTrigger.kill();
  if(tabletSectionScrollTriggers.length > 0) {
    tabletSectionScrollTriggers.forEach(st => st.kill());
    tabletSectionScrollTriggers = [];
  }
  gsap.globalTimeline.clear();

  if(pcObserver) {
    pcObserver.unobserve(document.querySelector('.main .pc .about'));
    pcObserver = null;
  }

  const imgElements = document.querySelectorAll('.main .pc .img');
  imgElements.forEach(img => {
    img.style.top = ``;
    img.style.left = ``;
  });
  const title = document.querySelector('.main .pc #section3 .title');
  title.style.left = ``;
}

function hideHeader() {
  let lastScrollPos = 0;

  const $header = $("#header");

  // ScrollTrigger 占쎌빘苑�
  headerScrollTrigger = ScrollTrigger.create({
    trigger: "#header", // 占쎈챶�곩쳞占� 占쎈뗄��
    start: "top top", // 占썬끋寃뺞에占� 占쎌뮇�� 筌욑옙占쏙옙
    end: "+=100%", // 100% 占쎄쑬�믤틦��옙
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

function imagePosition() {
  const vhInPixels = window.innerWidth / 100;
  const fiftyVHInPixels = vhInPixels * 17;
  const targetElements = document.querySelectorAll('.main .pc .section');
  const $fixed = $('.main .pc .fixed');
  const $fixedLine = $fixed.find('.line');
  const imgElements = document.querySelectorAll('.main .pc .img');
  const pixels = [vhInPixels * 6.4, vhInPixels * -6, vhInPixels * 28];
  const fixedTop = $fixed.offset().top;
  const fixedHeight = $fixed.outerHeight();
  const maxTranslate = fixedTop + fixedHeight - fiftyVHInPixels;

  $(window).on('scroll', debounce(function() {
    requestAnimationFrame(() => {
      const scrollTop = $(this).scrollTop();
      
      const translateY = Math.min(scrollTop, maxTranslate);
      let yFixed = 0;

      if (scrollTop <= maxTranslate) {
        yFixed = translateY;

        $fixedLine.css({
          'position': 'fixed',
          'top': `17vw`
        });
        
        imgElements.forEach((img, index) => {
          img.style.position = 'fixed';
          img.style.top = '';
          // img.style.transform = `translateY(${translateY + pixels[index]}px)`;
          // img.style.top = `${translateY + pixels[index]}px`;
        });
      } else {
        yFixed = maxTranslate;
        
        $fixedLine.css({
          'position': 'absolute',
          'top': `${yFixed}px`
        });

        imgElements.forEach((img, index) => {
          img.style.position = 'absolute';
          // img.style.transform = `translateY(${translateY + pixels[index]}px)`;
          img.style.top = `${yFixed + pixels[index]}px`;
        });
      }

      // $fixedLine.css('transform', `translateY(${yFixed}px)`);
      
      // 애니메이션이 진행 중이라면 반환
      if(isAnimating) return;
      
      const rect = targetElements[1].getBoundingClientRect();
      
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        // console.log("Entering viewport:", targetElement);
        
        isAnimating = true;
        
        targetElements[1].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        setTimeout(() => {
          isAnimating = false;
        }, 200);
          
      }

      // targetElements.forEach((targetElement, index) => {
      //   if(index === 0 || index === 2) return;

      //   const rect = targetElement.getBoundingClientRect();
        
      //   if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      //     // console.log("Entering viewport:", targetElement);
          
      //     isAnimating = true;
          
      //     setTimeout(() => {
      //       targetElement.scrollIntoView({
      //         behavior: 'smooth',
      //         block: 'start'
      //       });

      //       isAnimating = false;
      //     }, 200);
            
      //   }
      // });
    });

  }, 10));
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
            end: `+=${($(window).width()/250)*100}`,
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
            end: `+=${($(window).width()/154)*100}`,
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
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/258)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // 占쏙옙占싸삳쭆 筌욊쑵六양몴醫롮뱽 占싼딆뒠占쎌꼷肉� y揶쏅��� 占썬끉��
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
            // �ㅽ겕濡ㅼ쓣 �꾨옒濡� �� �� �ㅻ뜑 �④린湲�
            $header.css('opacity', 0);
          } else {
            // �ㅽ겕濡ㅼ쓣 �꾨줈 �� �� �ㅻ뜑 蹂댁씠湲�
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