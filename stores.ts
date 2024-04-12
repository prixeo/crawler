import { Matcher } from "./Matcher";

export interface Store {
  domain: string;
  urlsetMatcher?: Matcher;
}

export const stores: Store[] = [
  { domain: "www.netthandelen.no" },
  { domain: "www.jula.no" },
  { domain: "biltema.no" },
  { domain: "jysk.no" },
  {
    domain: "clasohlson.com",
    urlsetMatcher: new Matcher(["sitemap_product_no.xml"], []),
  },
  {
    domain: "ikea.com",
    urlsetMatcher: new Matcher(["prod-no-NO_"], []),
  },
  { domain: "oda.com", urlsetMatcher: new Matcher(["/nb/"], []) },
];
