# Copilot instructions (05-NOC)

## Big picture (how code is organized)
- Entry point is `src/app.ts`: loads envs, connects Mongo via `MongoDatabase.connect()`, and (optionally) starts the orchestrator (`Server.start()` is currently commented).
- “Clean Architecture”-style layering:
  - `src/domain/**`: entities + repository/datasource abstractions + use-cases. Keep this layer framework/IO-free.
  - `src/infrastructure/**`: implementations of domain abstractions (e.g., filesystem log datasource).
  - `src/presentation/**`: wiring/orchestration (cron jobs, email service, server bootstrap).
  - `src/data/mongo/**`: Mongo connection and (currently unused) mongoose schema/model definitions.

## Local workflow (commands that matter)
- Configure env: copy `.env.template` → `.env` and fill `MAILER_*` and `MONGO_*` vars (validated in `src/config/plugins/envs.plugin.ts`).
- Start Mongo (optional but `src/app.ts` currently requires it): `docker compose up -d` (maps host `27019` → container `27017`).
  - Ensure `MONGO_URL` matches that mapping (commonly `mongodb://<user>:<pass>@localhost:27019`).
- Run locally: `npm run dev` (ts-node-dev / `tsnd` runs `src/app.ts`).
- Build: `npm run build` (outputs `dist/`). Run: `npm start`.

## Project conventions & patterns (use these)
- Logging is done via the domain entity `LogEntity` and persisted through `LogRepository`.
  - Example producers: `src/domain/use-cases/checks/check-service.ts`, `src/domain/use-cases/email/send-email-logs.ts`.
  - Wiring happens in `src/presentation/server.ts` (repository + services are composed here).
- Filesystem log persistence is the default implementation:
  - `src/infrastructure/datasources/file-system.datasource.ts` writes JSON Lines to `logs/logs-low.log`, `logs/logs-medium.log`, `logs/logs-high.log`.
  - “low” receives every log; “medium/high” are conditional on `LogSeverityLevel`.
- Cron jobs use a tiny wrapper: `src/presentation/cron/cron-service.ts` (`cronService.createJob(cronTime, onTick)`).
  - The sample schedule + URL check wiring lives in commented code in `src/presentation/server.ts`.

## Integrations / external dependencies
- Email is sent via nodemailer in `src/presentation/email/email.service.ts` (configured from `envs`).
- HTTP checks use `node-fetch` in `src/domain/use-cases/checks/check-service.ts`.
- Mongo is connected via mongoose (`src/data/mongo/init.ts`).

## Extending the system (where to put new code)
- New behavior: add a use-case in `src/domain/use-cases/<area>/...` that depends on domain abstractions (`LogRepository`, etc.), not on concrete IO.
- New persistence or integrations: implement a `LogDataSource` in `src/infrastructure/datasources/**` and wrap it with `logRepositoryImpl` (`src/infrastructure/repositories/log.repository.impl.ts`).
- New wiring/runtime behavior: compose the concrete implementations in `src/presentation/server.ts`.
- Env vars: add/validate them only in `src/config/plugins/envs.plugin.ts` (avoid ad-hoc `process.env` reads elsewhere).

## Notes about Mongo code
- `src/data/mongo/models/log.model.ts` currently only declares a schema and is not exported/used. If adding Mongo-backed logging, you’ll likely need to export a mongoose model and add a datasource implementation that uses it.
