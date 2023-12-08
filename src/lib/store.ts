// import { getBySid } from './utils/server'
// import Cookie from 'cookie-universal'
import { writable } from 'svelte/store'

// const cookies = Cookie()

export const geoLocation = writable({
	city: null,
	country: null,
	lat: 0,
	lng: 0,
	locality: null,
	selectedPrediction: null,
	state: null
})

// export const me = writable({})

// export const megamenu = writable({})

// export const store = writable({})

export const loadingDelayed = writable(false)

export const loginUrl = writable('/auth/login')

export const settings = writable({})

// export const fetchLocation = async () => {
// 	try {
// 		const geo = cookies.get('geo')
// 		const geo1: any = {}
// 		geo1.lat = geo.lat
// 		geo1.lng = geo.lng
// 		geo1.selectedPrediction = decodeURIComponent(geo.selectedPrediction)
// 		if (geo1.selectedPrediction === 'undefined') geo1.selectedPrediction = null
// 		geo1.locality = decodeURIComponent(geo.locality)
// 		if (geo1.locality === 'undefined') geo1.locality = null
// 		geo1.city = decodeURIComponent(geo.city)
// 		if (geo1.city === 'undefined') geo1.city = null
// 		geo1.state = decodeURIComponent(geo.state)
// 		if (geo1.state === 'undefined') geo1.state = null
// 		geo1.country = decodeURIComponent(geo.country)
// 		if (geo1.country === 'undefined') geo1.country = null
// 		geoLocation.set({ ...geo1 })
// 	} catch (e) {
// 		geoLocation.set({
// 			selectedPrediction: null,
// 			locality: null,
// 			city: null,
// 			state: null,
// 			country: null,
// 			lat: 0,
// 			lng: 0
// 		})
// 	}
// }

// export const fetchSettings = async () => {
// 	try {
// 		const data = (await getBySid('settings')).data?.settings
// 		settings.set(data)
// 		// if (data.otpLogin) loginUrl.set('auth/login)
// 	} catch (e) {
// 		settings.set({})
// 	}
// }

// export const fetchMegamenu = async () => {
// 	// try {
// 	// } catch (e) {
// 	// 	megamenu.set([])
// 	// }
// }

// export const fetchUser = async () => {
// 	try {
// 		const data = await getBySid('users/me')
// 		me.set(data)
// 	} catch (e) {
// 		me.set({})
// 	}
// }

// fetchLocation()
// fetchSettings()
// fetchStore()
// fetchMegamenu()
// fetchUser()
