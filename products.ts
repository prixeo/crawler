import type { JobHelpers } from "graphile-worker";

export default async function indexProducts(
  payload: { loc: string },
  helpers: JobHelpers
) {
  const { loc: url } = payload;
  if (typeof url !== "string") {
    helpers.logger.error(JSON.stringify({ payload }));
    return;
  }
  helpers.logger.info(`URL ${url}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
