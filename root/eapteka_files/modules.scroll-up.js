$(document).ready(() => {

  document.addEventListener('scroll', () => {
    window.scrollY < 450 ? $('.js-scroll-up').removeClass('is-active') : $('.js-scroll-up').addClass('is-active')
  })

  $('.js-scroll-up').on('click', () => {
    $('html, body').animate({
      scrollTop: 0
    }, 400)
  })

})
;
