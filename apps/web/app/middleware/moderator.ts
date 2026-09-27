export default defineNuxtRouteMiddleware(async () => { const { refresh } = useAuth(); const user = await refresh(); if (user?.role !== 'MODERATOR') return navigateTo('/login') })
