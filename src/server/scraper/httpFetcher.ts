import type { fromURL } from "~/server/utils/fetcher";

export class HttpFetcher {
  constructor(private readonly fetcher: typeof fromURL) {}

  public async getDocument(url: string) {
    let debugMsg = `fetching document: ${url}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const $ = await this.fetcher(url, {
        requestOptions: { method: "GET", signal: controller.signal, maxRedirections: 1 },
      });
      debugMsg = debugMsg.concat(" OK");
      return $;
    } catch (error: any) {
      debugMsg = debugMsg.concat(" ERROR");
      if (error.name === "AbortError") {
        debugMsg = debugMsg.concat(" ABORTED");
        throw new Error(`Fetch from ${url} timed out.`);
      }
      throw new Error(`Failed to fetch from ${url}: ${error.message || error}`);
    } finally {
      console.debug(debugMsg);
      clearTimeout(timeout);
    }
  }
}
