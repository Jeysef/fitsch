import { load, type fromURL } from "cheerio";
import { vi } from "vitest";
import { HttpFetcher } from "~/server/scraper/httpFetcher";

export function createHttpFetcherMock(docs: Record<string, string>): HttpFetcher {
  const fromUrlMock: typeof fromURL = async (url) => {
    return load(docs[url.toString()] ?? "");
  };
  const httpFetcher = new HttpFetcher(fromUrlMock);
  httpFetcher.getDocument = vi.fn(httpFetcher.getDocument);
  return httpFetcher;
}

export function createEmptyHttpFetcherMock(): HttpFetcher {
  const httpFetcher = new HttpFetcher(vi.fn());
  httpFetcher.getDocument = vi.fn(httpFetcher.getDocument);
  return httpFetcher;
}
