import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import type { APIEvent } from "@solidjs/start/server";

export const GET = (event: APIEvent) => {
  if (event.request.headers.get("accept") !== "application/json") return;
  return { notFound: "API" };
};

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4 flex flex-col items-center justify-center min-h-screen">
      <Title>404 - Page Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-7xl text-sky-700 font-extrabold uppercase my-8 tracking-widest drop-shadow-lg">
        404
      </h1>
      <h2 class="text-2xl font-semibold mb-4">Oops! This page doesn't exist.</h2>
      <p class="mb-8 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition-colors font-medium"
      >
        Go to Homepage
      </a>
    </main>
  );
}
