<script setup lang="ts">
const submitted = ref(false);
const email = ref("");
const password = ref("");

const submit = () => {
  submitted.value = true;
};
</script>

<template>
  <main class="account-page">
    <img
      class="account-editorial"
      src="/images/editorial/account-fashion.webp"
      alt="Eagle Supply fashion editorial"
    />
    <div class="account-overlay"></div>
    <section class="account-card">
      <p class="eyebrow">Member access</p>
      <h1>WELCOME<br />BACK.</h1>
      <p>
        Sign in to follow the work, save your preferences and eventually manage
        your orders.
      </p>
      <form @submit.prevent="submit">
        <label
          >Email address<input
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            placeholder="you@example.com" /></label
        ><label
          >Password<input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            minlength="12"
            placeholder="At least 12 characters" /></label
        ><button class="add-button" type="submit">
          Sign in <span>→</span>
        </button>
      </form>
      <p v-if="submitted" class="selection-notice" role="status">
        Sign-in is not active yet. This frontend preview does not submit or
        store credentials.
      </p>
      <p class="account-switch">
        New here? <NuxtLink to="/account/create">Create an account</NuxtLink>
      </p>
    </section>
    <p class="account-security">
      When the API is enabled, sessions will use secure HttpOnly cookies and
      server-side rate limits. Passwords are never kept in this browser preview.
    </p>
  </main>
</template>
