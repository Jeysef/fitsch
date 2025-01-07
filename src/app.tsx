// it may seem theese fonts flicker in dev mode, but they work fine in production
// import "@fontsource/geist-mono";
import "@fontsource/courier-prime";
import "@fontsource/geist-sans";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/sonner";
import { I18nProvider } from "~/i18n";
import { InstallationProvider } from "~/providers/InstallationProvider";
import { MenuOpenedProvider } from "~/providers/MenuOpenedProvider";
import { SchedulerProvider } from "~/providers/SchedulerProvider";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense>
            <I18nProvider>
              <InstallationProvider>
                <SchedulerProvider>
                  <MenuOpenedProvider>
                    <ColorModeScript initialColorMode="light" storageKey="kb-color-mode" />
                    <ColorModeProvider>
                      <Layout>
                        <Suspense>{props.children}</Suspense>
                      </Layout>
                    </ColorModeProvider>
                  </MenuOpenedProvider>
                </SchedulerProvider>
              </InstallationProvider>
            </I18nProvider>
          </Suspense>
          <Toaster />
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
