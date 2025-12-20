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

