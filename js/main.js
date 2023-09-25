// section1
// Create a function to handle varying numbers of .circle elements
function createCircleTimeline() {
  let tl = null;
  let addTimeLine = gsap.timeline();
  
  // Assuming you have a way to get the count of .circle elements
  const circleCount = document.querySelectorAll('.animate-me').length-1;
  const result = (10 / circleCount).toFixed(1);

  for (let i = 0; i <= circleCount; i++) {
    let params = {};
    let scaleResult = 0;
    let opacityResult = 0;
    scaleResult = (10-result) - scaleResult;
    opacityResult = (10+result) + opacityResult;

    if(i >= circleCount) {
      params = {
        radius: 0,
        color: '#fff'
      }
    } else {
      params = {
        radius: '50%',
        color: '#000'
      }
    }

    tl = gsap.timeline().to(".circle", {
      scale: 20,
      borderRadius: params.radius,
      opacity: 0.3,
      ease: "power1.inOut"
    });

    addTimeLine.add(tl);
  }

  return addTimeLine;
}

function section1() {

  const tl1 = createCircleTimeline();
  ScrollTrigger.create({
    animation: tl1,
    trigger: ".section_1", 
    start: "top top",
    // end: () => "bottom bottom",
    scrub: .1,
    pin: ".section_1 .title",
    immediateRender: false,
    invalidateOnRefresh: false,
    onUpdate: function(self) {
      const progress = self.progress.toFixed(1);
      $('.animate-me').css('visibility', 'hidden');

      for( let i = 0; i <= $('.animate-me').length; i++ ) {
        const result = `0.${i}`;

        if(i > 1) {
          $('.section_1 .title').addClass('opacity');
        } else {
          $('.section_1 .title').removeClass('opacity');
        }

        if(i === $('.animate-me').length-1) {
          $('.section_1 .title').removeClass('opacity').addClass('active');
          $('.circle').addClass('active');
        } else {
          $('.section_1 .title').removeClass('active');
          $('.circle').removeClass('active');
        }

        if(progress <= result) {
          $('.animate-me').eq(i).css('visibility', 'visible');
          break;
        }
      }
    }
  });


  ScrollTrigger.create({
    trigger: ".section_1", 
    start: "top top",
    // end: () => "bottom bottom",
    scrub: .25,
    pin: ".section_1 .images",
  });
}

window.addEventListener("resize", function(){
  ScrollTrigger.refresh(true);
});


$(document).ready(async function() {
  $('.section_1').css('height', ((36.5 * $('.section_1 .animate-me').length-1))+'vh');

  section1();
});
  
