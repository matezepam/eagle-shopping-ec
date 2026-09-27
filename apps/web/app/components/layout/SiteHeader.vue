<script setup lang="ts">
const { user, logout } = useAuth()
const open = ref(false)
async function signOut() { await logout(); await navigateTo('/') }
</script>
<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-sand/95 backdrop-blur"><div class="shell flex h-16 items-center justify-between gap-5">
    <NuxtLink to="/" class="font-display text-xl font-bold tracking-tight">SHOPPING EAGLE</NuxtLink>
    <nav class="hidden items-center gap-6 text-sm font-medium md:flex"><NuxtLink to="/catalog">Shop</NuxtLink><NuxtLink to="/catalog?category=t-shirts">T-shirts</NuxtLink><NuxtLink to="/catalog?category=caps">Caps</NuxtLink></nav>
    <div class="hidden items-center gap-3 md:flex"><NuxtLink v-if="user?.role === 'MODERATOR'" to="/moderator" class="text-sm font-semibold">Moderator</NuxtLink><NuxtLink v-if="!user" to="/login" class="button-outline">Sign in</NuxtLink><button v-else class="button-outline" @click="signOut">Sign out</button></div>
    <button class="md:hidden" aria-label="Open navigation" @click="open = !open">Menu</button>
  </div><nav v-if="open" class="shell flex flex-col gap-4 border-t border-slate-200 py-4 text-sm md:hidden"><NuxtLink to="/catalog" @click="open = false">Shop</NuxtLink><NuxtLink v-if="user?.role === 'MODERATOR'" to="/moderator" @click="open = false">Moderator</NuxtLink><NuxtLink v-if="!user" to="/login" @click="open = false">Sign in</NuxtLink><button v-else class="text-left" @click="signOut">Sign out</button></nav>
  </header>
</template>
