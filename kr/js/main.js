let headerScrollTrigger = null;
let pcImageScrollTriggers = [];
let pcObserver = null;
let tabletSectionScrollTriggers = [];
// translateY 값을 전역 변수로 저장
let translateYValues = {};
let isInViewport = [];

// pc, table, mobile 여부
$(window).on("load", function (e) {
  const win = $(this); //this = window
    
  hideHeader();
  if (win.width() <= 743) {
    // window.removeEventListener('scroll');
    $('html').removeClass('scroll-lock');
    $("body").attr("class", "mobile");
    $(".main .mobile").css('visibility', 'visible');
    $(".main .pc, .main .tablet").css('visibility', 'hidden');
  } else if (win.width() < 1026) {
    // window.removeEventListener('scroll');
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
    $(".main .pc").css('visibility', 'visible');
    $(".main .tablet, .main .mobile").css('visibility', 'hidden');

    setTimeout(function() {
      $(window).scrollTop(0);
      $('html').removeClass('scroll-lock');
      imageAnimation();
      imagePosition();
      stopElementScroll();
    }, 200);
  }
});


$(window).on("resize", function (e) {
  const win = $(this); //this = window
  
  hideHeader();
    
  if (win.width() <= 743) {
    setTimeout(function() {
      killAllScrollTriggers();
    }, 10);
    $("body").attr("class", "mobile");
    $(".main .mobile").css('visibility', 'visible');
    $(".main .pc, .main .tablet").css('visibility', 'hidden');
    hideHeader();
  } else if (win.width() < 1026) {
    setTimeout(function() {
      killAllScrollTriggers();
    }, 10);
    $("body").attr("class", "tablet");
    $(".main .tablet").css('visibility', 'visible');
    $(".main .pc, .main .mobile").css('visibility', 'hidden');

    setTimeout(function() {
      $(window).scrollTop(0);
      // tabletAnimation();
    }, 100);
  } else {
    setTimeout(function() {
      killAllScrollTriggers();
    }, 10);
    $("body").attr("class", "pc");
    $(".main .pc").css('visibility', 'visible');
    $(".main .tablet, .main .mobile").css('visibility', 'hidden');
    
    setTimeout(function() {
      $(window).scrollTop(0);
      imageAnimation();
      imagePosition();
      stopElementScroll();
    }, 100);
  }
});

// 나중에 모든 ScrollTrigger 인스턴스를 파괴할 함수를 생성합니다.
function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach(st => st.kill());
  pcImageScrollTriggers.forEach(st => st.kill());
  // tabletSectionScrollTriggers.forEach(st => st.kill());
  gsap.globalTimeline.clear();

  pcObserver = null;
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

  // 헤더 요소 선택
  const $header = $("#header");

  // ScrollTrigger 생성
  headerScrollTrigger = ScrollTrigger.create({
    trigger: "#header", // 트리거 요소
    start: "top top", // 스크롤 시작 지점
    end: "+=100%", // 100% 아래까지
    onRefreshInit: function(self) {
      lastScrollPos = self.scroll();
    },
    onUpdate: function(self) {
      const currentScrollPos = self.scroll();

      if (currentScrollPos > lastScrollPos) {
        // 스크롤을 내릴 때 헤더 숨기기
        $header.css('opacity', 0);
      } else {
        // 스크롤을 올릴 때 헤더 보이기
        $header.css('opacity', 1);
      }
      lastScrollPos = currentScrollPos;
    }
  });
}

function handleIntersect(entries) {
  const sections = document.querySelectorAll('.main .pc .section');
  const title = sections[sections.length-1].querySelector('.title');
  const imgElements = document.querySelectorAll('.main .pc .img');
  const line = document.querySelector('.main .pc .line');

  entries.forEach(entry => {
    
    if (entry.isIntersecting) {
      imgElements.forEach(img => {
        const rect = img.getBoundingClientRect();
        // 이미지의 위치를 직접 설정합니다.
        img.style.position = 'absolute';
        img.style.top = `${window.scrollY + rect.top}px`;
        // img.style.left = `${rect.left}px`;
      });
      

      const titleHeight = title.offsetHeight;
      const titleTop = title.getBoundingClientRect().top + window.scrollY;
      const lineHeight = line.offsetHeight;

      line.style.position = 'absolute';
      line.style.top = `${titleTop + (titleHeight - lineHeight) / 1.6}px`;
    } else {
      imgElements.forEach(img => {
        img.style.position = 'fixed';
        img.style.top = ``;
      });

      line.style.position = 'fixed';
      line.style.top = ``;
      line.style.left = ``;
    }
  });
}

function imagePosition() {
  const vhInPixels = window.innerWidth / 100; // 1vh의 픽셀 값
  const fiftyVHInPixels = vhInPixels * 0.1; // 50vh의 픽셀 값

  pcObserver = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: `0px 0px 0px 0px`, // 하단 마진을 -50px로 설정합니다.
    threshold: 0
  });

  pcObserver.observe(document.querySelector('.about'));

}

function imageAnimation() {
  // 각 이미지에 대해 애니메이션을 생성합니다.
  document.querySelectorAll('.main .pc .img1 .image:nth-child(2)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 모든 이미지 그룹에 대해 반복합니다.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/364)*100}`,
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
        // 모든 이미지 그룹에 대해 반복합니다.
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
        // 모든 이미지 그룹에 대해 반복합니다.
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

  // 각 이미지에 대해 애니메이션을 생성합니다.
  document.querySelectorAll('.main .pc .img1 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 모든 이미지 그룹에 대해 반복합니다.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/170)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // 저장된 진행률을 사용하여 y값을 설정
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
        // 모든 이미지 그룹에 대해 반복합니다.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/148)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // 저장된 진행률을 사용하여 y값을 설정
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
        // 모든 이미지 그룹에 대해 반복합니다.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/240)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // 저장된 진행률을 사용하여 y값을 설정
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

function stopElementScroll() {
  const targetElements = document.querySelectorAll('.main .pc .section');

  // 초기 상태를 모두 false로 설정
  for (let i = 0; i < targetElements.length; i++) {
      isInViewport[i] = false;
  }

  const debouncedScrollHandler = debounce(() => {
    targetElements.forEach((targetElement, index) => {
      const rect = targetElement.getBoundingClientRect();
      
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        isInViewport[index] = true;
        console.log("Entering viewport:", targetElement);
        
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
      } else if ((rect.top < 0 || rect.bottom > window.innerHeight)) {
        isInViewport[index] = false;
        console.log('Exiting viewport:', targetElement);
      }
    });
  }, 90); // 150ms 지연시간 설정

  window.addEventListener('scroll', debouncedScrollHandler);
}

function tabletAnimation() {
  document.querySelectorAll('.main .tablet .section').forEach((section, index, array) => {
    const animation = gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true
      }
    });
    tabletSectionScrollTriggers.push(animation);
  });
}

$(document).ready(function() {
});

