# CodeX Introduction

This repository contains a NestJS-based API service focused on financial data. This document highlights the key parts of the project that differ from the default NestJS conventions and explains how to generate new components using the Nest CLI.

## Non‑Conventional Elements

### Prisma Integration
- Prisma is used for database access with PostgreSQL.
- Custom `PrismaService` (in `src/prisma/prisma.service.ts`) extends `PrismaClient` and ensures `DATABASE_URL` is defined at runtime.
- The `schema.prisma` file defines models `Stock`, `Price` and `FetchPlan`.
- Database connection settings are provided via `DATABASE_URL` environment variable (see `.env.example`).

### Scheduled Jobs
- `SchedulerModule` and `SchedulerService` use `@nestjs/schedule` to run cron jobs.
- One job fetches historical stock prices from Yahoo Finance every 30 seconds.
- Another job plans future fetches weekly on Saturdays.

### Yahoo Finance Module
- The `YahooFinanceModule` exposes a service and controller for interacting with the `yahoo-finance2` package.
- Endpoints allow searching for tickers and retrieving historic chart data.

### Swagger Setup
- `src/main.ts` configures Swagger with `SwaggerModule`. API docs are served at `/docs` when the app runs.

### ESLint & Prettier
- Linting rules are defined in `eslint.config.mjs` with the Prettier plugin enabled.
- Prettier formatting options are stored in `.prettierrc` (single quotes and trailing commas).

### Docker Compose for Postgres
- `compose/postgres/compose.yml` provides a PostgreSQL service for local development.

## CLI Usage
The project relies on the Nest CLI to generate boilerplate code. If dependencies are installed locally, you can run the following commands:

```bash
# Generate a module
npx nest g module <name>

# Generate a service
npx nest g service <name>

# Generate a controller
npx nest g controller <name>
```

Replace `<name>` with the desired feature name. The CLI creates files in the `src/` directory according to NestJS conventions.

