$(document).ready(() => {

	if (!Cookies.get('cookies_accept')) {
		$('body').append(templateLodashRender({}, 'cookies'))
		setTimeout(() => {
			$('.js-cookies').removeClass('is-hidden')
		}, 2000)
	}

	$(document).on('click', '.js-cookies-accept', (e) => {
		e.preventDefault()
		$('.js-cookies').addClass('is-hidden')
		Cookies.set('cookies_accept', true, {
			path: '/',
			expires: 1
		})
	})

})
;
