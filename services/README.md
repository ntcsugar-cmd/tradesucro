# services/

TradeSucro has no backend. This folder is the seam where one will plug in.

Each `*.service.ts` file exposes async functions with the shape a real API
call will eventually have (`Promise<T>`, one function per operation).
Today, every function resolves data from `lib/data.ts` (mock data). When a
real backend exists, replace the function body with a `fetch`/API-client
call — the return type and call sites elsewhere in the app do not change.

Components and pages should call a service function, not import from
`lib/data.ts` directly.
