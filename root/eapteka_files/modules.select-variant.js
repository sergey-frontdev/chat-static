$(document).ready(() => {

	const variantParams = '&with=variants,price_kinds,option_names&lang=' + Site.locale
	const variantTrigger = '[data-select-variant]'
	const variantForm = '.select-variant__form'
	const variantsList = {}

	let variant = {
		get: (id, jsonData) => {
			$.fancybox.open({
				src: templateLodashRender({}, 'select-variant-preloader'),
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			})
			if (variantsList[id]) {
				variant.show(id, jsonData)
			} else {
				$.get('/front_api/products.json?ids=' + id + '' + variantParams).done((data) => {
					if (data.products) {
						variantsList[id] = data.products[0]
						variant.show(id, jsonData)
					} else {
						$.fancybox.close()
					}
				}).fail(() => {
					$.fancybox.close()
				})
			}
		},
		show: (id, jsonData) => {
			$('.js-select-variant-container').html(templateLodashRender({
				product: variantsList[id],
				jsonData: jsonData
			}, 'select-variant-content'))
			Products.initInstance($(variantForm)).done(() => {
				$('.js-select-variant-container').animate({
					'min-height': $(variantForm).height()
				}, 200, () => {
					$('.js-select-variant').addClass('is-init')
				})
			}).fail(() => {
				$.fancybox.close()
			})
		}
	}

	$(document).on('click', variantTrigger, function (e) {
		e.preventDefault()
		variant.get($(this).data('select-variant'), $(this).data('select-json'))
	})

	EventBus.subscribe('update_variant:insales:product', (dataSelect) => {
		if (!dataSelect.action.product.is('[data-select-variant-form]')) {
			return
		}
		let parent = $(variantForm)
		if (parent.length > 0) {
			let salePrice = Number(dataSelect.price)
			let oldPrice = Number(dataSelect.old_price)
			if (parent.find('.product-accessories').length > 0) {
				let input = parent.find('.product-accessories').find('input:checked')
				input.each((index, item) => {
					let price = Number($(item).closest('[data-product-accessory-values-item]').find('[data-product-accessory-valuesitem-price]').data('product-accessory-valuesitem-price'))
					salePrice += price
					if (oldPrice) {
						oldPrice += price
					}
				})
			}
			$('[data-ds-product-price]', parent).html(Shop.money.format(salePrice))
			if (oldPrice && oldPrice > salePrice) {
				$('[data-ds-product-old-price]', parent).html(Shop.money.format(oldPrice))
				$('[data-ds-product-discount-money]', parent).html(Shop.money.format(oldPrice - salePrice))
			}
			$('[data-ds-product-quantity]', parent).html(dataSelect.quantity || '')
			//
			preorderAccessory(parent)
		}
	})

})
;
