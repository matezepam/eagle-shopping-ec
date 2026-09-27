<script setup lang="ts">
import { localCatalog } from "~/features/catalog/catalog.local";

const mostViewed = localCatalog.filter((product) => product.label).slice(0, 10);
</script>

<template>
  <div class="site-shell">
    <main id="top">
      <section class="hero">
        <img
          src="/images/editorial/hero-streetwear.webp"
          alt="Streetwear look featuring a cap and heavyweight T-shirt"
          class="hero-image"
        />
        <div class="hero-shade"></div>
        <div class="hero-copy reveal">
          <p class="eyebrow">Eagle Supply / 001</p>
          <h1>MOVE<br />WITH<br />INTENT.</h1>
          <p class="hero-intro">
            Essential headwear and heavyweight tees for the hours that stay with
            you.
          </p>
          <a class="solid-link" href="#collection">Shop the drop <span>↘</span></a>
        </div>
        <p class="hero-index">01 — 04</p>
      </section>

      <section id="manifesto" class="statement">
        <p class="eyebrow">No borrowed uniform</p>
        <h2>Clothes for people<br />who make their own noise.</h2>
        <p>
          Start with less. Make every piece count. This is the first chapter:
          caps and tees, reduced to their clearest form.
        </p>
      </section>

      <section class="editorial-bridge">
        <img src="/images/editorial/unisex-story.webp" alt="Two models wearing Eagle Supply essentials" loading="lazy" />
        <div class="editorial-copy">
          <p class="eyebrow">Worn in motion / 002</p>
          <h2>THE PRODUCT<br />HAS A LIFE<br />OUTSIDE THE GRID.</h2>
          <p>Every release begins on a person, in the hours it was designed to live through. Meet the uniform before you meet the product.</p>
          <a href="#most-viewed">See the most viewed <span>↘</span></a>
        </div>
        <div class="editorial-notes"><span>Made for repeat wear</span><span>Made to move</span><span>Made to become yours</span></div>
      </section>

      <ProductCollection
        id="most-viewed"
        eyebrow="01 / Most viewed"
        title="THE PIECES PEOPLE KEEP COMING BACK TO."
        copy="The most loved pieces lead the story. The full thirty-piece catalogue waits just beyond them."
        :products="mostViewed"
        dark
      />

      <section class="catalogue-invitation">
        <p class="eyebrow">The complete edit / 30 pieces</p>
        <h2>FIND THE ONE<br />THAT MOVES<br />WITH YOU.</h2>
        <NuxtLink to="/catalog" class="solid-link">Enter the catalogue <span>↘</span></NuxtLink>
      </section>

      <CatalogAfterword />

      <section class="archive-strip">
        <div>
          <span>Made for repeat wear</span><span>—</span
          ><span>Limited first edition</span><span>—</span
          ><span>Designed with intention</span><span>—</span>
        </div>
      </section>
      <section class="closing-image">
        <img
          src="/images/editorial/hero-streetwear.webp"
          alt="Eagle Supply streetwear campaign"
          style="object-position: 58% center"
        />
        <div>
          <p class="eyebrow">Keep moving</p>
          <h2>YOUR<br />UNIFORM<br />STARTS HERE.</h2>
          <a href="#top">Back to top ↑</a>
        </div>
      </section>
    </main>
  </div>
</template>
