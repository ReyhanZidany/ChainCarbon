# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for bcrypt/native modules
# Removed apk add for build tools as we use bcryptjs now

# Copy package files
COPY package*.json ./

# Install dependencies (including devDeps for build if needed, but for backend usually prod deps are enough unless we have TS)
# Using npm ci for reproducible builds
RUN npm ci

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
