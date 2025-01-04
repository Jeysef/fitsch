import { chromium, type Browser, type Page } from "playwright";

export async function getUrlContent(url: string): Promise<string> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  console.log("Loading URL content:", url);

  try {
    // Launch the browser
    browser = await chromium.launch({
      headless: true, // Run in headless mode
    });

    // Create a new page
    page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Get the page content
    const content = await page.content();

    console.log("URL content loaded:", content.length, "bytes");

    return content;
  } catch (error) {
    console.error("Error fetching URL content:", error);
    throw error;
  } finally {
    // Clean up: close page and browser
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
