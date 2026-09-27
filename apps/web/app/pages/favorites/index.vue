<script setup lang="ts">
import { localCatalog } from "~/features/catalog/catalog.local";
import { useCommerceState } from "~/features/commerce/commerce.state";

const { favoriteIds, isFavorite, toggleFavorite } = useCommerceState();
const favorites = computed(() =>
  localCatalog.filter((product) => favoriteIds.value.includes(product.id)),
);
</script>

<template>
  <main class="commerce-page">
    <section class="commerce-page-head">
      <p class="eyebrow">Saved for later</p>
      <h1>YOUR<br />FAVORITES.</h1>
      <p>
        Keep a considered shortlist while you browse. It stays available during
        this visit without requiring an account.
      </p>
    </section>
    <section v-if="favorites.length" class="product-grid favorites-grid">
      <article
        v-for="product in favorites"
        :key="product.id"
        class="catalog-card"
      >
        <NuxtLink :to="`/products/${product.slug}`" class="catalog-photo"
          ><ProductMediaCarousel :images="product.images" compact /></NuxtLink
        ><button
          class="favorite-toggle active"
          type="button"
          :aria-label="`Remove ${product.name} from favorites`"
          @click="toggleFavorite(product.id)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z"
            />
          </svg></button
        ><NuxtLink :to="`/products/${product.slug}`" class="catalog-info"
          ><div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.tone }}</p>
          </div></NuxtLink
        >
      </article>
    </section>
    <section v-else class="commerce-empty">
      <p class="eyebrow">No saved items</p>
      <h2>KEEP THE<br />GOOD ONES<br />CLOSE.</h2>
      <NuxtLink class="checkout-link" to="/catalog"
        >Explore collection <span>→</span></NuxtLink
      >
    </section>
  </main>
</template>
