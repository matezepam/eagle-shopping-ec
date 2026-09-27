# Run with Podman

The frontend has a reproducible production container. It needs only Podman; Node.js and the local `node_modules` folder are not used by the running container.

Use the native Podman engine (the most portable option):

```bash
cd /home/matezepam/Downloads/shopping-eagle
podman build -t localhost/shopping-eagle-web:latest -f Containerfile .
podman run --rm -p 3000:3000 localhost/shopping-eagle-web:latest
```

Open `http://localhost:3000`. Stop it with `Ctrl+C`.

If the host has the Podman Compose provider configured, the equivalent stack command is:

```bash
cd /home/matezepam/Downloads/shopping-eagle
podman compose -f podman-compose.yml up --build
```

Stop the Compose stack with:

```bash
podman compose -f podman-compose.yml down
```

For environments that install the standalone Compose wrapper instead of the Podman subcommand, replace `podman compose` with `podman-compose`.

This container intentionally runs only the Nuxt frontend in the current phase. PostgreSQL and the GraphQL API will be added to the Podman stack when the backend phase starts; the browser does not persist catalogue or account data in the meantime.
