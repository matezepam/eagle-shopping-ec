<script setup lang="ts">
import { formatPrice, productBySlug } from "~/features/catalog/catalog.local";
import { useCommerceState } from "~/features/commerce/commerce.state";

const route = useRoute();
const product = productBySlug(String(route.params.slug));

if (!product) {
  throw createError({ statusCode: 404, statusMessage: "Product not found" });
}

const selectedSize = ref(product.sizes[0] ?? "");
const selectedColor = ref(product.colors[0]?.name ?? "");
const notice = ref("");
const { addToBag, isFavorite, toggleFavorite } = useCommerceState();

const selectForBag = () => {
  addToBag(product, selectedSize.value, selectedColor.value);
  notice.value =
    "Added to your bag. You can keep browsing or review your total.";
};
</script>

<template>
  <div class="product-page">
    <main>
      <NuxtLink class="detail-return" to="/catalog"
        >← Back to collection</NuxtLink
      >
      <section class="product-hero-detail">
        <div class="product-editorial">
          <ProductMediaCarousel :images="product.images" /><span>{{
            product.kind === "CAPS"
              ? "Headwear / 001"
              : "Heavyweight jersey / 001"
          }}</span>
        </div>
        <div class="product-buy-panel">
          <p class="eyebrow">{{ product.audience }} / Edition 001</p>
          <div class="product-title-row">
            <h1>{{ product.name }}</h1>
            <button
              class="product-favorite"
              type="button"
              :class="{ active: isFavorite(product.id) }"
              :aria-label="`${isFavorite(product.id) ? 'Remove' : 'Add'} ${product.name} ${isFavorite(product.id) ? 'from' : 'to'} favorites`"
              @click="toggleFavorite(product.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z"
                />
              </svg>
            </button>
          </div>
          <p class="product-lede">{{ product.description }}</p>
          <div class="price-line">
            <strong>{{ formatPrice(product.price) }}</strong
            ><del v-if="product.previousPrice">{{
              formatPrice(product.previousPrice)
            }}</del
            ><span v-if="product.previousPrice">Archive price</span>
          </div>

          <div class="option-group">
            <div class="option-label">
              <span>Colour</span><strong>{{ selectedColor }}</strong>
            </div>
            <div class="swatch-row">
              <button
                v-for="colour in product.colors"
                :key="colour.name"
                :class="{ selected: selectedColor === colour.name }"
                :style="{ '--swatch': colour.hex }"
                :aria-label="`Choose ${colour.name}`"
                @click="selectedColor = colour.name"
              ></button>
            </div>
          </div>
          <div class="option-group">
            <div class="option-label">
              <span>{{ product.kind === "CAPS" ? "Fit" : "Size" }}</span
              ><strong>{{ selectedSize }}</strong>
            </div>
            <div class="size-row detail-sizes">
              <button
                v-for="size in product.sizes"
                :key="size"
                :class="{ chosen: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>
          <details class="product-meta-accordion">
            <summary>Product details <span>+</span></summary>
            <ul class="spec-list">
              <li v-for="detail in product.details" :key="detail">
                {{ detail }}
              </li>
            </ul>
          </details>
          <button class="add-button" @click="selectForBag">
            Add to bag <span>+</span>
          </button>
          <p v-if="notice" class="selection-notice" role="status">
            {{ notice }}
          </p>
        </div>
      </section>

      <section class="product-segments" aria-label="Product information">
        <article class="product-story">
          <p class="eyebrow">The story</p>
          <h2>{{ product.story }}</h2>
          <p>
            Made as a considered first layer for the rhythms between work,
            travel and whatever comes next. The collection is intentionally
            compact: fewer pieces, better purpose.
          </p>
        </article>
        <article>
          <p class="eyebrow">Fit & sizing</p>
          <h2>
            {{
              product.kind === "CAPS"
                ? "One profile, adjustable finish."
                : "A relaxed, considered silhouette."
            }}
          </h2>
          <p>
            Available options: {{ product.sizes.join(" / ") }}. Choose your
            preferred fit above; precise garment measurements will be served
            from the product system when the catalogue is connected.
          </p>
        </article>
        <article>
          <p class="eyebrow">Care & returns</p>
          <h2>Made to stay in rotation.</h2>
          <p>
            Care guidance and return eligibility will be confirmed alongside the
            purchase policy at checkout. No order or personal data is collected
            by this local preview.
          </p>
        </article>
      </section>
    </main>
  </div>
</template>
