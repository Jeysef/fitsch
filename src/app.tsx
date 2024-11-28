// it may seem theese fonts flicker in dev mode, but they work fine in production
// import "@fontsource/geist-mono";
import "@fontsource/courier-prime";
import "@fontsource/geist-sans";
import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/sonner";
import { I18nProvider } from "~/i18n";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>FIT scheduler</Title>
          <Meta name="author" content="Josef Michalík" />
          <Meta name="description" content="FIT scheduler" />
          <Meta name="keywords" content="FIT, VUT, scheduler, fitsch" />
          <Link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <Link rel="shortcut icon" href="/favicon.ico" />
          <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <Meta name="apple-mobile-web-app-title" content="FitScheduler" />
          <Link rel="manifest" href="/site.webmanifest" />
          <Meta name="msapplication-TileColor" content="#ffffff" />
          <Meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <Meta name="theme-color" content="#ffffff" />
          <Suspense>
            <I18nProvider>
              <Layout>
                <Suspense>{props.children}</Suspense>
              </Layout>
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
