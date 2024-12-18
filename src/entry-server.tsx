// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>FIT scheduler</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="author" content="Josef Michalík" />
          <meta name="description" content="FIT scheduler" />
          <meta name="keywords" content="FIT, VUT, scheduler, fitsch" />
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="FitScheduler" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-620x620.png" />
          <meta name="theme-color" content="#ffffff" />
          {assets}
        </head>
        <body
          style={{
            "max-height": "100dvh",
            "overflow-y": "hidden",
          }}
        >
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
