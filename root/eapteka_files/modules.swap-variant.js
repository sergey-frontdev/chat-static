$(document).ready(() => {

  const SwapVariants = {
    init: (product, page_type) => {
      let variant_ids = _.split(product.find('[data-swap-variant-ids]').data('swap-variant-ids'), ',')
      if (variant_ids.length > 1) {
        let current_id = product.find('[data-swap-current-id]').data('swap-current-id')
        let variant_props = _.split(product.find('[data-swap-variant-props]').data('swap-variant-props'), ',')
        let target = product.find('[data-swap-variant]')
        SwapVariants.build(current_id, variant_props, variant_ids, target, page_type)
      }
    },
    build: (current_id, variant_props, variant_ids, target, page_type) => {
      ajaxAPI.product.getList(variant_ids).done((data) => {
        let key_minus = 0
        let current = _.find(data, ['id', current_id])
        let current_property = []
        let current_property_ids = []
        _.forEach(variant_props, function (value, key) {
          let property = _.find(current.properties, ['title', value])
          if (property) {
            let property_value = _.find(current.characteristics, ['property_id', property.id])
            current_property[key - key_minus] = property
            current_property_ids[key - key_minus] = property_value.id
          } else {
            key_minus++
          }
        })
        
        let dataProducts = data

        _.forEach(current_property_ids, function (value_1, key_1) {
          let unicItems = []
          let newProducts = []
          target.append(templateLodashRender({
            'id': value_1,
            'data': current_property[key_1]
          }, 'swap-variant-item'))
          _.forEach(dataProducts, function (value_2, key_2) {
            let find_property = _.find(value_2.characteristics, {
              'property_id': current_property[key_1].id
            })
            if (_.indexOf(unicItems, find_property.id) < 0 ) {
              let property_title = find_property.title
              let property_type = SWAP_VARIANT_TYPES[current_property[key_1].title] || 'button'
              let current_class = `is-${property_type}`
              unicItems.push(find_property.id)
              current_class += (current_property_ids[key_1] == find_property.id) ? ' is-active' : ''
              current_class += (value_2.available) ? ' is-available' : ' not-available'
              target.find('.swap-variant__values-' + current_property_ids[key_1]).append(templateLodashRender({
                'title': property_title,
                'product': value_2,
                'current_class': current_class
              }, `swap-variant-${property_type}`)).addClass(`is-${property_type}`)
              if (current_property_ids[key_1] == find_property.id && (property_type == 'color' || property_type == 'thumb')) {
                target.find('.swap-variant__values-' + current_property_ids[key_1]).closest('.swap-variant__item').find('.swap-variant__label-title').append(`: <span class="swap-variant__label-value">${property_title}</span>`)
              }
            }
            if(current_property_ids[key_1] == find_property.id) {
              newProducts.push(value_2)
            }
          })
          dataProducts = newProducts
          
          /*_.forEach(data, function (value_2, key_2) {
            let key_count = 0
            _.forEach(current_property_ids, function (value_3, key_3) {
              if (key_3 != key_1) {
                key_count += _.filter(value_2.characteristics, {
                  'id': current_property_ids[key_3]
                }).length
              }
            })
            if (key_count > current_property_ids.length - 2) {
              let property_title = _.find(value_2.characteristics, {
                'property_id': current_property[key_1].id
              }).title
              let property_type = SWAP_VARIANT_TYPES[current_property[key_1].title] || 'button'
              let current_class = `is-${property_type}`
              current_class += (current_id == value_2.id) ? ' is-active' : ''
              current_class += (value_2.available) ? ' is-available' : ' not-available'
              target.find('.swap-variant__values-' + current_property_ids[key_1]).append(templateLodashRender({
                'title': property_title,
                'product': value_2,
                'current_class': current_class
              }, `swap-variant-${property_type}`)).addClass(`is-${property_type}`)
              if (value_2.id == current_id && (property_type == 'color' || property_type == 'thumb')) {
                target.find('.swap-variant__values-' + current_property_ids[key_1]).closest('.swap-variant__item').find('.swap-variant__label-title').append(`: <span class="swap-variant__label-value">${property_title}</span>`)
              }
            }
          })*/
        })

        target.show()
        SwapVariants.complete(page_type)
      })
    },
    complete: (page_type) => {
      if (page_type == 'product') {
        $(document).trigger('swap_variant_product_complete')
      }
      if (page_type == 'quickview') {
        $(document).trigger('swap_variant_quickview_complete')
      }
    }
  }

  SwapVariants.init($('[data-main-form]'), 'product')

  $(document).on('click', '.swap-variant__value.is-active', function (e) {
    e.preventDefault()
  })

  globalFunctions.SwapVariantsQuickview = (product, page_type) => {
    SwapVariants.init(product, page_type)
  }

})
;
