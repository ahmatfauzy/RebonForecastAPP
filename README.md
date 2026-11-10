# ProjectForecast

Monorepo for the ProjectForecast React SPA and FastAPI service. Bun manages the JavaScript/TypeScript workspaces, Turborepo runs tasks across apps, and the Python service uses `uv`.

## Structure

- `apps/web`: React + TypeScript single-page app built with Vite.
- `apps/server`: FastAPI service.
- `packages/contracts`: shared TypeScript API contracts, published locally as a Bun workspace package.
- `docs`: project documentation and coding standards.

See [the coding standards](docs/CODE_STANDARDS.md) before contributing.

## Development

Install dependencies with `bun install` and `uv sync --project apps/server`.

Copy `.env.example` to `.env` to configure the web/API host and port, CORS, and application settings. Both Vite and FastAPI read this root file. The frontend proxies `/api` to the configured API host and port during development. Keep private values in `.env`; it is ignored by Git. Never commit credentials or secrets.

- `bun run web` (or `bun run dev:web`) starts only the web app.
- `bun run server` (or `bun run dev:server`) starts only the API.
- `bun run dev` starts both services in Turborepo's interactive task sidebar (use a TTY terminal).
- `bun run build` builds all workspace apps through Turborepo.
- `bun run test` runs frontend and backend tests.
- `bun run lint` runs the backend Ruff checks.
- `bun run api:generate` updates the checked-in OpenAPI schema and generated TypeScript contract.
- `bun run api:check` verifies that the generated contract matches the FastAPI schema.

The API health endpoint is `GET /api/health`.
