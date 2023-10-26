let headerScrollTrigger = null;
let pcImageScrollTriggers = [];
let pcObserver = null;
let tabletSectionScrollTriggers = [];
let translateYValues = {};
let isInViewport = [];
let lastScrollY = window.scrollY;


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
      imageAnimation();
      stopElementScroll();
      imagePosition();
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
    killAllScrollTriggers();
    $("body").attr("class", "pc");
    $(".main .pc").css('visibility', 'visible');
    $(".main .tablet, .main .mobile").css('visibility', 'hidden');
    
    setTimeout(function() {
      $(window).scrollTop(0);
      hideHeader();
      imageAnimation();
      imagePosition();
      stopElementScroll();
    }, 200);
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
function updatePosition() {
  const sections = document.querySelectorAll('.main .pc .section');
  const title = sections[sections.length-1].querySelector('.title');
  const imgElements = document.querySelectorAll('.main .pc .img');
  const line = document.querySelector('.main .pc .line');
  const sectionWrapperHeight = $('.main .pc .section_wrapper').height();

  imgElements.forEach(img => {
    const rect = img.getBoundingClientRect();
    let calculatedTop = lastScrollY + rect.top;

    calculatedTop = Math.min(calculatedTop, sectionWrapperHeight - rect.height);

    img.style.position = 'absolute';
    img.style.top = `${calculatedTop}px`;
  });
      
  const titleHeight = title.offsetHeight;
  const titleTop = title.getBoundingClientRect().top + lastScrollY;
  const lineHeight = line.offsetHeight;

  line.style.position = 'absolute';
  line.style.top = `${titleTop + (titleHeight - lineHeight) / 1.6}px`;
}

function handleIntersect(entries) {

	const imgElements = document.querySelectorAll('.main .pc .img');
	const line = document.querySelector('.main .pc .line');

  entries.forEach(entry => {
    
    if (entry.isIntersecting) {
      lastScrollY = window.scrollY;
      requestAnimationFrame(updatePosition);
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
  const vhInPixels = window.innerWidth / 100;
  const fiftyVHInPixels = vhInPixels * 1;

  const debouncedScrollHandler = debounce(handleIntersect, 60);

  // if($(window).width() > 2050) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `${fiftyVHInPixels}px 0px ${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1950) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1850) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1750) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1650) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1550) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1450) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels}px 0px -${fiftyVHInPixels}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1350) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels1}px 0px -${fiftyVHInPixels1}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1250) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels2}px 0px -${fiftyVHInPixels2}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1150) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels3}px 0px -${fiftyVHInPixels3}px 0px`, 
  //     threshold: 0
  //   });
  // } else if($(window).width() > 1025) {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels5}px 0px -${fiftyVHInPixels5}px 0px`, 
  //     threshold: 0
  //   });
  // } else {
  //   pcObserver = new IntersectionObserver(debouncedScrollHandler, {
  //     root: null,
  //     rootMargin: `-${fiftyVHInPixels4}px 0px -${fiftyVHInPixels4}px 0px`, 
  //     threshold: 0
  //   });
  // }
  pcObserver = new IntersectionObserver(debouncedScrollHandler, {
    root: null,
    rootMargin: `0px 0px 0px 0px`, 
    threshold: 0
  });

  pcObserver.observe(document.querySelector('.main .pc .about'));

}
function stopElementScroll() {
  const targetElements = document.querySelectorAll('.main .pc .section');

  for (let i = 0; i < targetElements.length; i++) {
      isInViewport[i] = false;
  }


  const debouncedScrollHandler = debounce(() => {
    targetElements.forEach((targetElement, index) => {
      const rect = targetElement.getBoundingClientRect();
      
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        isInViewport[index] = true;
        // console.log("Entering viewport:", targetElement);
        
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
      } else if ((rect.top < 0 || rect.bottom > window.innerHeight)) {
        isInViewport[index] = false;
        // console.log('Exiting viewport:', targetElement);
      }
    });
  }, 90);

  window.addEventListener('scroll', debouncedScrollHandler);
}

function imageAnimation() {
  document.querySelectorAll('.main .pc .img1 .image:nth-child(2)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
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
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
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

  // 揶쏉옙 占쎈�占쏙쭪占쏙옙占� 占쏙옙占쏙옙 占쎌쥓�뀐쭖遺우뵠占쎌꼷�� 占쎌빘苑�옙�몃빍占쏙옙.
  document.querySelectorAll('.main .pc .img1 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/170)*100}`,
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
  document.querySelectorAll('.main .pc .img2 .image:nth-child(3)').forEach((img, index, array) => {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function() {
        // 筌뤴뫀諭� 占쎈�占쏙쭪占� 域밸챶竊숋옙占� 占쏙옙占쏙옙 獄쏆꼶�э옙�몃빍占쏙옙.
        const animation = gsap.to(img, {
          ease: "none",
          scrollTrigger: {
            trigger: img.previousElementSibling,
            start: 'top top',
            end: `+=${($(window).width()/148)*100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // 占쏙옙占싸삳쭆 筌욊쑵六양몴醫롮뱽 占싼딆뒠占쎌꼷肉� y揶쏅��� 占썬끉��
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
            end: `+=${($(window).width()/252)*100}`,
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