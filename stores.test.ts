import { describe, expect, test } from "bun:test";
import { scrapePage } from "./scraper";
import { stores } from "./stores";

describe("scraper", () => {
  function testPage(name: string): void {
    test(name, async () => {
      const html = await Bun.file(`testdata/${name}.html`).text();
      const result = scrapePage(html);
      expect(result).toMatchSnapshot(name);
    });
  }
  for (const store of stores) {
    testPage(store.domain);
  }
});
