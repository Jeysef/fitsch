# Stage 1: Build
FROM node:23-alpine AS builder
WORKDIR /app
# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install
# Copy remaining source code
COPY . .
# Build the app (adjust the build script if different)
RUN pnpm run build
# Rename the entire .vinxi folder so that .output/server exists
RUN mv .vinxi .output

# Stage 2: Production
FROM node:23-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --prod
# Copy the build output from the builder stage
COPY --from=builder /app/.output ./.output
# Expose the port (adjust if needed)
EXPOSE 3000
ENTRYPOINT ["pnpm", "start"]
