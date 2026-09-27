<script setup lang="ts">
import { localCatalog } from "~/features/catalog/catalog.local";
</script>

<template>
  <div class="catalog-page">
    <section class="catalog-intro">
      <p class="eyebrow">Eagle Supply / Collection 001</p>
      <h1>THE<br />FIRST<br />UNIFORM.</h1>
      <p>
        Headwear and heavyweight tees, built around repeat wear. Filter the
        collection by audience, colour and price.
      </p>
    </section>
    <ProductCollection
      id="collection"
      eyebrow="01 / The full collection"
      title="THE PIECES WORTH KEEPING."
      copy="The strongest pieces lead the drop. Browse the full thirty-piece catalogue, ten at a time."
      :products="localCatalog"
      dark
    />
    <CatalogAfterword />
  </div>
</template>
