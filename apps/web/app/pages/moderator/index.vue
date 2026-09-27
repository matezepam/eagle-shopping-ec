<script setup lang="ts">
import { moderatorApi } from '~/services/moderator.api'
import type { Product } from '~/types/catalog'
definePageMeta({ layout: 'moderator', middleware: 'moderator' })
const { data: products, pending, error } = await useAsyncData<Product[]>('moderator-dashboard', async () => (await moderatorApi.products()).productsAdmin)
const published = computed(() => products.value?.filter((product) => product.published).length ?? 0)
const lowStock = computed(() => products.value?.flatMap((product) => product.variants).filter((variant) => variant.stock < 5).length ?? 0)
</script>
<template><div><p class="text-xs font-bold uppercase tracking-widest text-slate-500">Operations</p><h1 class="mt-2 font-display text-4xl">Dashboard</h1><div class="mt-8 grid gap-4 sm:grid-cols-3"><div class="card p-6"><p class="text-sm text-slate-500">Total products</p><p class="mt-2 text-4xl font-bold">{{ pending ? '—' : products?.length }}</p></div><div class="card p-6"><p class="text-sm text-slate-500">Published</p><p class="mt-2 text-4xl font-bold">{{ pending ? '—' : published }}</p></div><div class="card p-6"><p class="text-sm text-slate-500">Low-stock variants</p><p class="mt-2 text-4xl font-bold">{{ pending ? '—' : lowStock }}</p></div></div><p v-if="error" class="mt-6 rounded-lg bg-rose-50 p-4 text-rose-800">Unable to load dashboard data.</p><div class="mt-8 flex gap-3"><NuxtLink to="/moderator/products/new" class="button-primary">Create product</NuxtLink><NuxtLink to="/moderator/products" class="button-outline">Manage products</NuxtLink></div></div></template>
