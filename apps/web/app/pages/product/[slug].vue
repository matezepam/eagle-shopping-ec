<script setup lang="ts">
const route = useRoute();
await navigateTo(`/products/${String(route.params.slug)}`, { replace: true });
</script>

<template><div /></template>
