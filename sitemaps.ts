import { XMLParser } from "fast-xml-parser";
import type { JobHelpers } from "graphile-worker";
import robotsParser from "robots-parser";
import MIMEType from "whatwg-mimetype";
import type { Matcher } from "./Matcher";
import { doFetch } from "./helpers";
import { stores } from "./stores";

export async function indexSitemaps(_payload: unknown, helpers: JobHelpers) {
  for (const store of stores) {
    let count = 0;
    const robotsTxtUrl = `https://${store.domain}/robots.txt`;

    // Visit robots.txt and extract allowed URLs
    const robotsTxtResponse = await doFetch(robotsTxtUrl);
    const robotsTxtContent = await robotsTxtResponse.text();
    const robots = robotsParser(robotsTxtUrl, robotsTxtContent);
    if (!robots.isAllowed(robotsTxtUrl, "Prixeo")) {
      helpers.logger.warn(
        `Robots.txt does not allow Prixeo to crawl ${store.domain}`
      );
      return;
    }
    for (const sitemapUrl of robots.getSitemaps()) {
      helpers.logger.info(sitemapUrl);
      const sitemap = await doFetch(sitemapUrl);
      const xml = await responseXML(sitemap);
      const parsed = new XMLParser().parse(xml);
      for (const sitemapindex of parsed?.sitemapindex?.sitemap || []) {
        if (typeof sitemapindex !== "object") {
          helpers.logger.error(JSON.stringify(sitemapindex));
          continue;
        }
        const loc = sitemapindex?.loc;
        if (typeof loc !== "string") {
          helpers.logger.error(JSON.stringify(sitemapindex));
          continue;
        }
        if (store.urlsetMatcher && !store.urlsetMatcher.matches(loc)) {
          helpers.logger.info(`Skipping urlset ${loc} due to matching rule`);
          continue;
        }
        const sitemap = await doFetch(loc);
        const sitemapXML = await responseXML(sitemap);
        const parsedXML = new XMLParser().parse(sitemapXML);
        for (const url of parsedXML?.urlset?.url || []) {
          if (typeof url !== "object") {
            helpers.logger.error(JSON.stringify({ url }));
            continue;
          }
          const loc = url?.loc;
          if (typeof loc !== "string") {
            continue;
          }
          count++;
          helpers.addJob(
            "products",
            { loc },
            { jobKey: loc, jobKeyMode: "replace", queueName: store.domain }
          );
        }
      }
    }
    helpers.logger.info(`${store.domain}: added ${count} jobs`);
  }
}

async function responseXML(response: Response): Promise<string> {
  const contentType = new MIMEType(response.headers.get("content-type") ?? "");
  if (contentType.subtype !== "xml") {
    return "";
  }
  const charset = contentType.parameters.get("charset");
  const blob = await response.arrayBuffer();
  const text = new TextDecoder(charset).decode(new Uint8Array(blob));
  if (text.startsWith("<?xml")) {
    return text;
  }

  if (charset === "utf-16") {
    const utf16le = new TextDecoder("utf-16le").decode(new Uint8Array(blob));
    if (utf16le.startsWith("<?xml")) {
      return utf16le;
    }
  }
  throw new Error(`unable to get XML from response ${text}`);
}
