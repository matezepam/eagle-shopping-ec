<script setup lang="ts">
import type { ProductMedia } from "~/features/catalog/catalog.local";

const props = withDefaults(
  defineProps<{ images: ProductMedia[]; compact?: boolean }>(),
  { compact: false },
);
const activeIndex = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.images.length;
};
const previous = () => {
  activeIndex.value =
    (activeIndex.value - 1 + props.images.length) % props.images.length;
};
const select = (index: number) => {
  activeIndex.value = index;
  pause();
};
const start = () => {
  if (props.images.length > 1 && !interval) interval = setInterval(next, 3600);
};
const pause = () => {
  if (interval) clearInterval(interval);
  interval = undefined;
};

onMounted(start);
onBeforeUnmount(pause);
</script>

<template>
  <div
    class="media-carousel"
    :class="{ 'media-carousel--compact': compact }"
    @mouseenter="pause"
    @mouseleave="start"
    @focusin="pause"
    @focusout="start"
  >
    <TransitionGroup name="media-frame"
      ><img
        v-for="(image, index) in images"
        v-show="index === activeIndex"
        :key="image.id"
        :src="image.url"
        :alt="image.alt"
        :style="{ objectPosition: image.position }"
    /></TransitionGroup>
    <template v-if="images.length > 1">
      <div class="media-arrows" aria-label="Product image controls">
        <button type="button" aria-label="Previous product image" @click="previous">
          ←
        </button>
        <button type="button" aria-label="Next product image" @click="next">→</button>
      </div>
      <div class="media-dots" aria-label="Product image views">
        <button
          v-for="(image, index) in images"
          :key="image.id"
          type="button"
          :class="{ active: index === activeIndex }"
          :aria-label="`Show product image ${index + 1}`"
          @click="select(index)"
        ></button>
      </div>
    </template>
  </div>
</template>
