# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install dependencies and clean cache to save space
RUN npm install --force && npm cache clean --force

# Copy backend source code
COPY . .

# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app/backend

# Install dependencies for production
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/backend . 

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => {if (res.statusCode !== 200) throw new Error(res.statusCode)})"

# Start the application
CMD ["npm", "start"]
