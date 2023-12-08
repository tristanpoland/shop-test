import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchFooterCategories = async ({
	isCors = false,
	origin,
	megamenu = false,
	sid = null,
	storeId
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(
				`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`,
				sid
			)
		} else {
			data = await getAPI(
				`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`,
				origin
			)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({
	children = false,
	id,
	isCors = false,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		if (isServer || isCors) {
			res = await getBySid(`es/categories/${id}?store=${storeId}&children=${children}`, sid)
		} else {
			res = await getAPI(`es/categories/${id}?store=${storeId}&children=${children}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllCategories = async ({
	featured = false,
	isCors = false,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (isServer || isCors) {
			res = await getBySid(catQ, sid)
		} else {
			res = await getAPI(catQ, origin)
		}
		const currentPage = res.currentPage
		const data = res.data
		const pageSize = res.pageSize

		return { data, pageSize, currentPage }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({
	featured = false,
	isCors = false,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (isServer || isCors) {
			res = await getBySid(catQ, sid)
		} else {
			res = await getAPI(catQ, origin)
		}
		// must return link:string, slug:string(optional) name:string, new:boolean
		currentPage = res?.page
		err = !products ? 'No result Not Found' : null
		facets = res?.facets?.all_aggs
		products = res?.data || []
		productsCount = res?.count

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({
	isCors = false,
	megamenu = false,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(
				`categories/megamenu?megamenu=${megamenu}&store=${storeId}&active=true`,
				sid
			)
		} else {
			data = await getAPI(
				`categories/megamenu?megamenu=${megamenu}&store=${storeId}&active=true`,
				origin
			)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
