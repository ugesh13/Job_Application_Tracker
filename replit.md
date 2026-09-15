# Momentum Job Tracker

Momentum is a calm job search workspace that turns every application into a visible next action.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/momentum-job-tracker/src/App.tsx` — responsive workspace, board, search, insights, alerts, and profile screens.
- `artifacts/momentum-job-tracker/src/index.css` — warm woodblock-inspired visual system and motion utilities.
- `lib/api-spec/openapi.yaml` — source of truth for job, dashboard, profile, and alert API contracts.
- `artifacts/api-server/src/routes/` — Express route handlers.
- `lib/db/src/schema/` — Drizzle models for jobs, profiles, and alerts.

## Architecture decisions

- The job card treats `nextAction` and `nextActionDate` as first-class fields so a tracker can create momentum rather than only record status.
- The board is a five-stage pipeline (`wishlist`, `applied`, `interview`, `offer`, `rejected`) and stage changes update the time-in-stage signal.
- The frontend uses generated hooks from the OpenAPI contract and keeps the API server shared under `/api`.

## Product

- Drag or select applications between stages, with compact cards and a detail drawer for context.
- Search and filter roles by keyword, location, industry, compensation, experience, job type, saved state, and sort order.
- See response rate, interviews, applications, weekly activity, recent activity, and roles needing action.
- Create job alerts, save roles, add applications, edit next actions, delete applications, and update profile details.

## User preferences

The product should feel calm and encouraging, with deliberate warmth and no urgency-red productivity tone.

## Gotchas

- API contracts must be regenerated with `pnpm --filter @workspace/api-spec run codegen` after edits to `lib/api-spec/openapi.yaml`.
- This first build ships with a seeded personal workspace. Auth provider setup can be added when a managed auth tenant is enabled.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
