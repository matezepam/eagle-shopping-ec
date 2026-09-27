<script setup lang="ts">
import {
  formatPrice,
  type Audience,
  type LocalProduct,
  type ProductKind,
} from "~/features/catalog/catalog.local";
import { useCommerceState } from "~/features/commerce/commerce.state";

const props = defineProps<{
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  products: LocalProduct[];
  dark?: boolean;
}>();

const route = useRoute();
const audience = ref<"ALL" | Audience>("ALL");
const color = ref("ALL");
const kind = ref<"ALL" | ProductKind>("ALL");
const page = ref(1);
const itemsPerPage = 10;
const priceCap = ref(1000);
const pricePresets = [25, 50, 100, 250];
const { isFavorite, toggleFavorite, addToBag } = useCommerceState();

const audiences = computed(() => [...new Set(props.products.map((item) => item.audience))]);
const colors = computed(() => {
  const tones = props.products.flatMap((item) => item.colors);
  return [...new Map(tones.map((tone) => [tone.name, tone])).values()];
});
const kinds = computed(() => [...new Set(props.products.map((item) => item.kind))]);
const kindLabel = (value: ProductKind) => value.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

const resetFilters = () => {
  audience.value = "ALL";
  color.value = "ALL";
  kind.value = "ALL";
  priceCap.value = 1000;
};

watch(
  () => route.query.audience,
  (value) => {
    const next = String(value ?? "ALL").toUpperCase() as Audience | "ALL";
    audience.value = next === "MEN" || next === "WOMEN" || next === "UNISEX" ? next : "ALL";
  },
  { immediate: true },
);
watch(
  () => route.query.category,
  (value) => {
    const category = String(value ?? "").toUpperCase();
    kind.value = category === "CAPS" ? "CAPS" : category === "T-SHIRTS" ? "T_SHIRTS" : "ALL";
  },
  { immediate: true },
);

const results = computed(() =>
  props.products
    .filter((item) => {
      const matchesAudience = audience.value === "ALL" || item.audience === audience.value || (audience.value !== "UNISEX" && item.audience === "UNISEX");
      return matchesAudience && (color.value === "ALL" || item.colors.some((tone) => tone.name === color.value)) && (kind.value === "ALL" || item.kind === kind.value) && item.price <= priceCap.value;
    })
    .sort((left, right) => Number(Boolean(right.label)) - Number(Boolean(left.label))),
);
const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / itemsPerPage)));
const pagedResults = computed(() => results.value.slice((page.value - 1) * itemsPerPage, page.value * itemsPerPage));

watch([audience, color, kind, priceCap], () => {
  page.value = 1;
});
watch(pageCount, (count) => {
  if (page.value > count) page.value = count;
});

const quickAdd = (product: LocalProduct) => {
  addToBag(product, product.sizes[0] ?? "One size", product.colors[0]?.name ?? "Default");
};

const campaign = computed(() => {
  if (audience.value === "WOMEN") return { label: "Women / 001", title: "OWN THE FRAME.", image: "/images/editorial/women-collection.webp", alt: "Woman wearing Eagle Supply collection" };
  if (audience.value === "MEN") return { label: "Men / 001", title: "MOVE AFTER DARK.", image: "/images/editorial/hero-streetwear.webp", alt: "Man wearing Eagle Supply collection" };
  return { label: "Unisex / 001", title: "MADE FOR BOTH DIRECTIONS.", image: "/images/editorial/unisex-story.webp", alt: "Models wearing Eagle Supply collection" };
});
</script>

