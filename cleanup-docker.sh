#!/bin/bash

# Docker cleanup script for freeing up disk space

echo "🧹 Cleaning up Docker resources..."

# Remove all stopped containers
echo "Removing stopped containers..."
docker container prune -fac

# Remove all dangling images
echo "Removing dangling images..."
docker image prune -f

# Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# Remove all unused networks
echo "Removing unused networks..."
docker network prune -f

# Remove build cache (use with caution)
echo "Removing Docker build cache..."
docker builder prune -f

# Show disk usage
echo ""
echo "📊 Docker disk usage:"
docker system df

echo ""
echo "✅ Cleanup complete!"
