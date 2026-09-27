<script setup lang="ts">
import { formatPrice, productBySlug } from "~/features/catalog/catalog.local";
import { useCommerceState } from "~/features/commerce/commerce.state";

const { bag, subtotal, removeFromBag, setQuantity, isFavorite, toggleFavorite } = useCommerceState();
const productFor = (slug: string) => productBySlug(slug);
</script>

<template>
  <main class="commerce-page">
    <section class="commerce-page-head">
      <p class="eyebrow">Your selection</p>
      <h1>YOUR<br />BAG.</h1>
      <p>
        Review your items before checkout. You will be asked to sign in only
        when you are ready to place an order.
      </p>
    </section>
    <section v-if="bag.length" class="bag-list">
      <article v-for="item in bag" :key="item.lineId" class="bag-line">
        <div class="bag-card-media">
          <ProductMediaCarousel v-if="productFor(item.slug)" :images="productFor(item.slug)!.images" compact />
          <img v-else-if="item.image" :src="item.image" :alt="item.imageAlt" />
          <NuxtLink :to="`/products/${item.slug}`" class="bag-media-link" :aria-label="`View ${item.name}`" />
          <button v-if="productFor(item.slug)" class="favorite-toggle" type="button" :class="{ active: isFavorite(productFor(item.slug)!.id) }" :aria-label="`${isFavorite(productFor(item.slug)!.id) ? 'Remove' : 'Add'} ${item.name} ${isFavorite(productFor(item.slug)!.id) ? 'from' : 'to'} favorites`" @click="toggleFavorite(productFor(item.slug)!.id)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z" /></svg>
          </button>
        </div>
        <div class="bag-product-card"><span>{{ item.name }}</span><small>{{ item.color }} · {{ item.size }}</small><p>{{ productFor(item.slug)?.description }}</p></div>
        <div class="quantity-control">
          <button
            :aria-label="`Decrease ${item.name} quantity`"
            @click="setQuantity(item.lineId, item.quantity - 1)"
          >
            −</button
          ><span>{{ item.quantity }}</span
          ><button
            :aria-label="`Increase ${item.name} quantity`"
            @click="setQuantity(item.lineId, item.quantity + 1)"
          >
            +
          </button>
        </div>
        <strong>{{ formatPrice(item.price * item.quantity) }}</strong
        ><button class="line-remove" @click="removeFromBag(item.lineId)">
          Remove
        </button>
      </article>
      <div class="bag-total">
        <span>Subtotal</span><strong>{{ formatPrice(subtotal) }}</strong
        ><small>Taxes and delivery are calculated at checkout.</small
        ><NuxtLink class="checkout-link" to="/account/sign-in"
          >Sign in to checkout <span>→</span></NuxtLink
        >
      </div>
    </section>
    <section v-else class="commerce-empty">
      <p class="eyebrow">Nothing selected yet</p>
      <h2>YOUR BAG IS<br />WAITING.</h2>
      <NuxtLink class="checkout-link" to="/catalog"
        >Explore collection <span>→</span></NuxtLink
      >
    </section>
  </main>
</template>
