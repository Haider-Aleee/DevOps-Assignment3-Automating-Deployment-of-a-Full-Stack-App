# Using Docker Compose with ECR Images

This guide explains how to pull and use Docker images from AWS ECR with docker-compose.

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws --version
   aws configure
   ```

2. **Docker and Docker Compose installed**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **ECR repositories created** and images pushed (via GitHub Actions workflow)

4. **AWS credentials** with ECR read permissions

## Quick Start

### Option 1: Using the Pull Script (Recommended)

1. **Create `.env` file** from example:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your ECR details:
   ```env
   ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
   ECR_FRONTEND_REPO=react-node-frontend
   ECR_BACKEND_REPO=react-node-backend
   AWS_REGION=us-east-1
   IMAGE_TAG=latest
   ```

3. **Run the pull script**:
   ```bash
   ./scripts/pull-ecr-images.sh
   ```

4. **Start containers**:
   ```bash
   docker-compose -f docker-compose.ecr.yml up -d
   ```

### Option 2: Manual Steps

1. **Authenticate with ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
   ```

2. **Set environment variables**:
   ```bash
   export ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
   export ECR_FRONTEND_REPO=react-node-frontend
   export ECR_BACKEND_REPO=react-node-backend
   export IMAGE_TAG=latest
   ```

3. **Pull images**:
   ```bash
   docker pull $ECR_REGISTRY/$ECR_FRONTEND_REPO:$IMAGE_TAG
   docker pull $ECR_REGISTRY/$ECR_BACKEND_REPO:$IMAGE_TAG
   ```

4. **Start containers**:
   ```bash
   docker-compose -f docker-compose.ecr.yml up -d
   ```

## Docker Compose Files

### `docker-compose.yml`
- **Default file** - Can be configured to use ECR or build locally
- Edit the file to switch between `image:` (ECR) or `build:` (local)

### `docker-compose.ecr.yml`
- **Production file** - Always pulls from ECR
- Use this for production deployments

### `docker-compose.local.yml`
- **Development file** - Always builds locally
- Use this for local development

## Usage Examples

### Pull Latest Images and Start
```bash
# Pull latest images
./scripts/pull-ecr-images.sh

# Start containers
docker-compose -f docker-compose.ecr.yml up -d
```

### Pull Specific Tag and Start
```bash
# Pull specific commit SHA
IMAGE_TAG=abc123def456 ./scripts/pull-ecr-images.sh

# Start with that tag
IMAGE_TAG=abc123def456 docker-compose -f docker-compose.ecr.yml up -d
```

### Update and Restart
```bash
# Pull latest images
./scripts/pull-ecr-images.sh

# Restart containers with new images
docker-compose -f docker-compose.ecr.yml down
docker-compose -f docker-compose.ecr.yml up -d
```

### View Logs
```bash
docker-compose -f docker-compose.ecr.yml logs -f
```

### Stop Containers
```bash
docker-compose -f docker-compose.ecr.yml down
```

## Finding Your ECR Details

### ECR Registry URL
1. Go to AWS Console → ECR → Repositories
2. Click on any repository
3. Click "View push commands"
4. Copy the registry URL (format: `123456789012.dkr.ecr.us-east-1.amazonaws.com`)

### Repository Names
- Found in ECR → Repositories
- Just the name, not the full URI
- Example: `react-node-frontend` (not the full URL)

### Available Image Tags
1. Go to ECR → Your repository
2. Click on the repository
3. View available tags (e.g., `latest`, commit SHA)

## Troubleshooting

### Error: "no basic auth credentials"
**Solution**: Authenticate with ECR first:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <registry>
```

### Error: "repository does not exist"
**Solution**: 
- Verify repository names in `.env` match ECR exactly
- Check that repositories exist in the specified region
- Ensure you have ECR read permissions

### Error: "image not found"
**Solution**:
- Check that images exist in ECR with the specified tag
- Verify `IMAGE_TAG` is correct (try `latest`)
- Ensure images were pushed successfully by GitHub Actions

### Error: "unauthorized: authentication required"
**Solution**:
- Re-authenticate with ECR (credentials expire after 12 hours)
- Verify AWS credentials are configured: `aws configure list`
- Check IAM user has ECR read permissions

## EC2 Deployment with ECR

To deploy on EC2 using ECR images:

1. **SSH into EC2 instance**

2. **Install Docker**:
   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo systemctl start docker
   sudo usermod -aG docker ec2-user
   ```

3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Configure AWS CLI**:
   ```bash
   aws configure
   ```

5. **Clone repository and set up**:
   ```bash
   git clone <your-repo-url>
   cd ReactNodeTesting
   cp .env.example .env
   # Edit .env with your ECR details
   ```

6. **Pull and start**:
   ```bash
   ./scripts/pull-ecr-images.sh
   docker-compose -f docker-compose.ecr.yml up -d
   ```

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use IAM roles** on EC2 instead of access keys when possible
3. **Rotate credentials** regularly
4. **Use specific image tags** (commit SHA) instead of `latest` in production
5. **Limit ECR permissions** - Only grant read access if only pulling images

## Next Steps

After pulling images, you can:
- Deploy to production servers
- Test locally with production images
- Rollback to previous versions using different tags
- Use with container orchestration (ECS, EKS, etc.)

