// it may seem theese fonts flicker in dev mode, but they work fine in production
// import "@fontsource/geist-mono";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MultiProvider } from "@solid-primitives/context";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { lazy, Suspense } from "solid-js";
import Layout from "~/components/layout";
// import { Toaster } from "~/components/ui/sonner";
import { I18nProvider } from "~/i18n";
import { InstallationProvider } from "~/providers/instalation/InstallationProvider";
import { PostHogProvider } from "~/providers/PosthogProvider";
import { SchedulerProvider } from "~/providers/schedule/ScheduleProvider";
import "./app.css";

const Toaster = lazy(() => import("./components/ui/sonner"));

export default function App() {
  const providers = [
    MetaProvider,
    I18nProvider,
    InstallationProvider,
    PostHogProvider,
    SchedulerProvider,
    ColorModeProvider,
  ];
  return (
    <Router
      root={(props) => (
        <>
          <Suspense>
            <ColorModeScript initialColorMode="light" storageKey="kb-color-mode" />
            <MultiProvider values={providers}>
              <Layout>
                <Suspense>{props.children}</Suspense>
              </Layout>
            </MultiProvider>
          </Suspense>
          <Suspense>
            {/* I am not sure wheter suspense is needed */}
            <Toaster />
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
