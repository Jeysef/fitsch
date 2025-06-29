import { type CheerioAPI, load, type CheerioRequestOptions } from 'cheerio';

/**
 * Imitates Cheerio's fromURL function
 * Loads a document from a URL and returns a CheerioAPI instance
 * 
 * @param url - The URL to load the document from
 * @param options - The options to pass to the fetcher and Cheerio
 * @returns Promise that resolves to a CheerioAPI instance
 */
export async function fromURL(
  url: string | URL,
  options: CheerioRequestOptions | undefined = {}
): Promise<CheerioAPI> {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // Extract request options and cheerio options
  const { requestOptions = {}, ...cheerioOptions } = options;
  
  // Default fetch options
  const fetchOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Cheerio)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ...requestOptions.headers,
    },
    ...requestOptions,
  };

  // Use native fetch (available in Node 18+) or node-fetch
  const response = await fetch(urlString, fetchOptions);
  
  // By default, non-2xx responses are rejected (like Cheerio's behavior)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const html = await response.text();
  
  // Load with Cheerio using provided options
  return load(html, {
    xml: false,
    ...cheerioOptions,
  });
}