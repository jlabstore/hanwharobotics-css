
let resizeTimeout = null;
let lastScrollPos = 0;
const $header = $("#header");

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

function pcBoxPositionUp() {
  const $missionBox = $('.section2 .second_box');
  
  $missionBox.css('top', '140px')
  .on('mouseenter', function() {
    $missionBox.stop().animate({'top': '0'});
  });

  $missionBox
  .on('mouseleave', function() {
    $missionBox.stop().animate({'top': '140px'});
  });
}

$(window).on("resize", function (e) {
  hideHeader();

  if ($(this).width() >= 743) {
    pcBoxPositionUp();
  }
});

$(window).on("load", function (e) {
  hideHeader();

  if ($(this).width() >= 743) {
    pcBoxPositionUp();
  }

  document.querySelectorAll('.main .section1 .contents').forEach((section, index, array) => {
    // Pin the section
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: true, // Use scrub to smoothly animate the changes over the scroll duration
      }
    });
  
    // Animate the .title and .txt within each section
    gsap.fromTo(section.querySelectorAll('.title, .txt'), {
      y: 50, // start 50 pixels below their final position
      opacity: 0 // start fully transparent
    }, {
      y: 0, // end at their final position
      opacity: 1, // fade in to fully opaque
      duration: 1, // duration of the fade in effect
      scrollTrigger: {
        trigger: section,
        start: "top center+=100", // start the fade in a little after the top of the section hits the center
        end: "bottom center", // end the fade in when the bottom of the section hits the center
        scrub: true // animate smoothly in conjunction with the scroll
      },
      stagger: 0.1 // stagger the start of the animations for each title and txt
    });
  });

  
});
