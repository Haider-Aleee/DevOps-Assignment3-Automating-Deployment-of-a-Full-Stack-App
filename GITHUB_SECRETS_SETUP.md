# GitHub Secrets Setup Guide

This document explains how to configure the required secrets in GitHub for the CI/CD workflow to work properly.

## Required GitHub Secrets

To access GitHub Secrets:
1. Go to your repository on GitHub
2. Click on **Settings**
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret** for each secret below

### EC2 Testing Environment Secrets (for Testing Workflow)

#### `EC2_HOST`
- **Description**: The public IP address or hostname of your EC2 **testing** instance
- **Example**: `54.123.45.67` or `ec2-54-123-45-67.compute-1.amazonaws.com`
- **How to find**: Check your EC2 instance details in AWS Console
- **Used by**: Testing workflow (triggered on PR)

#### `EC2_USER`
- **Description**: The SSH username for your EC2 **testing** instance
- **Common values**:
  - `ec2-user` (Amazon Linux, Amazon Linux 2)
  - `ubuntu` (Ubuntu instances)
  - `admin` (Debian instances)
- **How to find**: Check your EC2 instance AMI documentation
- **Used by**: Testing workflow

#### `EC2_SSH_KEY`
- **Description**: The private SSH key content for your EC2 **testing** instance (entire key file content)
- **Format**: The complete private key, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
- **How to get**: 
  1. If you created a key pair when launching the instance, use that `.pem` file
  2. Open the `.pem` file in a text editor
  3. Copy the entire content (including headers)
  4. Paste it as the secret value
- **Used by**: Testing workflow

### EC2 Staging Environment Secrets (for Staging Workflow)

#### `EC2_STAGING_HOST`
- **Description**: The public IP address or hostname of your EC2 **staging** instance
- **Example**: `54.234.56.78` or `ec2-54-234-56-78.compute-1.amazonaws.com`
- **How to find**: Check your EC2 instance details in AWS Console
- **Used by**: Staging workflow (triggered on merge to main/master)

#### `EC2_STAGING_USER`
- **Description**: The SSH username for your EC2 **staging** instance
- **Common values**:
  - `ec2-user` (Amazon Linux, Amazon Linux 2)
  - `ubuntu` (Ubuntu instances)
  - `admin` (Debian instances)
- **How to find**: Check your EC2 instance AMI documentation
- **Used by**: Staging workflow

#### `EC2_STAGING_SSH_KEY`
- **Description**: The private SSH key content for your EC2 **staging** instance (entire key file content)
- **Format**: The complete private key, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
- **How to get**: 
  1. If you created a key pair when launching the instance, use that `.pem` file
  2. Open the `.pem` file in a text editor
  3. Copy the entire content (including headers)
  4. Paste it as the secret value
- **Used by**: Staging workflow

### Email Notification Secrets

#### `EMAIL_USERNAME`
- **Description**: Gmail address for sending notifications
- **Example**: `your-email@gmail.com`
- **Note**: You'll need to use an App Password (not your regular password)

#### `EMAIL_PASSWORD`
- **Description**: Gmail App Password (not your regular password)
- **How to create**:
  1. Go to your Google Account settings
  2. Security → 2-Step Verification (must be enabled)
  3. App passwords → Generate new app password
  4. Select "Mail" and "Other (Custom name)" → Enter "GitHub Actions"
  5. Copy the 16-character password

#### `QA_EMAIL`
- **Description**: Email address of the QA team member (for testing workflow notifications)
- **Example**: `qa@yourcompany.com`
- **Used by**: Testing workflow

#### `DEVELOPER_EMAIL`
- **Description**: Default developer email (used as fallback if PR author email is not available)
- **Example**: `dev@yourcompany.com`
- **Used by**: Testing workflow (failure notifications)

#### `CLIENT_EMAIL`
- **Description**: Client email address (for staging deployment notifications)
- **Example**: `client@yourcompany.com`
- **Used by**: Staging workflow

