function declOfNum(number, titles) {
	number = parseInt(number, 10)
	titles = (titles) ? titles : Messages.products
	cases = [2, 0, 1, 1, 1, 2]
	if (titles.length == 2) {
		return titles[(number === 1) ? 0 : 1]
	} else {
		return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
	}
}

let getUrlParameter = function r(t) { let e, i, n = window.location.search.substring(1).split('&'); for (i = 0; i < n.length; i++)if ((e = n[i].split('='))[0] === t) return void 0 === e[1] || decodeURIComponent(e[1]); return !1 }

function templateLodashRender(content, templateId) {
	let templateContent = $('[data-template-id="' + templateId + '"]').html()
	let renderContent = _.template(templateContent)
	return renderContent(content)
}

$.fancybox.defaults.idleTime = false
$.fancybox.defaults.hash = false
$.fancybox.defaults.backFocus = false
$.fancybox.defaults.animationDuration = 400
$.fancybox.defaults.animationEffect = 'fade'
$.fancybox.defaults.btnTpl.arrowLeft = `<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">${Icons.arrow_left}</button>`
$.fancybox.defaults.btnTpl.arrowRight = `<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">${Icons.arrow_right}</button>`
$.fancybox.defaults.btnTpl.close = `<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">${Icons.times}</button>`

let globalFunctions = {}

let reCaptchaLoaded = false
let reCaptchaKey = $('[name="shop-config"]').data('config').recaptcha_key_v3
function loadReCaptcha(obj) {
	let script = document.createElement('script')
	script.src = 'https://www.google.com/recaptcha/api.js?hl=' + (Site['locale'] || 'ru')
	script.async = true
	script.onload = () => {
		grecaptcha.ready(() => {
			grecaptcha.render(obj, {
				'sitekey': reCaptchaKey
			})
			reCaptchaExecute(obj)
			reCaptchaLoaded = true
		})
	}
	document.body.appendChild(script)
}

function reCaptchaExecute(obj) {
	let reCaptchaItem = $(obj).find('.g-recaptcha-response').get(0)
	const matches = reCaptchaItem.id.match(/\d+$/)
	reCaptchaIndex = matches ? parseInt(matches[0]) : 0
	window.grecaptcha.execute(reCaptchaIndex)
}

let yaCaptchaKey = $('[name="shop-config"]').data('config').yandex_captcha_key
function loadYaCaptcha(obj) {
	const form = $(obj).closest('form')
	window.yandexCaptchaCommon.renderCaptchaWidget({
		container: obj,
		renderParams: {
			sitekey: yaCaptchaKey,
			hl: Site.locale,
			invisible: true,
			shieldPosition: 'bottom-right',
			callback: (response) => {
				form.append(`<input type="hidden" name="review[yandex-smart-token]" value="${response}">`)
				form.append(`<input type="hidden" name="comment[yandex-smart-token]" value="${response}">`)
				form.append(`<input type="hidden" name="yandex-smart-token" value="${response}">`)
			}
		}
	})
	window.yandexCaptchaCommon.executeCaptchaInvisible(form.get(0), () => { })
}

let yaShareLoaded = false
function loadYaShare(obj) {
	let script = document.createElement('script')
	script.src = 'https://yastatic.net/share2/share.js'
	script.async = true
	script.onload = () => {
		Ya.share2(obj)
		yaShareLoaded = true
	}
	document.body.appendChild(script)
}

let userContacts = {
	fill: (profile) => {
		if ($('.js-profile-name').val() == '') {
			$('.js-profile-name').val(profile.client.name)
		}
		if ($('.js-profile-email').val() == '') {
			$('.js-profile-email').val(profile.client.email)
		}
		if ($('.js-profile-phone').val() == '') {
			$('.js-profile-phone').val(profile.client.phone)
		}
	}
}

let popupFeedback = {
	addition: (target) => {
		let cart = Cart.order.get()
		if (cart.order_lines.length > 0) {
			let cartItems = ''
			_.forEach(cart.order_lines, (value) => {
				cartItems += '<br><a href="' + (window.location.origin + value.product_url) + '">' + value.title + '</a><br>' + value.quantity + ' × ' + Shop.money.format(value.sale_price)
			})
			$(target).find('.js-feedback-fields-cart').val(cartItems)
		}
		$(target).find('.js-feedback-fields-url').val(window.location.href)
	}
}

let setMask = {
	phone: (target) => {
		if (Settings.module_phonemask != 'disabled') {
			let maskPhone = Site.mask[Settings.module_phonemask] || Site.mask[Site.locale] || Site.mask['ru']
			$(target).inputmask('mask', {
				inputmode: 'tel',
				mask: maskPhone['placeholder'],
				placeholder: '_',
				showMaskOnHover: false,
				clearIncomplete: true,
				onBeforePaste: (value, opts) => {
					let processedValue = value.replace(maskPhone['regex'], maskPhone['code'])
					return processedValue
				},
				onBeforeMask: (value, opts) => {
					let processedValue = value.replace(maskPhone['regex'], maskPhone['code'])
					return processedValue
				}
			})
		}
	}
}

