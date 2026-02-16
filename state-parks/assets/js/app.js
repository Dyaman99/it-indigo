$(document).ready(function() {
  $('.hero-slides').slick({
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 8000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    pauseOnHover: false,
    useAutoplayToggleButton: false  // removes the pause/play button

  });
});
