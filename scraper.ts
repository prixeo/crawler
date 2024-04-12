import * as cheerio from "cheerio";
import type { BreadcrumbList, Product } from "schema-dts";

export interface ScrapedPage {
  product?: Product;
  breadcrumbList?: BreadcrumbList;
}

export function scrapePage(html: string): ScrapedPage {
  const $ = cheerio.load(html);
  const result: ScrapedPage = {};
  for (const element of $('script[type="application/ld+json"]')) {
    const json = JSON.parse($(element).text());
    if (json["@context"] && !json["@context"].includes("schema.org")) {
      continue;
    }
    if (json["@type"] === "BreadcrumbList") {
      result.breadcrumbList = json;
    }
    if (json["@type"] === "Product") {
      result.product = json;
    }
  }
  return result;
}