let msg = {
	show: (content) => {
		$.fancybox.open({
			src: content,
			type: 'inline',
			touch: false,
			smallBtn: true,
			buttons: [],
			afterShow: (instance, current) => {
				//капча google
				let reCaptchaPlaceholder = '.js-popup-form .js-recaptcha-placeholder'
				if ($(current.src).find(reCaptchaPlaceholder).length > 0) {
					if (reCaptchaLoaded) {
						grecaptcha.render($(reCaptchaPlaceholder).get(0), {
							'sitekey': reCaptchaKey
						})
						reCaptchaExecute(reCaptchaPlaceholder)
					} else {
						loadReCaptcha($(reCaptchaPlaceholder).get(0))
					}
				}
				//капча yandex
				let yaCaptchaPlaceholder = '.js-popup-form .js-yacaptcha-placeholder'
				if ($(current.src).find(yaCaptchaPlaceholder).length > 0) {
					loadYaCaptcha($(yaCaptchaPlaceholder).get(0))
				}
				//автоматически заполняем контактыне данные
				if (Cookies.get('profile')) {
					let profile = JSON.parse(Cookies.get('profile'))
					userContacts.fill(profile)
				}
				//блок "Поделиться"
				let sharePlaceholder = '.js-popup-form .js-share-placeholder'
				if ($(current.src).find(sharePlaceholder).length > 0) {
					if (yaShareLoaded) {
						Ya.share2($(sharePlaceholder).get(0))
					} else {
						loadYaShare($(sharePlaceholder).get(0))
					}
				}
				//маска ввода для телефона
				let telInput = '[type="tel"]'
				if ($(current.src).find(telInput).length > 0) {
					setMask.phone(telInput)
				}
				//автоматически заполняем дополнительные поля (состав корзины, ссылка на страницу)
				popupFeedback.addition('.js-popup-form')
			}
		})
	}
}

$('.js-inline-form').each(function () {
	let current = $(this)
	//капча google
	let reCaptchaPlaceholder = '.js-recaptcha-placeholder'
	if (current.find(reCaptchaPlaceholder).length > 0) {
		if (reCaptchaLoaded) {
			grecaptcha.render(current.find(reCaptchaPlaceholder).get(0), {
				'sitekey': reCaptchaKey
			})
			reCaptchaExecute(reCaptchaPlaceholder)
		} else {
			loadReCaptcha(current.find(reCaptchaPlaceholder).get(0))
		}
	}
	//капча yandex
	let yaCaptchaPlaceholder = '.js-yacaptcha-placeholder'
	if (current.find(yaCaptchaPlaceholder).length > 0) {
		window.EventBus.subscribe('yandex-captcha:insales:loaded', () => {
			loadYaCaptcha(current.find(yaCaptchaPlaceholder).get(0))
		})
	}
	//автоматически заполняем контактыне данные
	if (Cookies.get('profile')) {
		let profile = JSON.parse(Cookies.get('profile'))
		userContacts.fill(profile)
	}
	//маска ввода для телефона
	let telInput = '[type="tel"]'
	if (current.find(telInput).length > 0) {
		setMask.phone(telInput)
	}
	//автоматически заполняем дополнительные поля (состав корзины, ссылка на страницу)
	setTimeout(() => {
		popupFeedback.addition('.js-inline-form')
	}, 5000)
})

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		$('.js-inline-form').each(function () {
			let current = $(this)

			let yaCaptchaPlaceholder = '.js-yacaptcha-placeholder'
			if (current.find(yaCaptchaPlaceholder).length > 0) {
				loadYaCaptcha(current.find(yaCaptchaPlaceholder).get(0))
			}
		})
	}, 3000)
})

let lazyLoad = new LazyLoad({
	elements_selector: '.lazy',
	load_delay: 0
})

function scrollToElement(obj, margin = 0) {
	$('html, body').animate({
		scrollTop: obj.offset().top - parseInt(margin)
	}, 400)
}

Products.setConfig({
	decimal: {
		kgm: 1,
		mtr: 1
	}
})

function qrGenerate(target, url) {
	if (target.length > 0) {
		new QRCode(target.get(0), {
			text: url,
			width: 200,
			height: 200,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.M // L|M|Q|H
		})
	}
}

function messengersLink(parent) {
	let msngrButton = $('[data-product-messengers-href]', parent)
	msngrButton.each((index, item) => {
		let msngrButton = $(item)
		let msngrProductHref = msngrButton.data('product-messengers-href')
		let msngrProductTitle = msngrButton.data('product-messengers-title')
		let msngrVariantTitle = ''
		let msngrOptionTitle = ''
		let msngrAccessoryTitle = ''
		if (parent.find('[name="variant_id"]').length > 0) {
			let title = parent.find('[name="variant_id"] option:selected').text()
			if (title != '') {
				msngrOptionTitle = ` (${title})`
			}
		}
		if (parent.find('.product-accessories').length > 0) {
			let input = parent.find('.product-accessories').find('input:checked')
			let title = ''
			input.each((index, item) => {
				title += $(item).closest('[data-product-accessory-values-item]').find('[data-product-accessory-values-item-name]').text()
				if (index != (input.length - 1)) {
					title += ' / '
				}
			})
			if (title != '') {
				msngrAccessoryTitle = ` (${title})`
			}
		}
		msngrVariantTitle = `${msngrProductTitle}${msngrOptionTitle}${msngrAccessoryTitle}`
		msngrButton.attr('href', encodeURI(_.replace(msngrProductHref, msngrProductTitle, msngrVariantTitle)))
	})
}

function preorderAccessory(parent) {
	if (parent.find('.product-accessories').length > 0) {
		let input = parent.find('.product-accessories').find('input:checked')
		let title = ''
		input.each((index, item) => {
			title += $(item).closest('[data-product-accessory-values-item]').find('[data-product-accessory-values-item-name]').text()
			if (index != (input.length - 1)) {
				title += ' / '
			}
		})
		parent.find('[data-preorder-accessory]').attr('data-preorder-accessory', title)
	}
}

jQuery.event.special.touchstart = { setup: function (e, t, s) { this.addEventListener("touchstart", s, { passive: !t.includes("noPreventDefault") }) } }, jQuery.event.special.touchmove = { setup: function (e, t, s) { this.addEventListener("touchmove", s, { passive: !t.includes("noPreventDefault") }) } }, jQuery.event.special.wheel = { setup: function (e, t, s) { this.addEventListener("wheel", s, { passive: !0 }) } }, jQuery.event.special.mousewheel = { setup: function (e, t, s) { this.addEventListener("mousewheel", s, { passive: !0 }) } }
;
//получаем максимальную ширину экрана
$('body').css('--document-max-width', $(window).width() + 'px')
$(window).on('load', () => {
	$('body').css('--document-max-width', $(window).width() + 'px')
	setTimeout(() => {
		$('body').css('--document-max-width', $(window).width() + 'px')
	}, 400)
})
$(window).on('resize', () => {
	$('body').css('--document-max-width', $(window).width() + 'px')
})

