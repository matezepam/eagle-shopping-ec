<script setup lang="ts">
import { formatPrice, localCatalog } from "~/features/catalog/catalog.local";
import { useCommerceState } from "~/features/commerce/commerce.state";

const menuOpen = ref(false);
const openPanel = ref<"favorites" | "bag" | null>(null);
const { bag, favoriteIds, quantity, subtotal, addToBag, toggleFavorite } = useCommerceState();
const favorites = computed(() =>
  localCatalog.filter((product) => favoriteIds.value.includes(product.id)),
);
const closeMenu = () => {
  menuOpen.value = false;
  openPanel.value = null;
};
const togglePanel = (panel: "favorites" | "bag") => {
  openPanel.value = openPanel.value === panel ? null : panel;
};
const moveFavoriteToBag = (product: (typeof localCatalog)[number]) => {
  addToBag(product, product.sizes[0] ?? "One size", product.colors[0]?.name ?? "Default");
  toggleFavorite(product.id);
};
</script>

<template>
  <header class="commerce-header">
    <NuxtLink
      to="/"
      class="wordmark"
      aria-label="Eagle Supply home"
      @click="closeMenu"
      >EAGLE<span>SUPPLY</span></NuxtLink
    >
    <nav class="commerce-nav" aria-label="Store navigation">
      <NuxtLink to="/catalog?audience=MEN">Men</NuxtLink
      ><NuxtLink to="/catalog?audience=WOMEN">Women</NuxtLink
      ><NuxtLink to="/catalog?audience=UNISEX">Unisex</NuxtLink>
    </nav>
    <div class="commerce-actions">
      <button class="icon-action favorite-action" type="button" aria-label="Open favorites" :aria-expanded="openPanel === 'favorites'" aria-controls="favorites-panel" @click="togglePanel('favorites')"
        ><svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z"
          /></svg
        ><b v-if="favoriteIds.length">{{ favoriteIds.length }}</b></button
      ><button
        class="icon-action bag-action"
        type="button"
        aria-label="Open shopping bag"
        :aria-expanded="openPanel === 'bag'"
        aria-controls="bag-panel"
        @click="togglePanel('bag')"
        ><svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 8.5h14l-1 11H6l-1-11Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg
        ><b v-if="quantity">{{ quantity }}</b></button
      ><NuxtLink
        class="account-button account-button--ghost"
        to="/account/sign-in"
        >Sign in</NuxtLink
      ><NuxtLink class="account-button" to="/account/create"
        >Create account</NuxtLink
      ><button
        class="commerce-menu"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-store-navigation"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Close" : "Menu" }}
      </button>
    </div>
    <Transition name="quick-panel">
      <section v-if="openPanel === 'favorites'" id="favorites-panel" class="commerce-quick-card" aria-label="Favorites preview">
        <div class="quick-card-head"><span>Favorites</span><NuxtLink to="/favorites" @click="closeMenu">View all</NuxtLink></div>
        <div v-if="favorites.length" class="quick-item-list">
          <article v-for="product in favorites.slice(0, 3)" :key="product.id" class="quick-product">
            <img :src="product.images[0]?.url" :alt="product.images[0]?.alt" />
            <div><NuxtLink :to="`/products/${product.slug}`" @click="closeMenu">{{ product.name }}</NuxtLink><strong>{{ formatPrice(product.price) }}</strong></div>
            <button type="button" @click="moveFavoriteToBag(product)">Add to bag</button>
          </article>
        </div>
        <p v-else class="quick-empty">Your saved pieces will live here.</p>
        <NuxtLink class="quick-total" to="/favorites" @click="closeMenu"><span>Favorites total</span><strong>{{ formatPrice(favorites.reduce((total, product) => total + product.price, 0)) }}</strong></NuxtLink>
      </section>
      <section v-else-if="openPanel === 'bag'" id="bag-panel" class="commerce-quick-card" aria-label="Bag preview">
        <div class="quick-card-head"><span>Your bag</span><NuxtLink to="/bag" @click="closeMenu">Open bag</NuxtLink></div>
        <div v-if="bag.length" class="quick-item-list">
          <article v-for="item in bag.slice(0, 3)" :key="item.lineId" class="quick-product">
            <img v-if="item.image" :src="item.image" :alt="item.imageAlt" />
            <div><NuxtLink :to="`/products/${item.slug}`" @click="closeMenu">{{ item.name }}</NuxtLink><strong>{{ item.quantity }} × {{ formatPrice(item.price) }}</strong></div>
          </article>
        </div>
        <p v-else class="quick-empty">Your bag is ready when you are.</p>
        <NuxtLink class="quick-total" to="/bag" @click="closeMenu"><span>Total</span><strong>{{ formatPrice(subtotal) }}</strong></NuxtLink>
      </section>
    </Transition>
    <nav
      v-if="menuOpen"
      id="mobile-store-navigation"
      class="commerce-mobile-nav"
      aria-label="Mobile store navigation"
    >
      <NuxtLink to="/" @click="closeMenu">Home</NuxtLink
      ><NuxtLink to="/catalog?audience=MEN" @click="closeMenu">Men</NuxtLink
      ><NuxtLink to="/catalog?audience=WOMEN" @click="closeMenu">Women</NuxtLink
      ><NuxtLink to="/catalog?audience=UNISEX" @click="closeMenu"
        >Unisex</NuxtLink
      ><NuxtLink to="/favorites" @click="closeMenu"
        >Favorites ({{ favoriteIds.length }})</NuxtLink
      ><NuxtLink to="/bag" @click="closeMenu"
        >Bag ({{ quantity }})</NuxtLink
      ><NuxtLink to="/account/sign-in" @click="closeMenu">Sign in</NuxtLink
      ><NuxtLink to="/account/create" @click="closeMenu"
        >Create account</NuxtLink
      >
    </nav>
  </header>
</template>
