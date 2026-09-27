<script setup lang="ts">
const submitted = ref(false);
const form = reactive({ name: "", email: "", password: "", accepted: false });

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
      <h1>MAKE IT<br />YOURS.</h1>
      <p>
        Create an account to be ready for future releases, order history and
        member-only updates.
      </p>
      <form @submit.prevent="submit">
        <label
          >Full name<input
            v-model.trim="form.name"
            type="text"
            autocomplete="name"
            required
            maxlength="100"
            placeholder="Your name" /></label
        ><label
          >Email address<input
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            required
            placeholder="you@example.com" /></label
        ><label
          >Password<input
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            required
            minlength="12"
            placeholder="At least 12 characters" /></label
        ><label class="consent"
          ><input v-model="form.accepted" type="checkbox" required /><span
            >I agree to the <NuxtLink to="/legal/terms">terms</NuxtLink> and
            <NuxtLink to="/legal/privacy">privacy policy</NuxtLink>.</span
          ></label
        ><button class="add-button" type="submit">
          Create account <span>→</span>
        </button>
      </form>
      <p v-if="submitted" class="selection-notice" role="status">
        Account creation is not active yet. This preview validates in the
        browser but never transmits or stores your information.
      </p>
      <p class="account-switch">
        Already a member? <NuxtLink to="/account/sign-in">Sign in</NuxtLink>
      </p>
    </section>
    <p class="account-security">
      The production account flow will validate inputs, use Argon2id hashes,
      secure cookies, CSRF protections and rate limits on the backend.
    </p>
  </main>
</template>
