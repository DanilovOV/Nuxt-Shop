// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@pinia/nuxt',
		// '@nuxtjs/supabase',
		'nuxt-icon',
	],
	runtimeConfig: {
		public: {
			stripePk: process.env.STRIPE_PK_KEY,
		},
	},
	app: {
		head: {
			script: [{ src: 'https://js.stripe.com/v3/', defer: true }],
		},
	},
})
