import { HeaderGenerator } from "header-generator";
import { RateLimiter } from "limiter";
// Some websites return error codes unless the headers look like the request is
// coming from a browser.
const headers = new HeaderGenerator({
  browsers: ["chrome", "safari"],
  operatingSystems: ["macos", "windows"],
  devices: ["desktop", "mobile"],
});

const limiters = new Map<string, RateLimiter>();

function urlLimiter(url: string): RateLimiter {
  const domain = new URL(url).hostname;
  const fromCache = limiters.get(domain);
  if (fromCache) {
    return fromCache;
  }
  const freshLimiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: "second",
  });
  limiters.set(domain, freshLimiter);
  return freshLimiter;
}

const limiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: "second",
});

/**
 * Fetches a URL with generated headers.
 *
 * @param {string} url - The URL to fetch.
 * @returns {Promise<Response>} A promise that resolves to the fetch response.
 */
export async function doFetch(url: string): Promise<Response> {
  await urlLimiter(url).removeTokens(1);
  return fetch(url, {
    headers: headers.getHeaders(),
  });
}