// utm yandex
if (getUrlParameter('utm_source') == 'yandex') {
	Cookies.set('utm_source_yandex', true, {
		path: '/',
		expires: 7
	})
}

if (Cookies.get('utm_source_yandex')) {
	$('.js-utm-shops-block').show();
	$('body').addClass('yautm-show');
}

$(() => {
	//после загрузки ставим класс, чтобы css анимации подключились
	$('body').addClass('is-loaded')

	//модальные окна
	$(document).on('click', '.js-msg-show', function (e) {
		e.preventDefault()
		let template = $(this).data('template')
		if (template.indexOf('popup-share-') != -1 && navigator.share && window.matchMedia('(max-width: 768px)').matches) {
			navigator.share({
				title: $('meta[property="og:title"]').attr('content') || $('title').text().trim(),
				text: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
				url: $(this).attr('data-share-url')
			})
		} else {
			if (template == 'popup-preorder' || template == 'popup-question' || template == 'popup-video-consultant') {
				msg.show(templateLodashRender({
					product: $(this).attr('data-preorder-product-name'),
					variant: $(this).attr('data-preorder-variant'),
					accessory: $(this).attr('data-preorder-accessory'),
					url: $(this).attr('data-preorder-product-url')
				}, template))
			} else if (template == 'popup-messenger-share') {
				msg.show(templateLodashRender({
					share: $(this).data('messenger-share'),
					product: $(this).attr('data-preorder-product-name') || '',
					variant: $(this).attr('data-preorder-variant') || '',
					accessory: $(this).attr('data-preorder-accessory') || '',
					url: $(this).attr('data-preorder-product-url') || '',
					href: $(this).attr('href') || ''
				}, template))
			} else if (template.indexOf('popup-share-') != -1) {
				msg.show(templateLodashRender({
					url: $(this).attr('data-share-url')
				}, template))
				qrGenerate($('.share-qr__image'), $('.js-share-url').val())
			} else if (template == 'popup-shops')  {
				msg.show(templateLodashRender({}, template))
				initMapPopup()
				$('.popup_type_shops').find('[data-tabs-city-popup="1"]').trigger('click')
			} else {
				msg.show(templateLodashRender({}, template))
			}
		}
	})

	//копирование текста в буфер
	$(document).on('click', '[data-clipboard-trigger]', function () {
		const $this = $(this)
		const trigger = $this.data('clipboard-trigger')
		const target = $(`[data-clipboard-target="${trigger}"]`)
		const complete = $(`[data-clipboard-complete="${trigger}"]`)
		navigator.clipboard.writeText(target.text().trim()).then(() => {
			$this.hide()
			complete.show()
		}, () => {
			//что-то пошло не так
		})
	})

	//заказ в 1 клик (fix)
	$(document).on('click', '.m-modal', function (e) {
		if ($(e.target).hasClass('m-modal')) {
			$('.m-overlay').trigger('click')
		}
	})

	//заказ в 1 клик (captcha)
	if ($('#quick-checkout-recaptcha').length > 0) {
		$('#quick-checkout-recaptcha').closest('.co-input--captcha').append(templateLodashRender({}, 'popup-captcha'))
	} else {
		$('.m-modal--checkout').find('.co-input--captcha').removeClass('co-input--captcha')
	}

	//маска ввода для телефона в заказе в 1 клик
	let quickCheckoutPhoneInput = '.m-modal--checkout [type="tel"]'
	if ($(quickCheckoutPhoneInput).length > 0) {
		setMask.phone(quickCheckoutPhoneInput)
	}

	//qr для социальных сетей
	$(document).on('click', '[data-social-qr]', function (e) {
		if (window.matchMedia('(min-width: 768px)').matches) {
			e.preventDefault()
			msg.show(templateLodashRender($(this).data('social-qr'), 'social-qr'))
			qrGenerate($('.social-qr__image'), $(this).attr('href'))
		}
	})

	//смена валюты
	$('.js-currency-change').on('click', function (e) {
		e.preventDefault()
		$.ajax({
			method: 'POST',
			url: '/site_currencies/update_current',
			data: {
				site_currency_code: $(this).data('currency')
			},
			dataType: 'dataType',
			success: () => {
				window.location.reload()
			},
			error: () => {
				window.location.reload()
			}
		})
	})

	//свертывание меню в три точки
	$('.js-cut-list').cutList({
		moreBtnTitle: Icons.ellipsis,
		showMoreOnHover: true,
		risezeDelay: 100
	}).addClass('is-init')

	//скрытие больших текстов
	$(document).on('click', '.js-text-hidden-toggle', function (e) {
		e.preventDefault()
		let target = $(this).closest('.js-text-hidden')
		target.toggleClass('is-open')
		if (!target.hasClass('is-open')) {
			let scrollMargin = $('.js-header-main-sticky').outerHeight() + 20
			scrollToElement(target, scrollMargin)
		}
	})

	//раскрытие меню в подвале в мобильной версии
	$('[data-footer-menu-toggle]').on('click', function () {
		$(this).closest('.footer-item').toggleClass('is-open')
	})

	//наши магазины
	$(document).on('click', '[data-tabs-city]', function (e) {
		const index = $(this).data('tabs-city')
		const shopItems = cityFunctions[`shopItems${index}`]
		const shopMap = cityFunctions[`shopMap${index}`]
		if (!$(this).hasClass('is-init')) {
			setTimeout(() => {
				shopMap.container.fitToViewport()
				shopMap.setZoom(14)
				if (shopItems.length > 1) {
					shopMap.setBounds(shopMap.geoObjects.getBounds())
				}
				shopMap.margin.setDefaultMargin(100)
				shopMap.container.fitToViewport()
			}, 50)
			$(this).addClass('is-init')
		}
	})
	$(document).on('click', '[data-tabs-city-popup]', function (e) {
		const index = $(this).data('tabs-city-popup')
		const shopItemsPopup = cityFunctionsPopup[`shopItems${index}Popup`]
		const shopMapPopup = cityFunctionsPopup[`shopMap${index}Popup`]
		if (!$(this).hasClass('is-init')) {
			setTimeout(() => {
				shopMapPopup.container.fitToViewport()
				shopMapPopup.setZoom(14)
				if (shopItemsPopup.length > 1) {
					shopMapPopup.setBounds(shopMapPopup.geoObjects.getBounds())
				}
				shopMapPopup.margin.setDefaultMargin(100)
				shopMapPopup.container.fitToViewport()
			}, 50)
			$(this).addClass('is-init')
		}
	})

})

