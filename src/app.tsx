// it may seem theese fonts flicker in dev mode, but they work fine in production
// import "@fontsource/geist-mono";
import "@fontsource/courier-prime";
import "@fontsource/geist-sans";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { type JSX, Suspense } from "solid-js";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/sonner";
import { I18nProvider } from "~/i18n";
import { InstallationProvider } from "~/providers/InstallationProvider";
import { SchedulerProvider } from "~/providers/SchedulerProvider";
import "./app.css";
import { MultiProvider } from "@solid-primitives/context";

export default function App() {
  const providers = [
    MetaProvider,
    I18nProvider,
    InstallationProvider,
    SchedulerProvider,
    ColorModeProvider,
  ];
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense>
            <ColorModeScript initialColorMode="light" storageKey="kb-color-mode" />
            <MultiProvider values={providers}>
              <Layout>
                <Suspense>{props.children}</Suspense>
              </Layout>
            </MultiProvider>
          </Suspense>
          <Toaster />
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
