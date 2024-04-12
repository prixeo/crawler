import dotenv from "dotenv";
import { run } from "graphile-worker";
import indexProducts from "./products.js";
import { indexSitemaps } from "./sitemaps.js";
import { stores } from "./stores.js";

dotenv.config();

const server = Bun.serve({
  port: 3000,
  fetch(request) {
    console.log(request.method, request.url);
    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on ${server.url}`);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

run({
  connectionString: process.env.DATABASE_URL,
  noHandleSignals: true,
  concurrency: stores.length,
  crontab: `
* * * * * sitemaps
`,
  taskList: {
    sitemaps: async (payload, helpers) => {
      await indexSitemaps(payload, helpers);
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    products: async (payload: any, helpers) => {
      await indexProducts(payload, helpers);
    },
  },
});