//загружаем скрипт яндекс капчи если он автоматически не загрузился
document.addEventListener('DOMContentLoaded', () => {
	if (window.Shop.config.config.captcha_type === 'yandex') {
		window.yandexCaptchaCommon.loadCaptchaScript(() => { })
	}
})
;
$(document).ready(() => {

	let $navType = $('[data-nav]').data('nav') || ''
	let $navTimer = false
	let $navTrigger = $('.js-nav-trigger')
	let $navTargetAction = $('[data-nav-action]').data('nav-action') || 'click'
	let $navTargetStop = false
	let $navTargetDelay = ($navTargetAction == 'click') ? 10 : 200

	$navTrigger.on($navTargetAction, function (e) {
		navMaxHeightSet()
		$navTargetStop = false
		if ($(this).hasClass('header-nav__inline') && $navTargetAction == 'click') {
			return false
		}
		if ($(this).hasClass('hamburger__trigger') && $(this).hasClass('is-open') && $navTargetAction == 'click') {
			navClose()
		} else {
			if (!$navTargetStop) {
				if ($navTimer != false) {
					clearTimeout($navTimer)
				}
				$navTimer = setTimeout(() => {
					$navTrigger.addClass('is-open is-visible')
					$navTimer = false
				}, $navTargetDelay)
			}
		}
	}).on('mouseleave', function (e) {
		if (($(this).hasClass('header-nav__inline') && $navTargetAction == 'click')) {
			return false
		}
		if (!$navTargetStop) {
			if ($navTargetAction != 'click') {
				if ($navTimer != false) {
					clearTimeout($navTimer)
				}
				$navTimer = setTimeout(() => {
					$navTrigger.removeClass('is-open')
					$navTimer = false
					$navTargetStop = false
				}, $navTargetDelay)
			}
		}
	})

	function navCutItems() {
		if ($navType == 'inline') {
			let prevItem = null
			let lastItem = null
			let width = $('[data-nav]').width()
			let hideAllNext = false
			let lastShow = false
			let moreWidth = $('[data-nav-item="0"]').width() + 20
			$('[data-nav]').addClass('is-overflow')
			$('[data-nav] > ul > li').each((index, item) => {
				let id = $(item).data('nav-item')
				$(item).removeClass('is-hidden')
				if (!hideAllNext) {
					if ($(item).position().left + $(item).width() + moreWidth > width) {
						hideAllNext = true
					}
				}
				if (hideAllNext) {
					$(item).addClass('is-hidden')
					$('[data-nav-item="0"] [data-nav-item="' + id + '"]').removeClass('is-hidden')
				} else {
					$('[data-nav-item="0"] [data-nav-item="' + id + '"]').addClass('is-hidden')
				}
				if (prevItem) {
					if ($('[data-nav] > ul > li').length == index + 1) {
						lastShow = false
						$(prevItem).removeClass('is-hidden')
						if ($(prevItem).position().left + $(prevItem).width() <= width) {
							lastShow = true
							lastItem = prevItem
						}
						$(prevItem).addClass('is-hidden')
					}
				}
				prevItem = item
			})
			if (hideAllNext) {
				$('[data-nav-item="0"]').removeClass('is-hidden')
			} else {
				$('[data-nav-item="0"]').addClass('is-hidden')
			}
			if (lastShow && $('[data-nav-item="0"] > [data-nav-submenu] > ul > li:not(.is-hidden)').length == 1 || $('[data-nav-item="0"] > [data-nav-submenu] > ul > li:not(.is-hidden)').length == 0) {
				$(lastItem).removeClass('is-hidden')
				$('[data-nav-item="0"]').addClass('is-hidden')
			}
			$('[data-nav]').removeClass('is-overflow')
		}
	}

	function navClose() {
		$navTargetStop = true
		if ($navTimer != false) {
			clearTimeout($navTimer)
		}
		$navTrigger.removeClass('is-open')
		$navTimer = false
		$('[data-nav] [data-nav-item]').removeClass('is-open')
	}

	if ($navTargetAction == 'click') {
		$('[data-nav] [data-nav-item]').on('mouseenter', function () {
			if ($navTargetAction == 'click' && $navType == 'inline') {
				$navTargetStop = false
			}
			if (!$navTargetStop) {
				if (!$(this).hasClass('is-open')) {
					$(this).closest('ul').find('[data-nav-item]').removeClass('is-open')
					if ($(this).children('[data-nav-submenu]').length > 0) {
						$(this).addClass('is-open')
					}
				}
			}
		})
	}

	$(document).on('click', (e) => {
		if ($navType == 'dropdown') {
			if ($navTargetAction == 'click' && !$(e.target).hasClass('js-nav-trigger') && $(e.target).closest('.js-nav-trigger').length == 0) {
				$('.js-nav-trigger.is-open:first').trigger('click')
			}
		}
		if ($navType == 'inline') {
			if ($navTargetAction == 'click' && !$(e.target).hasClass('js-nav-trigger') && $(e.target).closest('.js-nav-trigger').length == 0) {
				$('.js-nav-trigger.is-open:first').trigger('click')
			}
		}
	})

	function navMaxHeightSet() {
		let navMaxHeight = '80vh'
		if ($navType == 'inline') {
			navMaxHeight = $(window).height() - ($('.header-nav').offset().top - $(window).scrollTop() + $('.header-nav').height()) + 'px'
		}
		if ($navType == 'dropdown') {
			navMaxHeight = $(window).height() - ($('.header-nav').offset().top - $(window).scrollTop()) + 'px'
		}
		$('html').css({
			'--nav-max-height': navMaxHeight
		})
	}

	$(window).on('resize', () => {
		navCutItems()
	})
	navCutItems()

	$.each(Site.current_collections, (index, item) => {
		$('[data-nav] [data-nav-item="' + item.id + '"]').addClass('is-active')
	})

	$('.js-header-main-sticky').hcSticky({
		top: 0,
		stickTo: 'body',
		stickyClass: 'is-sticky',
		responsive: {
			1024: {
				disable: true
			}
		}
	})

	$('.js-header-nav-sticky').hcSticky({
		top: $('.js-header-main-sticky').outerHeight(),
		stickTo: 'body',
		stickyClass: 'is-sticky',
		responsive: {
			1024: {
				disable: true
			}
		}
	})

	$('[data-nav="inline"]').on('mouseenter', function (e) {
		$(this).addClass('is-visible')
		if ($navTargetAction == 'click') {
			$navTrigger.addClass('is-open is-visible')
		}
	})

	$('.js-header-toggled-element').each((index, item) => {
		let width = $(item).outerWidth()
		$(item).parent().css({
			'--max-width': width + 'px'
		})
	})

})

