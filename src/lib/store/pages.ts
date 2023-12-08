import { PageService } from '$lib/services'
import { writable } from 'svelte/store'

export const pagesStore = writable([])

let isLoading = false

export const getPagesFromStore = async ({ origin, storeId, isCors, forceUpdate = false }) => {
	let existingPages = null

	pagesStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingPages = value
		}
	})

	if ((!isLoading && !existingPages) || !!forceUpdate) {
		isLoading = true

		const pagesDataFromServer = await PageService.fetchPages({
			storeId,
			origin,
			isCors
		})

		pagesStore.update((u) => pagesDataFromServer || [])

		isLoading = false
	}

	return existingPages
}
