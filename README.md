# ProjectForecast

Monorepo for the ProjectForecast React SPA and FastAPI service. Bun manages the JavaScript/TypeScript workspaces; the Python service uses `uv`.

## Structure

- `apps/web`: React + TypeScript single-page app built with Vite.
- `apps/server`: FastAPI service.
- `packages/contracts`: shared TypeScript API contracts, published locally as a Bun workspace package.

## Development

Install dependencies with `bun install` and `uv sync --project apps/server`.

- `bun run dev:web` starts the web app at Vite's local URL.
- `bun run dev:server` starts the API at `http://127.0.0.1:8000`.
- `bun run dev` starts both services.

The API health endpoint is `GET /api/health`.