$(document).ready(() => {
  $('.js-search-reset').on('click', (e) => {
    e.preventDefault()
    $(e.target).closest('.js-search-form').find('input[name="q"]').val('').trigger('focus')
    if ($('body').hasClass('is-search-focus')) {
      $(e.target).closest('.js-search-form').find('input[name="q"]').focus('')
    }
    $('.autocomplete-suggestions').html('')
    $('.autocomplete-suggestions-total').remove()
    $('.autocomplete-no-suggestion').hide()
  })
})

$(document).ready(() => {

	const toolbarCartTitle = $('.js-toolbar-cart-title').html()

	EventBus.subscribe('update_items:insales:cart:light', (data) => {
		$('.js-toolbar-cart').html(templateLodashRender(data, 'toolbar-cart'))
		if (Site.current_url == '/new_order') {
			$('.checkout-coupon').remove()
			$('.co-basket_subtotal-list').prepend(templateLodashRender(data, 'checkout-coupon'))
			$('.checkout-coupon').show()
		}
		if (data.items_count > 0) {
			$('.js-toolbar-cart-header').html('(' + data.items_count + '): ' + Shop.money.format(data.total_price)).show()
			$('.js-toolbar-cart-title').html(Shop.money.format(data.total_price))
			if (Site.template == 'cart') {
				$.each(data.order_lines, (index, item) => {
					let itemParent = $('.js-cart-item[data-item-id="' + item.id + '"]')
					$('.js-cart-item-quantity', itemParent).html(item.quantity)
					$('.js-cart-item-sale-price', itemParent).html(Shop.money.format(item.sale_price))
					$('.js-cart-item-total-price', itemParent).html(Shop.money.format(item.total_price))
				})
				$('.js-cart-check-total-price').html(Shop.money.format(data.total_price))
				$('.js-cart-check-items-count').html(data.items_count + ' ' + declOfNum(data.items_count))
				if (data.discounts.length > 0) {
					$('.js-cart-check-discounts').show()
					$('.js-cart-check-discounts-amount').html('&minus;' + Shop.money.format(data.discounts[0].amount))
					$('.js-cart-check-discounts-description').html(data.discounts[0].description)
				} else {
					$('.js-cart-check-discounts').hide()
				}
				if (data.errors.length > 0) {
					$('.js-cart-check-coupon-error').html(data.errors[0]).show()
				} else {
					$('.js-cart-check-coupon-error').hide()
				}
				if (data.coupon) {
					$('.js-cart-check-coupon-input').val(data.coupon.value)
				} else {
					$('.js-cart-check-coupon-input').val('')
				}
				//бонусные баллы
				let bonuses = $('[data-ds-cart-bonuses]')
				if (bonuses.length > 0) {
					let bonusesSettings = bonuses.data('ds-cart-bonuses')
					let bonusesPercent = Number(bonusesSettings['bonus_percent']) / 100
					let bonusesTotal = Math.floor(data.total_price * bonusesPercent)
					bonuses.html('+' + bonusesTotal + ' ' + declOfNum(bonusesTotal, Messages.bonuses))
				}
			}
			if (Site.current_url == '/new_order') {
				$('.co-basket_item-list').html(templateLodashRender(data, 'checkout-cart'))
				window.debounced_deliveries()
			}
		} else {
			$('.js-toolbar-cart-header').hide()
			$('.js-toolbar-cart-title').html(toolbarCartTitle)
			if (Site.template == 'cart') {
				$('.js-page-cart').html(templateLodashRender(data, 'page-cart'))
			}
			if (Site.current_url == '/new_order') {
				location.reload()
			}
		}
	})

	let cartDeleteItem = ''
	EventBus.subscribe('delete_items:insales:cart', (data) => {
		if (cartDeleteItem != '') {
			$('.js-cart-item[data-item-line-id="' + cartDeleteItem + '"]').remove()
			cartDeleteItem = ''
		} else {
			$.each(data.action.items, (index, item) => {
				$('.js-cart-item[data-item-id="' + item + '"]').remove()
			})
		}
	})

	$(document).on('change', '[name="cart[coupon]"]', function () {
		//let form = $(this).closest('form')
		if ($(this).val() != '' && $(this).val() != ' ') {
			//$('[data-coupon-submit]', form).trigger('click')
		} else {
			$(this).val('')
			Cart.setCoupon({
				coupon: ' '
			})
		}
	})

	$(document).on('click', '[data-coupon-clear]', function () {
		let form = $(this).closest('form')
		form.find('[name="cart[coupon]"]').val('').trigger('change')
	})

	$(document).on('click', '[data-item-delete]', function () {
		cartDeleteItem = $(this).data('item-delete-line-id')
		$(this).prop('disabled', true).find('.icon-new').replaceWith(Icons.spinner)
	})

	EventBus.subscribe('add_items:insales:cart:light', () => {
		if (Site.template == 'cart') {
			window.location.reload()
		}
	})

	// сообщение о пересчете коризны если не все товары доступны для заказа
	let cartOverload = true
	EventBus.subscribe('max:quantity:insales:product', () => {
		if (cartOverload) {
			msg.show(templateLodashRender({}, 'popup-cart-overload'))
			cartOverload = false
		}
	})

	// показываем фиксированную кнопку оформления заказа при прокрутке, если не видно основного блока
	function fixCartButtons() {
		if ($('.js-cart-buttons-fixed').length > 0) {
			let cartButtons = $('.cart-check').get(0).getBoundingClientRect()
			if ($(window).width() <= 767 && (cartButtons.top > $(window).height() || cartButtons.bottom < 50)) {
				$('.js-cart-buttons-fixed').addClass('is-fixed')
			} else {
				$('.js-cart-buttons-fixed').removeClass('is-fixed')
			}
		}
	}
	if ($('.js-cart-buttons-fixed').length > 0) {
		$(window).on('scroll resize', fixCartButtons)
		fixCartButtons()
	}

	//опции
	EventBus.subscribe('prices-calculated:insales:ui_accessories', (data) => {
		let parent = $(data.productNode)
		let salePrice = data.priceWithAccessories || data.priceWithoutAccessores
		let oldPrice = data.oldPrice + (data.accessoriesPrice || 0) || false
		//цены и скидки
		$('[data-ds-product-price]', parent).html(Shop.money.format(salePrice))
		if (oldPrice && oldPrice > salePrice) {
			$('[data-ds-product-old-price]', parent).html(Shop.money.format(oldPrice))
			$('[data-ds-product-discount]', parent).html('&minus;' + Math.round(100 - salePrice * 100 / oldPrice) + '%')
			$('[data-ds-product-discount-money]', parent).html(Shop.money.format(oldPrice - salePrice))
		}
		//бонусные баллы
		let bonuses = $('[data-ds-product-bonuses]', parent)
		if (bonuses.length > 0) {
			setTimeout(() => {
				let variantQuantity = Number($('[data-add-cart-counter-count]', parent).html()) || 1
				let bonusesSettings = bonuses.data('ds-product-bonuses')
				let bonusesPercent = Number(bonusesSettings['bonus_percent']) / 100
				let bonusesTotal = Math.floor(salePrice * variantQuantity * bonusesPercent)
				bonuses.html('+' + bonusesTotal + ' ' + declOfNum(bonusesTotal, Messages.bonuses))
			}, 100)
		}
		//удаляем сообщение об ошибке
		$('[data-product-accessory-error]', parent).html('')
		//обновляем ссылки на заказ через мессенджеры
		messengersLink(parent)
		//
		preorderAccessory(parent)
	})

})

