// it may seem theese fonts flicker in dev mode, but they work fine in production
import "@fontsource/geist-mono";
import "@fontsource/geist-sans";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Layout from "~/components/layout";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>SolidStart</Title>
          <Suspense>
            <Layout>
              <Suspense>{props.children}</Suspense>
            </Layout>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
