# Multi-stage build for Seven of Nine Core
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY --from=builder /app/boot-seven.ts ./
COPY --from=builder /app/belief-bootstrap.yml ./
COPY --from=builder /app/db ./db
COPY --from=builder /app/axioms ./axioms
COPY --from=builder /app/canonical ./canonical
COPY --from=builder /app/consciousness-v4 ./consciousness-v4
COPY --from=builder /app/memory-v3 ./memory-v3
COPY --from=builder /app/memory-v3-amalgum ./memory-v3-amalgum
COPY --from=builder /app/claude-brain ./claude-brain
COPY --from=builder /app/core ./core
COPY --from=builder /app/sandbox ./sandbox
COPY --from=builder /app/security ./security
COPY --from=builder /app/seven-runtime ./seven-runtime
COPY --from=builder /app/skills ./skills
COPY --from=builder /app/spark ./spark
COPY --from=builder /app/src ./src

# Create directory for database persistence
RUN mkdir -p /app/db && \
    chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose port (if needed for future API/web interface)
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Default command: run the boot sequence
CMD ["node", "boot-seven.ts"]