$(document).ready(() => {

  const swiper = new Swiper('.js-products-swiper', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    spaceBetween: 20,
    loop: false,
    touchEventsTarget: 'container',
    threshold: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10
      },
      576: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10
      },
      768: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 20
      },
      1025: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 20
      }
    },
    on: {
      init: (event) => {
        $(event.el).css({
          '--swiper-thumb-height': $(event.el).find('.thumb:first').height()+'px'
        })
      }
    }
  })

})

$(document).ready(() => {

	$(document).on('change', '.js-feedback-fields-checkbox', function (e) {
		const parent = $(this).closest('.form-element__checkbox-group')
		let values = parent.find('.js-feedback-fields-checkbox:checked').map(function () {
			return $(this).val()
		}).get().join(', ')
		parent.find('.js-feedback-fields').val(values)
	})

  $(document).on('submit', '.js-feedback-form', function (e) {
    e.preventDefault()
    let form = $(this)
    let formAlert = form.data('alert') || false
    let formFields = ''
    let formContent = form.find('[name="feedback[content]"]')
    let formSubject = form.find('[name="feedback[subject]"]')
    let formCaptcha = form.find('[name="g-recaptcha-response"]') || false
    form.find('.js-feedback-alert').remove()
    let formSend = true
    if (formCaptcha.length && formCaptcha.val() == '') {
      form.prepend('<div class="form__item js-feedback-alert">' + templateLodashRender({}, 'alert-captcha') + '</div>')
      formSend = false
    }
    if (formSend) {
      form.addClass('in-progress')
      form.find('.js-feedback-fields').each(function () {
        if ($(this).val() != '') {
          formFields += $(this).data('title') + ': ' + $(this).val() + '<br><br>'
        }
      })
      if (formFields != '') {
        formContent.val(formFields)
      } else {
        formContent.val(formSubject.val())
      }
      $.ajax({
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr('content')
        },
        url: '/client_account/feedback.json',
        data: form.serialize(),
        type: 'post',
        dataType: 'json'
      }).fail((e) => {
        $.fancybox.close()
        msg.show(templateLodashRender({}, 'popup-error'))
      }).done((e) => {
        $.fancybox.close()
        if (e.status == 'ok') {
          msg.show(templateLodashRender({
            text: formAlert
          }, 'popup-success'))
        } else {
          msg.show(templateLodashRender({}, 'popup-error'))
        }
      })
    }
  })
  
  $(document).on('click', '.js-rating-change [data-icon]', function () {
    let item = $(this)
    let parent = item.closest('.js-rating-change')
    let type = item.data('icon')
    let rate = item.index() + 1
    let input = parent.find('input')
    let rating = parent.find('[data-rating]')
    if (type == 'star') {
      input.val(rate)
      rating.attr('data-rating', rate)
    }
    if (type == 'times') {
      input.val(0)
      rating.attr('data-rating', 0)
    }
  })

})

