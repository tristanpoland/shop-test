import { CategoryService, StoreService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchStoreData = async (event: RequestEvent) => {
	try {
		const cookieMegamenu = event.cookies.get('megamenu')
		const storeId = event.cookies.get('storeId')
		const zip = event.cookies.get('zip')

		if (zip) {
			event.locals.zip = JSON.parse(zip)
		}
		const host = event.locals.host
		// console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhh', host)
		const r = await StoreService.getStoreData({
			url: event.request.url,
			host,
			cookies: event.cookies,
			cookieStore: storeId,
			cookieMegamenu,
			server: true
		})

		if (!cookieMegamenu || cookieMegamenu == 'undefined') {
			r.megamenu1 = await CategoryService.fetchMegamenuData({
				origin: event.request.url,
				storeId,
				sid: event.cookies.get('connect.sid'),
				megamenu: true
			})
		} else {
			r.megamenu1 = JSON.parse(cookieMegamenu)
		}

		return r || {}
	} catch (e) {
		return {}
	}
}
