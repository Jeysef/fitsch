# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN npm install -g pnpm && pnpm install
# Copy remaining source code
COPY . .
# Build the app (adjust the build script if different)
RUN pnpm run build
# Rename the entire .vinxi folder so that .output/server exists
RUN mv .vinxi .output

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN npm install -g pnpm && pnpm install --prod
# Copy the build output from the builder stage
COPY --from=builder /app/.output ./.output
# Expose the port (adjust if needed)
EXPOSE 3000
ENTRYPOINT ["pnpm", "start"]
