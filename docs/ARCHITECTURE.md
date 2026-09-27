# V1 architecture decisions

The application is split into a GraphQL API (`apps/api`) and a Nuxt client (`apps/web`). The browser consumes the GraphQL contract; Prisma and PostgreSQL remain isolated in the API. Read-only HTTP routes under `/api` are a small compatibility layer and reuse the same domain services.

Each API domain has its own service, validation, and resolver. Resolvers contain no business rules and services do not depend on HTTP or GraphQL. This boundary allows Auth, Products, Inventory, or Media to be extracted later while preserving contracts and audit events.

Inventory is exclusively represented by `ProductVariant.stock`. Updates reject negative quantities. Images are ordered URL references, so a future S3/Cloudinary integration will not change the model.

A signed JWT is held only in an HttpOnly cookie. Production requires `Secure`, an explicit CORS origin, Helmet, a body-size limit, login rate limiting, and limited GraphQL query depth. Defence in depth does not replace a production security review.
