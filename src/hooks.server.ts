// import * as SentryNode from '@sentry/node'
import { authenticateUser, fetchCart } from '$lib/server'
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton } from '$lib/config'
import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { nanoid } from 'nanoid'
import { InitService } from '$lib/services'

// const SENTRY_DSN = env.SECRET_SENTRY_DSN

// if (SENTRY_DSN && SENTRY_DSN !== 'YOUR_SENTRY_DSN') {
// 	SentryNode.init({
// 		dsn: SENTRY_DSN
// 	})
// }

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'), { path: '/' })

	return fetch(request)
}

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = nanoid()
	// SentryNode.captureException(error, {
	// 	contexts: { sveltekit: { event, errorId } }
	// })

	return {
		message: "An unexpected error occurred. We're working on it.",
		errorId
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const IS_DEV = import.meta.env.DEV
		const url = new URL(event.request.url)
		const host = url.host

		const protocol = !IS_DEV ? `https://` : `http://`
		event.locals.origin = protocol + host
		event.locals.host = host

		const userAgent = event.request.headers.get('user-agent')

		const isDesktop = !/mobile/i.test(userAgent)
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)

		// console.log('isDesktop', isDesktop);

		event.locals.isDesktop = isDesktop
		event.locals.isShowBackButton = isShowBackButton

		const storeId = event.cookies.get('storeId')
		// const store = event.cookies.get('store') || '{}'
		// const storeAsJson = JSON.parse(store)
		if (storeId && storeId != 'undefined') {
			event.locals.storeId = storeId
			// event.locals.store = storeAsJson
		} else {
			try {
				const { storeOne } = await InitService.fetchInit({
					host,
					origin: event.locals.origin
				})
				const storeId = storeOne?._id
				// const store = {
				// 	id: storeOne?.id,
				// 	currencyCode: storeOne?.currencyCode,
				// 	description: storeOne?.description,
				// 	domain: storeOne?.domain,
				// 	email: storeOne?.email,
				// 	phone: storeOne?.phone,
				// 	favicon: storeOne?.favicon,
				// 	fontFamily: storeOne?.fontFamily,
				// 	keywords: storeOne?.keywords,
				// 	logo: storeOne?.logo,
				// 	metaDescription: storeOne?.metaDescription,
				// 	socialSharingButtons: storeOne?.socialSharingButtons,
				// 	themeColor: storeOne?.themeColor,
				// 	title: storeOne?.title,
				// 	websiteName: storeOne?.websiteName,
				// 	isCors: storeOne?.isCors,
				// 	isMultiVendor: storeOne?.isMultiVendor,
				// 	adminUrl: storeOne?.adminUrl,
				// 	address: storeOne?.address,
				// 	saasName: storeOne?.saasName,
				// 	saasDomain: storeOne?.saasDomain,
				// 	guaranteed_response_time: storeOne?.guaranteed_response_time,
				// 	product_image_dimension: storeOne?.product_image_dimension,
				// 	isSecureCatalogue: storeOne?.isSecureCatalogue,
				// 	store_timings: storeOne?.store_timings,
				// 	isHyperlocal: storeOne?.isHyperlocal,
				// 	IMAGE_CDN_URL: storeOne?.IMAGE_CDN_URL
				// }
				if (!storeId || storeId == 'undefined')
					throw { status: 404, message: `Could not find STORE for domain = ${url.host}` }
				event.cookies.set('storeId', storeId, { path: '/' })
				// event.cookies.set('store', JSON.stringify(store), { path: '/' })
				event.locals.storeId = storeId

				// event.locals.store = store
			} catch (e) {
				throw { status: 404, message: `Could not find STORE for domain = ${url.host}` }
			}
		}
		// console.log('menu at hooks.server.is', menu);
		// console.log('storeOne at hooks.server.is', storeOne);

		// This calls init only when store data not present in browser cookies
		// const { storeOne } = await fetchStoreData(event)
		// console.timeEnd('init1')

		// event.locals.menu = menu || []
		// event.locals.megamenu = megamenu || []

		// this simply gets data from cookie
		event.locals.me = await authenticateUser(event)
		const zip = event.cookies.get('zip')
		event.locals.sid = event.cookies.get('connect.sid')
		event.locals.cartId = event.cookies.get('cartId')
		if (zip) event.locals.zip = JSON.parse(zip)
		// This makes a call to backend on every request
		await fetchCart(event)

		// const derivedSid: string = event.cookies.get('connect.sid') || ''
		// const route = event.url
		// const start = performance.now()
		// event.locals.sid = derivedSid
		// event.request.headers.delete('connection')
		const response = await resolve(event)

		// const end = performance.now()
		// const responseTime = end - start

		// if (responseTime > 1000) {
		// 	// console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

		// if (responseTime < 100) {
		// 	// console.log(`🚀 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

		return response
	} catch (e) {
		// If the store is not found, throw a 404 error
		throw error(404, 'Store Not Found')
	}
}
