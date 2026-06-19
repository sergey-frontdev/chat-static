$(document).ready(() => {

	const profile = {
		init: () => {
			if (Account.client) {
				profile.get()
			} else {
				Cookies.remove('profile')
				$('.js-toolbar-profile').html(templateLodashRender({}, 'toolbar-profile'))
			}
		},
		get: () => {
			if (!Cookies.get('profile')) {
				fetch('/client_account/contacts.json').then((response) => {
					return response.json()
				}).then((data) => {
					if (data.status == 'ok') {
						profile.save(data)
						profile.draw(data)
					}
				})
			} else {
				let data = JSON.parse(Cookies.get('profile'))
				profile.draw(data)
				profile.update()
			}
		},
		update: () => {
			setTimeout(() => {
				Cookies.remove('profile')
				profile.get()
			}, 10000)
		},
		save: (data) => {
			Cookies.set('profile', JSON.stringify(data), {
				path: '/'
			})
		},
		draw: (data) => {
			let name = data.client.name.split(' ')
			$('.js-toolbar-profile-title').html('<strong>' + ((name.length > 1) ? name[1] : name[0]) + '</strong>')
			$('.js-toolbar-profile').html(templateLodashRender(data, 'toolbar-profile'))
		}
	}

	profile.init()

})
;
