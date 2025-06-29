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
  options: CheerioRequestOptions | undefined = {},
  retries = 2
): Promise<CheerioAPI> {
  const urlString = typeof url === 'string' ? url : url.toString();
  const { requestOptions = {}, ...cheerioOptions } = options;

  const fetchOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Cheerio)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ...requestOptions.headers,
    },
    ...requestOptions,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(urlString, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return load(html, { xml: false, ...cheerioOptions });
      
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 500));
    }
  }
  throw new Error(`Failed to fetch ${urlString} after ${retries} attempts`);
}