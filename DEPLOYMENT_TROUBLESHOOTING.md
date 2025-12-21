# Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue: Deployment Step Hanging (Taking 10+ Minutes)

**Symptoms:**
- Deployment step runs for 10+ minutes without completing
- No error messages, just hangs

**Common Causes:**

1. **SSH Connection Issues**
   - Wrong SSH key format
   - Security group not allowing SSH from GitHub Actions
   - Wrong EC2 user (ec2-user vs ubuntu)

2. **Sudo Password Prompt**
   - PM2 commands with `sudo` are waiting for password
   - Most common cause of hanging

3. **Network/Connection Timeout**
   - EC2 instance not responding
   - Security group blocking connections

**Solutions:**

#### Fix 1: Configure Passwordless Sudo (CRITICAL)

The deployment uses `sudo` for PM2 commands. You need to configure passwordless sudo on your EC2 instance:

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Edit sudoers file
sudo visudo

# Add this line (replace ec2-user with your username):
ec2-user ALL=(ALL) NOPASSWD: /usr/bin/pm2, /usr/local/bin/pm2, /usr/bin/npm

# Or for ubuntu user:
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/pm2, /usr/local/bin/pm2, /usr/bin/npm

# Save and exit (Ctrl+X, then Y, then Enter)
```

**Alternative:** Use `setcap` to allow Node.js to bind to port 80 without sudo:

```bash
# On EC2 instance
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

Then update the workflow to remove `sudo` from PM2 commands.

#### Fix 2: Verify SSH Connection

Test SSH connection manually:

```bash
# Test from your local machine
ssh -i your-key.pem ec2-user@your-ec2-ip "echo 'Connection works'"
```

#### Fix 3: Check Security Group

Ensure your EC2 security group allows:
- **SSH (Port 22)** from `0.0.0.0/0` or GitHub Actions IP ranges
- **HTTP (Port 80)** from `0.0.0.0/0`

#### Fix 4: Verify Secrets

Check that GitHub secrets are correctly set:
- `EC2_STAGING_HOST` - IP address (not hostname)
- `EC2_STAGING_USER` - Correct username (ec2-user, ubuntu, etc.)
- `EC2_STAGING_SSH_KEY` - Complete private key including headers

### Issue: "Permission Denied" Errors

**Solution:** Ensure SSH key has correct permissions (600) and format.

### Issue: "Connection Timeout"

**Solutions:**
1. Check EC2 instance is running
2. Verify security group allows SSH
3. Check if IP address changed (use Elastic IP)

### Issue: PM2 Commands Fail

**Solution:** Install PM2 globally on EC2:

```bash
sudo npm install -g pm2
```

## Quick Diagnostic Steps

1. **Check workflow logs** - Look for the last successful step
2. **Test SSH manually** - Verify you can connect
3. **Check sudo configuration** - Most common issue
4. **Verify secrets** - Ensure all are set correctly

## Expected Deployment Time

- **Normal deployment:** 1-3 minutes
- **First deployment (with npm install):** 3-5 minutes
- **If taking 10+ minutes:** Something is wrong - check logs

## What to Do Right Now

If your current deployment is still running:

1. **Cancel the workflow** - It's likely stuck
2. **Fix sudo configuration** on EC2 (see Fix 1 above)
3. **Re-run the workflow** - It should complete in 1-3 minutes

## Alternative: Use Port 3000 Instead of 80

If you can't configure passwordless sudo, you can use port 3000:

1. Update workflow to use `PORT=3000` instead of `PORT=80`
2. Remove `sudo` from PM2 commands
3. Update security group to allow port 3000
4. Users access via `http://<IP>:3000`

