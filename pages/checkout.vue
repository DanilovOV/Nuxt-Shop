<script setup>
import MainLayout from '~/layouts/MainLayout.vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const user = useSupabaseUser()
const route = useRoute()

definePageMeta({ middleware: 'auth' })

const total = ref(0)
const currentAddress = ref(null)
const isProcessing = ref(false)

onBeforeMount(async () => {
	if (userStore.checkout.length < 1) {
		return navigateTo('/shoppingcart')
	}

	total.value = 0.0
	if (user.value) {
		currentAddress.value = await useFetch(
			`/api/prisma/get-address-by-user/${user.value.id}`
		)
		setTimeout(() => (userStore.isLoading = false), 200)
	}
})

watchEffect(() => {
	if (route.fullPath == '/checkout' && !user.value) {
		return navigateTo('/auth')
	}
})

onMounted(async () => {
	isProcessing.value = true

	userStore.checkout.forEach((item) => {
		total.value += item.price
	})
})
</script>

<template>
	<MainLayout>
		<div id="CheckoutPage" class="mt-4 max-w-[1200px] mx-auto px-2">
			<div class="md:flex gap-4 justify-between mx-auto w-full">
				<div class="md:w-[65%]">
					<div class="bg-white rounded-lg p-4">
						<div class="text-xl font-semibold mb-2">Адрес доставки</div>

						<div v-if="currentAddress && currentAddress.data">
							<NuxtLink
								to="/address"
								class="flex items-center pb-2 text-blue-500 hover:text-red-400"
							>
								<Icon name="mdi:plus" size="18" class="mr-2" />
								Обновить адрес
							</NuxtLink>

							<div class="pt-2 border-t">
								<div class="underline pb-1">Адрес доставки</div>
								<ul class="text-xs">
									<li class="flex items-center gap-2">
										<div>Имя:</div>
										<div class="font-bold">{{ currentAddress.data.name }}</div>
									</li>
									<li class="flex items-center gap-2">
										<div>Адрес:</div>
										<div class="font-bold">
											{{ currentAddress.data.address }}
										</div>
									</li>
									<li class="flex items-center gap-2">
										<div>Zip код:</div>
										<div class="font-bold">
											{{ currentAddress.data.zipcode }}
										</div>
									</li>
									<li class="flex items-center gap-2">
										<div>Город:</div>
										<div class="font-bold">{{ currentAddress.data.city }}</div>
									</li>
									<li class="flex items-center gap-2">
										<div>Страна:</div>
										<div class="font-bold">
											{{ currentAddress.data.country }}
										</div>
									</li>
								</ul>
							</div>
						</div>

						<NuxtLink
							v-else
							to="/address"
							class="flex items-center text-blue-500 hover:text-red-400"
						>
							<Icon name="mdi:plus" size="18" class="mr-2" />
							Добавить новый адрес
						</NuxtLink>
					</div>

					<div id="Items" class="bg-white rounded-lg p-4 mt-4">
						<div v-for="product in userStore.checkout">
							<CheckoutItem :product="product" />
						</div>
					</div>
				</div>

				<div class="md:hidden block my-4" />
				<div class="md:w-[35%]">
					<div id="PlaceOrder" class="bg-white rounded-lg p-4">
						<div class="text-2xl font-extrabold mb-2">Итого</div>

						<div class="flex items-center justify-between my-4">
							<div class="">Общая стоимость доставки</div>
							<div class="">Бесплатно</div>
						</div>

						<div class="border-t" />

						<div class="flex items-center justify-between my-4">
							<div class="font-semibold">Всего</div>
							<div class="text-2xl font-semibold">
								$ <span class="font-extrabold">{{ total / 100 }}</span>
							</div>
						</div>

						<form @submit.prevent="console.log('pay')">
							<button
								:disabled="isProcessing"
								type="submit"
								class="mt-4 bg-gradient-to-r from-[#FE630C] to-[#FF3200] w-full text-white text-[21px] font-semibold p-1.5 rounded-full"
								:class="isProcessing ? 'opacity-70' : 'opacity-100'"
							>
								Разместить заказ
							</button>
						</form>
					</div>

					<div class="bg-white rounded-lg p-4 mt-4">
						<div class="text-lg font-semibold mb-2 mt-2">Nuxt-Shop</div>
						<p class="my-2">
							Nuxt-Shop хранит вашу информацию и платежи в безопасности
						</p>
					</div>
				</div>
			</div>
		</div>
	</MainLayout>
</template>
