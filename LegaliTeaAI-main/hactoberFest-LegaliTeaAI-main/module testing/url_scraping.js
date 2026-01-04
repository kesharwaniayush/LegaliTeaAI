import puppeteer from "puppeteer";

async function searchUrlGetContent(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  // Extract content
  const content = await page.evaluate(() => {
    // Remove unwanted elements
    const removeSelectors = [
      "header",
      "footer",
      "nav",
      "aside",
      "script",
      "style",
      "noscript",
      "iframe",
      "form",
      "[role='banner']",
      "[role='navigation']",
      "[role='complementary']",
      "[role='contentinfo']",
      "[aria-label*='ads']",
      "[id*='ad']",
      "[class*='ad']",
      "[id*='banner']",
      "[class*='banner']",
    ];
    removeSelectors.forEach(sel =>
      document.querySelectorAll(sel).forEach(el => el.remove())
    );

    // Try to find the main content
    let main =
      document.querySelector("main") ||
      document.querySelector("article") ||
      document.querySelector("[role='main']") ||
      document.body;

    const title = document.title || document.querySelector("h1")?.innerText || "";

    // Get visible text only
    const text = main.innerText
      .replace(/\n\s*\n/g, "\n\n") // remove excessive blank lines
      .trim();


    return { title, text };
  });

  await browser.close();
  console.log(content.text);
  return content;
}

// export { searchUrlGetContent };

searchUrlGetContent("https://aws.amazon.com/privacy/");
