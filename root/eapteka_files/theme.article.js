$(document).ready(() => {

	$(document).on('blur', '.js-review-content-input', () => {
		$('#review-content').val($('#review-content-comment').val().trim() + '*****' + $('#review-content-plus').val().trim() + '*****' + $('#review-content-minus').val().trim())
		if ($('#review-content').val() == '**********') {
			$('#review-content').val('')
		}
	})

	$(document).on('submit', '.js-comments-form', function (e) {
		e.preventDefault()
		let form = $(this)
		let formAction = $(this).attr('action')
		let formAlert = form.data('alert') || false
		let formReCaptcha = form.find('[name="g-recaptcha-response"]') || false
		let formYaCaptcha = form.find('[name="smart-token"]') || false
		let formSend = true
		let formModerated = $(this).data('moderated')
		form.find('.js-feedback-alert').remove()
		if (formReCaptcha.length && formReCaptcha.val() == '') {
			form.prepend('<div class="form__item js-feedback-alert">' + templateLodashRender({}, 'alert-captcha') + '</div>')
			formSend = false
		}
		if (formYaCaptcha.length && formYaCaptcha.val() == '') {
			form.prepend('<div class="form__item js-feedback-alert">' + templateLodashRender({}, 'alert-captcha') + '</div>')
			formSend = false
		}
		if (formSend) {
			let formData = new FormData(form[0])
			let formImage = form.find('[name="review[image_attributes][image]"]') || false
			if (formImage.length && formImage.val() != '') {
				formData.append("image_attributes][image", form.find('[name="review[image_attributes][image]"]')[0].files[0])
			}
			$.ajax({
				url: formAction,
				data: formData,
				type: 'post',
				contentType: false,
				cache: false,
				processData: false,
				dataType: 'json'
			}).fail((e) => {
				$.fancybox.close()
				msg.show(templateLodashRender({}, 'popup-error'))
			}).done((e) => {
				$.fancybox.close()
				if (e.status == 'ok' || e.comment) {
					msg.show(templateLodashRender({
						text: formAlert
					}, 'popup-success'))
					if (!formModerated) {
						setTimeout(() => {
							window.location.assign(window.location.origin + window.location.pathname + window.location.search + '#comments')
							window.location.reload()
						}, 1000)
					}
				} else {
					msg.show(templateLodashRender({}, 'popup-error'))
				}
			})
		}
	})

	$(document).on('click', '.js-product-comments', (e) => {
		e.preventDefault()
		$('[data-tabs-item="reviews"]').trigger('click')
		let scrollMargin = $('.js-header-main-sticky').outerHeight() + 20
		if ($('[data-tabs-content="reviews"]').length > 0) {
			$('[data-tabs-item="reviews"]').trigger('click')
			scrollToElement($('[data-tabs-content="reviews"]'), scrollMargin)
		} else {
			scrollToElement($('.reviews').closest('.section'), scrollMargin)
		}
	})

	if (location.hash == '#review_form' || location.hash == '#comment_form' || location.hash == '#comments') {
		let scrollMargin = $('.js-header-main-sticky').outerHeight() + 20
		if ($('[data-tabs-content="reviews"]').length > 0) {
			$('[data-tabs-item="reviews"]').trigger('click')
			scrollToElement($('[data-tabs-content="reviews"]'), scrollMargin)
		} else {
			scrollToElement($('.reviews').closest('.section'), scrollMargin)
		}
	}

	$(document).on('click', '.js-reviews-show-all', (e) => {
		e.preventDefault()
		$('.reviews-item.is-hidden').removeClass('is-hidden')
		$('.reviews-item__show-all').remove()
	})

})
;
$(document).ready(() => {

  $(document).on('click', '.js-share-copy', () => {
    let copyText = $('.js-share-url')
    navigator.clipboard.writeText(copyText.val().trim()).then(() => {
      $('.js-share-copy').hide()
      $('.js-share-success').show()
    }, () => {
      //что-то пошло не так
    })
  })

})
;
$(document).ready(() => {
  const fbxSettings = {
    loop: true,
    infobar: false,
    touch: true,
    transitionEffect: 'slide',
    baseClass: 'fancybox-is-gallery',
    clickSlide: false,
    buttons: [
      'close'
    ]
  }

  $('[data-fancybox="shop"]').fancybox(fbxSettings)

  const $shopInfoMapToggle = $('[data-shop-info-map-toggle]')

  $shopInfoMapToggle.on('click', function () {
    const $this = $(this)
    const mapId = $this.data('shop-info-map-toggle')
    $(`#${mapId}`).toggleClass('is-visible')
    $this.toggleClass('is-image')
  })

  $('[data-shop-gallery-toggle]').on('click', function (e) {
    e.preventDefault()
    const text = $(this).data('shop-gallery-toggle').split('|')
    const target = $('[data-shop-gallery]')
    target.toggleClass('is-hidden')
    if (target.hasClass('is-hidden')) {
      $(this).text(text[0])
    } else {
      $(this).text(text[1])
    }
  })
})
;



