import { FaqService } from '$lib/services'

export async function load({ parent }) {
	const { storeId, sid, origin } = await parent()
	let loading = false,
		err,
		faqs,
		count

	try {
		loading = true
		const res = await FaqService.fetchFaqs({
			storeId,
			sid,
			origin
		})
		faqs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	return { loading, err, faqs, count }
}
