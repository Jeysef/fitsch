import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import type { APIEvent } from "@solidjs/start/server";

export const GET = (event: APIEvent) => {
  if (event.request.headers.get("accept") !== "application/json") return;
  return { notFound: "API" };
};

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Not Found</h1>
      <p class="mt-8">
        Visit{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline" rel="noreferrer">
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
    </main>
  );
}
