export default defineNuxtConfig({
  srcDir: "app/",
  css: [
    "~/assets/css/main.css",
    "~/assets/css/storefront.css",
    "~/assets/css/theme.css",
    "~/assets/css/interactions.css",
  ],
  modules: ["@nuxtjs/tailwindcss"],
  components: [{ path: "~/components", pathPrefix: false }],
  typescript: {
    strict: true,
    typeCheck: process.env.NODE_ENV === "production",
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL || "/api/graphql",
    },
  },
  vite: {
    server: {
      proxy: {
        "/api": { target: "http://localhost:4000", changeOrigin: true },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Shopping Eagle",
      meta: [
        { name: "description", content: "Premium apparel made with care." },
      ],
    },
  },
});
