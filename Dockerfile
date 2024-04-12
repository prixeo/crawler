# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.3 as base
WORKDIR /usr/src/app

COPY package.json bun.lockb .
RUN bun install --frozen-lockfile --production
COPY . .

RUN bun build --compile --minify --sourcemap index.ts --outfile crawler

# run the app
EXPOSE 3000
ENTRYPOINT [ "./crawler"]
