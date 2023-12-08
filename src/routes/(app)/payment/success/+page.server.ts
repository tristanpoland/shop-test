import { CartService, OrdersService } from '$lib/services'
import { cartStore } from '$lib/store/cart'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, request, locals, cookies }) {
	const cartId = cookies.get('cartId')
	const orderId = url.searchParams.get('orderId') || url.searchParams.get('order_no')
	const paymentMode = url.searchParams.get('provider')
	const paymentReferenceId = url.searchParams.get('payment_reference_id')
	const sid = cookies.get('connect.sid')
	const status = url.searchParams.get('status')
	const storeId = locals.storeId

	let cart
	let err
	let loading
	let order

	try {
		loading = true

		order = await OrdersService.paySuccessPageHit({
			orderId,
			paymentMode,
			paymentReferenceId,
			status,
			server: true,
			sid,
			storeId
		})
		cookies.set('cartId', null, { path: '/', expires: new Date(0) })
		cookies.set('cartQty', '0', { path: '/', expires: new Date(0) })

		locals.cartId = null
		locals.cartQty = 0
	} catch (e) {
		// console.log('error at payment success page', e);

		err = e

		if (e.status === 401) {
			throw redirect(307, '/auth/login')
		} else {
			throw error(e?.status, e?.body?.message || e?.data?.message || e?.message)
		}
	} finally {
		loading = false
	}

	// try {
	// 	cart = await CartService.fetchRefreshCart({
	// 		cartId,
	// 		storeId,
	// 		sid,
	// 		origin: locals.origin
	// 	})

	// 	if (cart) {
	// 		const cartObj = {
	// 			cartId: cart?.cart_id,
	// 			items: cart?.items,
	// 			qty: cart?.qty,
	// 			tax: cart?.tax,
	// 			subtotal: cart?.subtotal,
	// 			total: cart?.total,
	// 			currencySymbol: cart?.currencySymbol,
	// 			discount: cart?.discount,
	// 			savings: cart?.savings,
	// 			selfTakeout: cart?.selfTakeout,
	// 			shipping: cart?.shipping,
	// 			unavailableItems: cart?.unavailableItems,
	// 			formattedAmount: cart?.formattedAmount
	// 		}

	// 		locals.cartId = cartObj.cartId
	// 		locals.cartQty = cartObj.qty
	// 		locals.cart = cartObj
	// 	}
	// } catch (e) {
	// 	// console.log('error at payment success page cart', e);
	// }

	return { loading, status, paymentMode, order, err, cart }
}
