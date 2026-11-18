FROM oven/bun:1.4.4
WORKDIR /app
COPY proxy/package.json ./
RUN bun install
COPY proxy/ .
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
