$(document).ready(() => {

	let showPopupCart = false

	$(document).on('click', '[data-add-cart-counter-btn]', () => {
		if (Site.template != 'cart') {
			showPopupCart = true
			msg.show(templateLodashRender({}, 'cart-popup-preloader'))
		}
	})

	EventBus.subscribe('add_items:insales:cart:light', (data) => {
		if (showPopupCart) {
			$('.js-cart-popup-container').html(templateLodashRender(data, 'cart-popup-content'))
			$('.js-cart-popup-container').animate({
				'min-height': $('.cart-popup__placeholder').height()
			}, 200, () => {
				$('.js-cart-popup').addClass('is-init')
			})
		}
		showPopupCart = false
	})

})
;
