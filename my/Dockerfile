FROM oven/bun:1.3-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "src/index.js"]
