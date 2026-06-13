# ---------- Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app with API URL
RUN VITE_API_URL=${VITE_API_URL} pnpm build

# ---------- Serve ----------
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 7000

CMD ["nginx", "-g", "daemon off;"]
