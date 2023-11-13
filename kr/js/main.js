
let resizeTimeout = null;

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

$(window).on("load resize", function (e) {
  hideHeader();


  if ($(this).width() >= 743) {
    pcBoxPositionUp();
  }
});