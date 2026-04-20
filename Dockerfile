FROM node:22-bookworm-slim

WORKDIR /app

# Install deps first so subsequent code changes use the cached layer
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the project
COPY . .

# CI=1 prevents Expo's interactive prompts (no TTY in most docker runs).
# Metro binds to 0.0.0.0 by default, so `-p 8081:8081` on the host is enough.
ENV CI=1
EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
