let lastScrollY = window.scrollY;
let imgObservers = [];
let resizeTimeout = null;

function pcBoxPositionUp() {
  // const $aboutSection2Row = $('.about .section_2 .row');
  const $missionBox = $('.about .section_2 .mission');

  $missionBox
  .on('mouseover', function() {
    $missionBox.stop().animate({'top': '0'});
  });

  $missionBox
  .on('mouseleave', function() {
    $missionBox.stop().animate({'top': '100px'});
  });
}

function padBoxPositionUp() {
  const element = document.querySelector('.about .section_2 .mission');

  if(element) {

    // Intersection Observer 옵션 설정
    const options = {
      root: null, // 뷰포트를 기준으로 합니다
      rootMargin: '400px 0px -100px 0px', // 50px 상단에서 감시를 시작합니다
      threshold: 0 // 대상 요소가 뷰포트에 진입할 때 콜백 함수를 호출합니다
    };
    
    // Intersection Observer 콜백 함수
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            element.style.top = '0';
        } else {
            element.style.top = '4vw';
        }
      });
    };

    // Intersection Observer 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, options);
    
    // 감시할 요소를 Observer에 연결
    observer.observe(element);
  }
} 

function imgShowHide(ele, height) {
  const element = document.querySelectorAll(ele);
  const vhInPixels = window.innerHeight / 100; // 1vh의 픽셀 값
  const fiftyVHInPixels = vhInPixels * 48; // 50vh의 픽셀 값
  const rootHeightResult = $('body').hasClass('pc') ? 3 : 2.7;
  const rootHeight = height/rootHeightResult;
  
  for(let i = 0; i < element.length; i++) {
    // Intersection Observer 옵션 설정
    const options = {
      root: null, // 뷰포트를 기준으로 합니다
      rootMargin: `-${fiftyVHInPixels+rootHeight}px 0px -${fiftyVHInPixels-rootHeight}px 0px`, // 50px 상단에서 감시를 시작합니다
      threshold: [0, 0.25, 0.5, 0.75, 1] // 대상 요소가 뷰포트에 진입할 때 콜백 함수를 호출합니다
    };
    
    // Intersection Observer 콜백 함수
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        let currentScrollY = window.scrollY;
        let className = 'hideTop';
        const $img = $('.imageScroll .img');

        if (currentScrollY > lastScrollY) {
          className = 'hideTop';
        } else if (currentScrollY < lastScrollY) {
          className = 'hideBottom';
        }

        if (entry.isIntersecting) {
          if(i%2 === 0) {
            $img.eq(i)
            .closest('.imageScroll_inner').css({
              'transform': 'translate(-1%)',
            })
            .end()
            .removeClass('hideTop hideBottom');
          } else {
            $img.eq(i)
            .closest('.imageScroll_inner').css({
              'transform': 'translate(-12%)',
            })
            .end()
            .removeClass('hideTop hideBottom');
          }

        } else {
          const eleLength = i <=  $img.length ? i+1 : $img.length;
          
          if((eleLength%2) === 0) {
            $img.eq(i)
            .closest('.imageScroll_inner').css({
              'transform': 'translate(-1%)',
            })
            .end()
            .removeClass('hideTop hideBottom').addClass(className);
          } else {
            if(i > 0) {
              $img.eq(i)
              .removeClass('hideTop hideBottom').addClass(className);
            } else {
              $img.eq(i)
              .removeClass('hideTop hideBottom').addClass(className);
            }
          }
        }          

        lastScrollY = currentScrollY; // Update the value for the next callback invocation

      });
    };

    // Intersection Observer 인스턴스 생성
    let observer = new IntersectionObserver(observerCallback, options);
    
    // 감시할 요소를 Observer에 연결
    observer.observe(element[i]);

    imgObservers.push(observer);
  }
}

function stopObservingAll(ele) {
  const element = document.querySelectorAll(ele);
  const $img = $('.imageScroll .img');
  
  for (let i = 0; i < element.length; i++) {
    if(imgObservers[i]) {
      imgObservers[i].unobserve(element[i]);
      imgObservers[i].disconnect();
    }
  }

  // Clear the array after disconnecting all observers
  imgObservers = [];

  $img
  .closest('.imageScroll_inner').css({
    'transform': 'translate(0)',
  })
  .end()
  .removeClass('hideTop hideBottom');
}

// pc, table, mobile 여부
$(window).on("load resize", function (e) {

  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(function() {
    const win = $(this); //this = window
    
    AOS.init({
      disable: function() {
        var maxWidth = 1024;
        return window.innerWidth > maxWidth;
      }
    });
    
    if (win.width() <= 1024) {
      stopObservingAll('.section_2 .list');
    } else if (win.width() <= 1500) {
      padBoxPositionUp();
      imgShowHide('.about .section_2 .list', win.height());
    } else {
      pcBoxPositionUp();
      imgShowHide('.about .section_2 .list', win.height());
    }
  }, 200); // 250ms delay
});

