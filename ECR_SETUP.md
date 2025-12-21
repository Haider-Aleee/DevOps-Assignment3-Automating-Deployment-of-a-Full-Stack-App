# AWS ECR Setup Guide

This guide explains how to set up AWS ECR (Elastic Container Registry) for pushing Docker images.

## Prerequisites

1. AWS Account with ECR access
2. Two ECR repositories created (one for frontend, one for backend)
3. IAM user with ECR permissions

## Step 1: Create ECR Repositories

1. **Go to AWS Console** → **ECR** → **Repositories**
2. Click **Create repository**
3. Create two repositories:
   - **Frontend repository**: e.g., `react-node-frontend`
   - **Backend repository**: e.g., `react-node-backend`
4. Note the repository names (you'll need them for GitHub secrets)

## Step 2: Create IAM User for GitHub Actions

1. **Go to AWS Console** → **IAM** → **Users**
2. Click **Create user**
3. Enter username: `github-actions-ecr`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**

### Attach ECR Policy

1. Click **Attach policies directly**
2. Search for and select: **AmazonEC2ContainerRegistryFullAccess**
   - Or create a custom policy with these permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ecr:GetAuthorizationToken",
           "ecr:BatchCheckLayerAvailability",
           "ecr:GetDownloadUrlForLayer",
           "ecr:BatchGetImage",
           "ecr:PutImage",
           "ecr:InitiateLayerUpload",
           "ecr:UploadLayerPart",
           "ecr:CompleteLayerUpload"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
3. Click **Next** → **Create user**

### Save Credentials

1. **Copy the Access Key ID**
2. **Copy the Secret Access Key** (shown only once - save it!)
3. You'll add these to GitHub Secrets

## Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `AWS_ACCESS_KEY_ID` | Your IAM Access Key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Your IAM Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | Your AWS region | `us-east-1` |
| `ECR_FRONTEND_REPO` | Frontend repository name | `react-node-frontend` |
| `ECR_BACKEND_REPO` | Backend repository name | `react-node-backend` |

## Step 4: Verify ECR Repository Names

The repository names should match exactly what you see in AWS ECR:

- **Correct**: `react-node-frontend` (just the name)
- **Wrong**: `123456789012.dkr.ecr.us-east-1.amazonaws.com/react-node-frontend` (full URI)

## Step 5: Test the Setup

1. **Trigger a workflow** (create a PR or manually trigger)
2. **Check the workflow logs** for the "Build and Push Docker Images to ECR" step
3. **Verify images in ECR**:
   - Go to AWS Console → ECR → Your repository
   - You should see images tagged with:
     - Commit SHA (e.g., `abc123def456...`)
     - `latest`

## Troubleshooting

### Error: "Unable to locate credentials"

- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set correctly
- Check that the IAM user has ECR permissions

### Error: "Repository not found"

- Verify `ECR_FRONTEND_REPO` and `ECR_BACKEND_REPO` match repository names exactly
- Check that repositories exist in the specified `AWS_REGION`

### Error: "Access Denied"

- Verify IAM user has `AmazonEC2ContainerRegistryFullAccess` policy
- Check that the repositories are in the correct region

### Images not appearing in ECR

- Check workflow logs for build errors
- Verify Docker build completes successfully
- Ensure ECR push step runs without errors

## Image Tags

The workflow tags images with:
- **Commit SHA**: `${{ github.sha }}` (unique per commit)
- **Latest**: `latest` (always points to most recent)

You can pull images using:
```bash
# Frontend
docker pull <account-id>.dkr.ecr.<region>.amazonaws.com/<frontend-repo>:latest

# Backend
docker pull <account-id>.dkr.ecr.<region>.amazonaws.com/<backend-repo>:latest
```

## Next Steps

After images are pushed to ECR, you can:
1. Deploy them to ECS (Elastic Container Service)
2. Use them with EKS (Elastic Kubernetes Service)
3. Pull them on EC2 instances for deployment
4. Use them with other container orchestration tools

