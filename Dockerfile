# Multi-stage build for optimal image size and security
# Stage 1: Build the React client and Express server
FROM node:20-alpine AS builder

WORKDIR /app

# Install build-essential tools if any native modules are needed
RUN apk add --no-cache libc6-compat

# Copy package management files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build Vite frontend and bundle backend server using esbuild
RUN npm run build

# Stage 2: Production-ready runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install runtime tools
RUN apk add --no-cache curl

# Create data directory for local file database and persistent backups
RUN mkdir -p /app/data /app/data/backups

# Copy package files to run startup scripts
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets and compiled backend bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose the designated port (port 3000 is default, but configurable via PORT)
EXPOSE 3000

# Define a volume to persist local database states (db.json) and scheduled backups
VOLUME [ "/app/data" ]

# Start the full-stack server
CMD ["npm", "run", "start"]