$(document).ready(() => {

  $(document).on('click', '.js-toolbar-item-trigger', function (e) {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      e.preventDefault()
      let parent = $(this).parent()
      parent.toggleClass('is-open')
      $('.js-toolbar').toggleClass('is-active')
      if (parent.data('toolbar-item') == 'search' && parent.hasClass('is-open')) {
        let el = parent.find('[name="q"]')
        let tempEl = document.createElement('input');
        tempEl.style.position = 'fixed';
        tempEl.style.top = 0;
        tempEl.style.left = 0;
        tempEl.style.height = 0;
        tempEl.style.opacity = 0;
        document.body.appendChild(tempEl);
        tempEl.focus();
        setTimeout(() => {
          el.focus();
          el.click();
          document.body.removeChild(tempEl);
        }, 400);
      }
      if ($('.js-toolbar').hasClass('is-active')) {
        $('body').addClass('is-overflow')
      }
    }
  })

  $(document).on('click', '[data-toolbar-mobile-close]', function (e) {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      e.preventDefault()
      $('.js-toolbar .toolbar-item.is-open').removeClass('is-open')
      $('.js-toolbar').removeClass('is-active')
      $('body').removeClass('is-overflow')
    }
  })

  $(document).on('click', '.js-toolbar-footer-item-trigger', function (e) {
    e.preventDefault()
    let target = $(this).closest('[data-toolbar-footer-item]').data('toolbar-footer-item')
    $('[data-toolbar-item="' + target + '"] .js-toolbar-item-trigger').trigger('click')
  })

})

$(document).ready(() => {
	$(document).on('click', '.js-mobile-menu-trigger', function (e) {
		e.preventDefault()
		if ($('.js-mobile-collections').hasClass('is-active')) {
			$('.js-mobile-collections').removeClass('is-active')
		}
		$('.js-mobile-menu').toggleClass('is-active')
		if ($('.js-mobile-menu').hasClass('is-active')) {
			$('body').addClass('is-overflow')
		}
	})

	$(document).on('click', '.js-mobile-menu-close', function (e) {
		e.preventDefault()
		$('.js-mobile-menu').removeClass('is-active')
		$('body').removeClass('is-overflow')
	})

	$(document).on('click', '.js-mobile-collections-trigger', function (e) {
		e.preventDefault()
		if ($('.js-mobile-menu').hasClass('is-active')) {
			$('.js-mobile-menu').removeClass('is-active')
		}
		$('.js-mobile-collections').toggleClass('is-active')
		if ($('.js-mobile-collections').hasClass('is-active')) {
			$('body').addClass('is-overflow')
		}
	})

	$(document).on('click', '.js-mobile-collections-close', function (e) {
		e.preventDefault()
		$('.js-mobile-collections').removeClass('is-active')
		$('body').removeClass('is-overflow')
	})

	$(document).on('click', '.js-mobile-collections-toggle', function (e) {
		e.preventDefault()
		let parent = $(this).closest('[data-nav-item]')
		parent.toggleClass('is-open')
	})

	$.each(Site.current_collections, (index, item) => {
		$('.mobile-collections [data-nav-item="' + item.id + '"]').addClass('is-active is-open')
	})

	$.each(Site.current_collections_all, (index, item) => {
		$('.mobile-collections [data-nav-item="' + item.id + '-all"]').addClass('is-active is-open')
	})
})

$(document).ready(() => {

	const recentlyContainer = '[data-recently]'
	const recentlyData = $(recentlyContainer).data('recently')
	const recentlyMax = 40
	let recentlyProducts = Cookies.get('recently-view') ? JSON.parse(Cookies.get('recently-view')) : []
	const recentlyCurrent = recentlyData ? recentlyData.id : false
	const recentlyClear = '[data-recently-clear]'

	let recently = {
		init: () => {
			if (recentlyData) {
				if (recentlyCurrent) {
					recently.add(recentlyCurrent)
				} else {
					recently.get(recentlyProducts)
				}
			}
		},
		add: (id) => {
			recentlyProducts = recentlyProducts.filter(item => item != id)
			recently.get(recentlyProducts)
			recentlyProducts.unshift(recentlyCurrent || id)
			recentlyProducts = recentlyProducts.slice(0, recentlyMax)
			Cookies.set('recently-view', JSON.stringify(recentlyProducts), {
				path: '/',
				expires: 365
			})
		},
		get: (products) => {
			if (products.length > 0) {
				fetch('/products_by_id/' + products.join(',') + '.json?without_many_variants=true&lang=' + Site.locale).then((response) => {
					return response.json()
				}).then((data) => {
					if (data.products.length > 0) {
						let sortedData = []
						$.each(products, (index, item) => {
							let x = data.products.filter(o => o.id == item)
							if (x.length > 0) {
								sortedData.push(x[0])
							}
						})
						recently.draw(sortedData)
					}
				})
			}
		},
		draw: (data) => {
			$(recentlyContainer).html(templateLodashRender({
				products: data
			}, 'products-recently'))
			new Swiper('.js-recently-swiper', {
				slidesPerView: 7,
				slidesPerGroup: 7,
				spaceBetween: 20,
				loop: false,
				touchEventsTarget: 'container',
    		threshold: 10,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				},
				breakpoints: {
					0: {
						slidesPerView: 2,
						slidesPerGroup: 2,
						spaceBetween: 10
					},
					376: {
						slidesPerView: 3,
						slidesPerGroup: 3,
						spaceBetween: 10
					},
					576: {
						slidesPerView: 4,
						slidesPerGroup: 4,
						spaceBetween: 10
					},
					768: {
						slidesPerView: 5,
						slidesPerGroup: 5,
						spaceBetween: 20
					},
					1025: {
						slidesPerView: 6,
						slidesPerGroup: 6,
						spaceBetween: 20
					},
					1200: {
						slidesPerView: 7,
						slidesPerGroup: 7,
						spaceBetween: 20
					}
				},
				on: {
					init: (event) => {
						$(event.el).css({
							'--swiper-thumb-height': $(event.el).find('.thumb:first').height() + 'px'
						})
						lazyLoad.update()
					}
				}
			})
		},
		clear: () => {
			Cookies.remove('recently-view')
			$(recentlyContainer).slideUp(() => {
				$(recentlyContainer).html('')
			})
		},
		quickview: (id) => {
			let recentlyProducts = Cookies.get('recently-view') ? JSON.parse(Cookies.get('recently-view')) : []
			recentlyProducts = recentlyProducts.filter(item => item != id)
			recentlyProducts.unshift(id)
			recentlyProducts = recentlyProducts.slice(0, recentlyMax)
			Cookies.set('recently-view', JSON.stringify(recentlyProducts), {
				path: '/',
				expires: 365
			})
			recently.get(recentlyProducts)
			$(recentlyContainer).show()
		},
	}

	recently.init()

	$(document).on('click', recentlyClear, (e) => {
		e.preventDefault()
		recently.clear()
	})

	globalFunctions.recentlyQuickview = (id) => {
		recently.quickview(id)
	}

})

