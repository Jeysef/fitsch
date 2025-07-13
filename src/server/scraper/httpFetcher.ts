import type { fromURL } from "cheerio";

export class HttpFetcher {
  constructor(private readonly fetcher: typeof fromURL) {}

  public async getDocument(url: string) {
    console.log("fetching document:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      // Pass the signal to the fetcher
      const $ = await this.fetcher(url, {
        requestOptions: { method: "GET", throwOnError: true, signal: controller.signal },
      });
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