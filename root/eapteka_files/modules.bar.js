$(document).ready(() => {

	if (!Cookies.get('bar_show')) {
		$('.js-bar').html(templateLodashRender({}, 'bar')).removeClass('is-hidden')
		$('.js-header-main-sticky').hcSticky('update', {
			top: 0
		})
		$('.js-header-nav-sticky').hcSticky('update', {
			top: $('.js-header-main-sticky').outerHeight(),
		})
	}

	$(document).on('click', '.js-bar-button', () => {
		Cookies.set('bar_show', true, {
			path: '/',
			expires: 1
		})
	})

	$(document).on('click', '.js-bar-close', () => {
		$('.js-bar').addClass('is-hidden')
		Cookies.set('bar_show', true, {
			path: '/',
			expires: 1
		})
		$('.js-header-main-sticky').hcSticky('update', {
			top: 0
		})
		$('.js-header-nav-sticky').hcSticky('update', {
			top: $('.js-header-main-sticky').outerHeight(),
		})
	})

})
;