<template>
  <section :id="id" class="collection-section" :class="{ 'dark-section': dark, 'light-section': !dark }">
    <div class="section-head">
      <div><p class="eyebrow">{{ eyebrow }}</p><h2>{{ title }}</h2></div>
      <p>{{ copy }}</p>
    </div>

    <section class="collection-campaign" :class="`collection-campaign--${audience.toLowerCase()}`" aria-label="Collection campaign">
      <img :src="campaign.image" :alt="campaign.alt" loading="lazy" />
      <img v-if="audience === 'ALL'" src="/images/editorial/women-collection.webp" alt="Woman wearing Eagle Supply collection" loading="lazy" />
      <div><p class="eyebrow">{{ campaign.label }}</p><h3>{{ campaign.title }}</h3></div>
    </section>

    <div class="catalog-layout">
      <aside class="filter-dock" aria-label="Product filters">
        <div class="filter-dock-head"><span>Refine collection</span><button type="button" @click="resetFilters">Reset</button></div>
        <label><span>Audience</span><select v-model="audience"><option value="ALL">All</option><option v-for="item in audiences" :key="item" :value="item">{{ item.toLowerCase() }}</option></select></label>
        <label><span>Product type</span><select v-model="kind"><option value="ALL">All pieces</option><option v-for="item in kinds" :key="item" :value="item">{{ kindLabel(item) }}</option></select></label>
        <div class="filter-colours"><span>Colour</span><div><button type="button" class="filter-colour-all" :class="{ active: color === 'ALL' }" @click="color = 'ALL'">All</button><button v-for="tone in colors" :key="tone.name" type="button" class="filter-colour" :class="{ active: color === tone.name }" :style="{ '--filter-colour': tone.hex }" :aria-label="`Filter by ${tone.name}`" :title="tone.name" @click="color = tone.name"></button></div></div>
        <div class="filter-price"><div><span>Up to</span><strong>{{ formatPrice(priceCap) }}</strong></div><div class="price-presets"><button v-for="amount in pricePresets" :key="amount" type="button" :class="{ active: priceCap === amount }" @click="priceCap = amount">${{ amount }}</button></div><label class="custom-price"><span>Custom</span><input v-model.number="priceCap" type="number" min="0" max="1000" step="5" @blur="priceCap = Math.min(1000, Math.max(0, Number(priceCap) || 0))" /></label></div>
      </aside>

      <div class="catalog-results">
        <div class="catalog-results-head"><span>{{ results.length }} pieces</span><span>Page {{ page }} of {{ pageCount }}</span></div>
        <div class="product-grid instagram-grid">
          <article v-for="product in pagedResults" :key="product.id" class="catalog-card instagram-card">
            <div class="catalog-photo instagram-photo">
              <ProductMediaCarousel :images="product.images" compact />
              <NuxtLink :to="`/products/${product.slug}`" class="card-image-link" :aria-label="`View ${product.name}`" />
              <span v-if="product.label">{{ product.label }}</span>
              <button class="favorite-toggle" type="button" :class="{ active: isFavorite(product.id) }" :aria-label="`${isFavorite(product.id) ? 'Remove' : 'Add'} ${product.name} ${isFavorite(product.id) ? 'from' : 'to'} favorites`" @click="toggleFavorite(product.id)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z" /></svg></button>
            </div>
            <div class="instagram-info">
              <div><p>{{ product.audience.toLowerCase() }} · {{ kindLabel(product.kind) }}</p><h3>{{ product.name }}</h3></div>
              <strong>{{ formatPrice(product.price) }}</strong>
              <p class="instagram-description">{{ product.description }}</p>
              <div class="instagram-actions"><NuxtLink :to="`/products/${product.slug}`">View details</NuxtLink><button type="button" @click="quickAdd(product)">Buy now <span>+</span></button></div>
            </div>
          </article>
        </div>
        <nav v-if="pageCount > 1" class="pagination" aria-label="Catalog pages"><button type="button" :disabled="page === 1" aria-label="Previous page" @click="page -= 1">←</button><button v-for="number in pageCount" :key="number" type="button" :class="{ active: page === number }" :aria-label="`Page ${number}`" :aria-current="page === number ? 'page' : undefined" @click="page = number">{{ number }}</button><button type="button" :disabled="page === pageCount" aria-label="Next page" @click="page += 1">→</button></nav>
        <p v-if="!results.length" class="empty-state">No pieces match these filters. Reset them and try again.</p>
      </div>
    </div>
  </section>
</template>
