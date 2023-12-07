// Function to change image with smooth transition
const changeImage = (newSrc) => {
  const imageElement = document.getElementById("circle-image");
  imageElement.src = newSrc;
      
};

function changeUrl() {
  const siteSelector = document.getElementById('siteSelector');

  siteSelector.addEventListener('change', function(event) {
    const url = event.target.options[event.target.selectedIndex].value;
    if (url) {
      // a 태그를 생성합니다.
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer'; // 보안 목적으로 rel 속성에 noopener와 noreferrer 값을 추가합니다.

      // a 태그를 DOM에 추가하고 클릭 이벤트를 발생시킵니다.
      document.body.appendChild(anchor);
      anchor.click();

      // a 태그를 DOM에서 제거합니다.
      document.body.removeChild(anchor);
    }
  });
}

function vwToPercent(vw) {
  // Convert vw to pixels
  const px = window.innerWidth * (vw / 100);
  // Convert pixels to percentage relative to the body's width
  const percent = (px / document.body.offsetWidth) * 100;
  return percent;
}

function vhToPercent(vh) {
  // Convert vh to pixels
  const px = window.innerHeight * (vh / 100);
  // Convert pixels to percentage relative to the body's height
  const percent = (px / document.body.offsetHeight) * 100;
  return percent;
}

function vwvhAverage(vwPercent, vhPercent) {
  // vwPercent와 vhPercent의 평균을 계산
  const averagePercent = (vwPercent + vhPercent) / 0.2;
  return averagePercent;
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 쓰로틀링 함수
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

