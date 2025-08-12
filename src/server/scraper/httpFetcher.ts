import type { fromURL } from "cheerio";

export class HttpFetcher {
  constructor(private readonly fetcher: typeof fromURL) {}

  public async getDocument(url: string) {
    console.debug("fetching document:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const $ = await this.fetcher(url, {
        requestOptions: { method: "GET", signal: controller.signal, maxRedirections: 1 },
      });
      console.debug("fetching document:", url, "OK");
      return $;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(`Fetch from ${url} timed out.`);
      }
      throw new Error(`Failed to fetch from ${url}: ${error.message || error}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}
