export default defineNuxtConfig({
	pages: true,
	modules: [
		'nuxt-icon',
		'nuxt-lodash',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/supabase',
	],
})
