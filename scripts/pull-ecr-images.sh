#!/bin/bash

# Script to authenticate with AWS ECR and pull Docker images
# Usage: ./scripts/pull-ecr-images.sh

set -e

echo "🔐 Authenticating with AWS ECR..."

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$ECR_REGISTRY" ] || [ -z "$ECR_FRONTEND_REPO" ] || [ -z "$ECR_BACKEND_REPO" ]; then
    echo "❌ Error: Required environment variables not set!"
    echo "Please set ECR_REGISTRY, ECR_FRONTEND_REPO, and ECR_BACKEND_REPO"
    echo "You can create a .env file based on .env.example"
    exit 1
fi

# Get AWS region from ECR_REGISTRY or use AWS_REGION
if [ -z "$AWS_REGION" ]; then
    # Extract region from ECR_REGISTRY if format is correct
    AWS_REGION=$(echo $ECR_REGISTRY | sed -n 's/.*\.ecr\.\([^.]*\)\.amazonaws\.com.*/\1/p')
    if [ -z "$AWS_REGION" ]; then
        echo "❌ Error: Could not determine AWS region. Please set AWS_REGION"
        exit 1
    fi
fi

echo "📍 Using AWS Region: $AWS_REGION"
echo "📍 ECR Registry: $ECR_REGISTRY"

# Authenticate Docker with ECR
echo "🔑 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to authenticate with ECR"
    echo "Make sure you have AWS CLI configured and ECR permissions"
    exit 1
fi

echo "✅ Successfully authenticated with ECR"

# Set image tag (default to latest)
IMAGE_TAG=${IMAGE_TAG:-latest}
echo "📦 Using image tag: $IMAGE_TAG"

# Pull frontend image
echo ""
echo "📥 Pulling frontend image..."
FRONTEND_IMAGE="$ECR_REGISTRY/$ECR_FRONTEND_REPO:$IMAGE_TAG"
docker pull $FRONTEND_IMAGE

if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled frontend image: $FRONTEND_IMAGE"
else
    echo "❌ Error: Failed to pull frontend image"
    exit 1
fi

# Pull backend image
echo ""
echo "📥 Pulling backend image..."
BACKEND_IMAGE="$ECR_REGISTRY/$ECR_BACKEND_REPO:$IMAGE_TAG"
docker pull $BACKEND_IMAGE

if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled backend image: $BACKEND_IMAGE"
else
    echo "❌ Error: Failed to pull backend image"
    exit 1
fi

echo ""
echo "✅ All images pulled successfully!"
echo ""
echo "🚀 You can now start the containers with:"
echo "   docker-compose -f docker-compose.ecr.yml up -d"
echo ""
echo "   Or with specific image tag:"
echo "   IMAGE_TAG=<tag> docker-compose -f docker-compose.ecr.yml up -d"