#### `TEAM_EMAIL`
- **Description**: Team email address or distribution list (for staging deployment notifications)
- **Example**: `team@yourcompany.com` or `dev-team@yourcompany.com`
- **Used by**: Staging workflow

### AWS ECR Secrets (for Docker Image Push)

#### `AWS_ACCESS_KEY_ID`
- **Description**: AWS Access Key ID for ECR access
- **How to create**:
  1. Go to AWS Console → IAM → Users
  2. Select your user → Security credentials → Create access key
  3. Select "Command Line Interface (CLI)"
  4. Copy the Access Key ID
- **Used by**: Both workflows (for pushing Docker images to ECR)

#### `AWS_SECRET_ACCESS_KEY`
- **Description**: AWS Secret Access Key (paired with Access Key ID)
- **How to get**: Generated when you create the Access Key (shown only once)
- **Important**: Save this immediately - you won't be able to see it again
- **Used by**: Both workflows (for pushing Docker images to ECR)

#### `AWS_REGION`
- **Description**: AWS region where your ECR repositories are located
- **Example**: `us-east-1`, `us-west-2`, `eu-west-1`
- **How to find**: Check your ECR repository URL or AWS Console
- **Used by**: Both workflows

#### `ECR_FRONTEND_REPO`
- **Description**: Name of your ECR repository for the frontend Docker image
- **Example**: `react-node-frontend` or `myapp-frontend`
- **How to find**: 
  1. Go to AWS Console → ECR → Repositories
  2. Find your frontend repository
  3. Copy the repository name (not the full URI)
- **Used by**: Both workflows

#### `ECR_BACKEND_REPO`
- **Description**: Name of your ECR repository for the backend Docker image
- **Example**: `react-node-backend` or `myapp-backend`
- **How to find**: 
  1. Go to AWS Console → ECR → Repositories
  2. Find your backend repository
  3. Copy the repository name (not the full URI)
- **Used by**: Both workflows

## Setting Up Gmail App Password

1. **Enable 2-Step Verification** (required for App Passwords):
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Use in GitHub Secret**:
   - Paste the 16-character password as `EMAIL_PASSWORD`

## Testing the Setup

After configuring all secrets:

1. **Test the Testing workflow manually**:
   - Go to **Actions** tab
   - Select **CI/CD Workflow for Testing the PR requests**
   - Click **Run workflow** → **Run workflow**

2. **Test the Staging workflow manually**:
   - Go to **Actions** tab
   - Select **CI/CD Workflow for Staging Deployment**
   - Click **Run workflow** → **Run workflow**

3. **Check the logs**:
   - If deployment fails, check the logs for specific error messages
   - Common issues:
     - Incorrect SSH key format
     - Wrong EC2 user (check your AMI)
     - EC2 security group not allowing SSH (port 22)
     - EC2 security group not allowing HTTP (port 3000)

## EC2 Security Group Configuration

Ensure your EC2 security group allows:

1. **SSH (Port 22)**:
   - Type: SSH
   - Protocol: TCP
   - Port: 22
   - Source: `0.0.0.0/0` (or your GitHub Actions IP range)

2. **HTTP (Port 3000)**:
   - Type: Custom TCP
   - Protocol: TCP
   - Port: 3000
   - Source: `0.0.0.0/0` (or specific IPs for testing)

## Troubleshooting

### SSH Connection Fails
- Verify `EC2_SSH_KEY` includes the complete key with headers
- Check that `EC2_USER` matches your AMI (ec2-user, ubuntu, etc.)
- Ensure EC2 security group allows SSH from GitHub Actions

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check that 2-Step Verification is enabled
- Verify email addresses are correct

### Deployment Fails
- Check EC2 instance is running
- Verify Node.js is installed on EC2
- Check PM2 installation (workflow will install if missing)
- Review workflow logs for specific error messages

