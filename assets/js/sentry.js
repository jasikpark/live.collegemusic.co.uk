import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://fad316bb96c54ed8b2fe9ff6a9e867db@o545465.ingest.sentry.io/5667419",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
