## Quick context

This is FITSCH — a SolidStart + SolidJS scheduler web app (TypeScript) for planning university lectures. It uses Vinxi (SolidStart meta-framework) + Vite, Tailwind CSS, and a collection of custom providers and stores under `src/`.

Keep guidance short and actionable: target `src/providers`, `src/store`, `src/routes`, and `src/server` for most changes.

## Key commands (use pnpm)

- Development: `pnpm run dev` (runs `vinxi dev`, dev server usually on :3000)
- Build: `pnpm run build`; Netlify preset: `pnpm run build-netlify`
- Start production server (after build): `pnpm start`
- Tests: `pnpm test` (run once), `pnpm test-watch`, `pnpm test-ui`
- Lint/format: `pnpm run lint`, `pnpm run lint-fix`, `pnpm run prettier`
- Typecheck: `pnpm run tscheck` (fast noEmit tsc run with exclusions)

Always use `pnpm install` to respect `pnpm`-specific patches and workspace config. Two deps are patched via `pnpm` in `package.json` -> `patchedDependencies` (see `patches/solid-gesture.patch`, `patches/solid-forms.patch`).

## Big-picture architecture (where to look)

- Entry points: `src/app.tsx` (providers composition & FileRoutes), `src/entry-client.tsx`, `src/entry-server.tsx`.
- Routing: file-based routes in `src/routes/` exposed via `<FileRoutes />`.
- Global state: `src/store/` (SchedulerStore, DataStore, storeSchema\*). Scheduling logic primarily lives in `src/store` and `src/components/scheduler/`.
- Providers: `src/providers/` (InstallationProvider, SchedulerProvider, PosthogProvider). Providers are composed in `src/app.tsx` — use that file to see provider order and injected contexts.
- Server side: `src/server/` contains scraper and server functions; scraper uses `cheerio` to parse university pages (`src/server/scraper`).
- Plugins/cache: `src/plugins/cache.ts` contains server-side caching helpers tied to data fetching.

When asked to change UI + data flow, read `src/app.tsx` -> provider -> `src/routes/*` -> `components/*` and `store/*` in that order.

## Project-specific patterns & conventions

- Aliases: `~` is aliased to `/src` (see `vitest.config.ts` and Vite config). Use `~/path` imports.
- File-based routes: adding a page == add file in `src/routes/`.
- Providers-first composition: application-wide contexts are provided via `MultiProvider` in `src/app.tsx` — keep provider order when adding new providers unless isolated.
- Persistence: local storage is used for persisting user selections (see `@solid-primitives/storage` usage and `src/store/*` for schema versions). Look at `storeSchema-v1.ts`/`v2` to understand persisted shape.
- Naming: the project uses domain terms like `program`, `degree`, `grade`, `semester` consistently. The menu order matters (see README "study overview" section and `src/components/menu/schema.ts`).
- Patched deps: `solid-gesture` and `solid-forms` are patched — if you bump versions adapt `patches/` and `pnpm` config.

## Integration points & external services

- PostHog analytics: `posthog-js` used via `src/providers/PosthogProvider.tsx`. Events are optional; follow existing `track` calls when adding telemetry.
- Server scraper: `src/server/scraper/*` fetches and mutates course HTML using `cheerio`. Changes here affect course data shape consumed by stores.
- Deploy: Netlify preset supported (`build-netlify`). Dockerfile exists for container builds.

## Tests and where to add them

- Unit and integration tests use `vitest` and `@solidjs/testing-library`. Look for `*.test.ts` and `*.test.tsx` across `src/` (examples: `src/store/store.test.ts`, `src/lib/date.test.ts`).
- Tests run with `pnpm test`. For UI work add tests under the same directory as the feature.

## Troubleshooting hints

- If dev build fails after dependency changes, run `pnpm install` to reapply patches. Inspect `patches/` and `package.json` patchedDependencies.
- If a provider value is undefined in the tree, confirm `src/app.tsx` provider order and that components run inside the provider tree.
- For routing mismatches, ensure filename in `src/routes/` matches route conventions and that `FileRoutes` picks it up.

## Files to inspect for most tasks (quick reference)

- app composition: `src/app.tsx`
- routing entry: `src/routes/` + `src/entry-client.tsx`
- global state & scheduling: `src/store/` (SchedulerStore, DataStore, storeSchema-\*)
- scheduler UI: `src/components/scheduler/`
- providers: `src/providers/`
- server scraping + API helpers: `src/server/scraper/`, `src/server/utils/`
- caching: `src/plugins/cache.ts`
- i18n/messages: `messages/en.ts`, `messages/cs.ts`, `src/i18n.tsx`
