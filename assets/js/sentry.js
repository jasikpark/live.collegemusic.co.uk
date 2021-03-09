import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://7e756e3620b84104b5cf9062e20b963f@o545485.ingest.sentry.io/5667454",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
