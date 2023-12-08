import { CategoryService } from '$lib/services'

export const prerender = false
const isServer = import.meta.env.SSR

export async function load({ url, params, parent, setHeaders }) {
	const { store, storeId, origin, sid } = await parent()

	const categorySlug = 'mobile-cover'

	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	return {
		category: CategoryService.fetchCategory({
			id: categorySlug,
			sid,
			storeId,
			origin
		}),
		// streamed: {
		megamenu: CategoryService.fetchMegamenuData({
			sid,
			storeId,
			origin
		}),
		// },
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
