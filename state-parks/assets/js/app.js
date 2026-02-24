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


  const scrollTop = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", function(){
    if(window.pageYOffset > 200){
      scrollTop.style.display="block";
    }else{
      scrollTop.style.display="none";
    }
  });

  scrollTop.addEventListener("click", function(){
    window.scrollTo({
      top:0, 
      behavior:"smooth"
    })

  });

  const header = document.querySelector("header.primary");
  const toggleBtn = document.querySelector(".nav-toggle");

  toggleBtn.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

}); 
 


