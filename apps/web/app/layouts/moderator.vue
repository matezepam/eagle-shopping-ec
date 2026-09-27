<template>
  <div class="moderator-shell">
    <div class="utility-bar">
      <span>Worldwide shipping</span><span>Built for daily miles</span
      ><span>Edition 001</span>
    </div>
    <CommerceHeader /><ModeratorNav />
    <main class="moderator-content"><slot /></main>
    <CommerceFooter />
  </div>
</template>