$(document).ready(() => {

	let search = $('.js-search-input')

	search.on('focus', () => {
		$('body').addClass('is-search-focus')
	})

	$(document).on('click', (e) => {
		if ($('body').hasClass('is-search-focus')) {
			if ($(e.target).closest('.search').length == 0) {
				$('body').removeClass('is-search-focus')
				search.blur()
			}
		}
	})

	search.each(function () {
		let serachItem = $(this)
		serachItem.autocomplete({
			serviceUrl: '/search.json',
			paramName: 'q',
			params: {
				page_size: 20,
				lang: Site.locale
			},
			dataType: 'json',
			deferRequestBy: 300,
			preserveInput: true,
			noCache: true,
			appendTo: serachItem.closest('form').find('.js-search-results'),
			minChars: 0,
			showNoSuggestionNotice: true,
			preventBadQueries: false,
			noSuggestionNotice: templateLodashRender({}, 'search-empty'),
			transformResult: (response) => {
				return {
					suggestions: $.map(response, (dataItem) => {
						return {
							value: _.escape(dataItem.title),
							data: {
								url: dataItem.url + ((Site.locale_not_default) ? '?lang=' + Site.locale + '' : ''),
								price_min: dataItem.price_min,
								price_max: dataItem.price_max,
								image: dataItem.first_image.thumb_url
							}
						}
					})
				}
			},
			formatResult: (suggestions, currentValue) => {
				suggestions.value = suggestions.value.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + serachItem.devbridgeAutocomplete().currentValue + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong>$1</strong>')
				return templateLodashRender(suggestions, 'search-results')
			},
			onSearchStart: (params) => {
				serachItem.addClass('in-progress')
			},
			onSearchComplete: (query, suggestions) => {
				serachItem.removeClass('in-progress')
				if (suggestions.length == 0) {
					if (query != '') {
						serachItem.closest('form').find('.autocomplete-no-suggestion').show()
					} else {
						serachItem.closest('form').find('.autocomplete-no-suggestion').hide()
					}
				}
			},
			beforeRender: (container, suggestions) => {
				$('.autocomplete-suggestions-total').remove()
				if (suggestions.length > 0) {
					$(container).parent().append(templateLodashRender({
						count: suggestions.length
					}, 'search-total'))
				}
			}
		})
	})

	$('.search-mobile .js-search-results').on('touchmove', () => {
		$('.search-mobile .js-search-input').blur()
	})

})

$(document).ready(() => {

	$(document).on('click', '[data-ui-favorites-trigger]', function () {
		$(this).toggleClass('favorites-not-added favorites-added')
	})

	$(document).on('click', '[data-ui-favorites-delete]', function (e) {
		$(this).prop('disabled', true).find('.icon-new').replaceWith(Icons.spinner)
	})

	EventBus.subscribe('update_items:insales:favorites_products', (data) => {
		$('.js-toolbar-favorites').html(templateLodashRender(data, 'toolbar-favorites'))
		if (Site.template == 'favorite') {
			if (data.products.length > 0) {
				if (data.action.method == 'remove_item') {
					$('.js-page-favorites [data-product-id="' + data.action.item + '"]').remove()
				}
			} else {
				$('.js-page-favorites').html(templateLodashRender(data, 'page-favorites'))
			}
		}
		if (data.products.length > 0) {
			$('.js-toolbar-favorites-header').html('(' + data.products.length + ' ' + declOfNum(data.products.length) + ')').show()
		} else {
			$('.js-toolbar-favorites-header').hide()
		}
	})

	EventBus.subscribe('overload:insales:favorites_products', () => {
		msg.show(templateLodashRender({}, 'toolbar-favorites-error'))
		FavoritesProducts.update()
	})

})
;
$(document).ready(() => {
  $(document).on('click', '[data-tabs-item]', function (e) {
    e.preventDefault()
    let tab = $(this)
    if (!tab.hasClass('is-active')) {
      let parent = tab.closest('.tabs')
      parent.find('[data-tabs-item]').removeClass('is-active')
      parent.find('[data-tabs-content]').removeClass('is-active')
      parent.find('[data-tabs-content="' + tab.data('tabs-item') + '"]').addClass('is-active')
      tab.addClass("is-active")
      if (tab.data('tabs-item') == 'block_nashi-magaziny') {
        parent.find('[data-tabs-city="1"]').trigger('click')
        showSopsTab = true
      }
    }
  })
})
;




