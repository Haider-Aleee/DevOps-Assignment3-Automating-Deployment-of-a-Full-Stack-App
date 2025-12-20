# Deployment Guide

This guide explains how to deploy this React + Node.js application to production (e.g., EC2 instance).

## Project Structure

- **Frontend/**: React application
- **Backend/**: Node.js/Express API server

## Prerequisites

- Node.js 18+ installed
- npm installed

## Production Deployment Steps

### 1. Install Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
npm run install-all
```

Or manually:
```bash
npm install
cd Frontend && npm install
cd ../Backend && npm install
```

### 2. Build the Frontend

```bash
npm run build
# or
npm run build-react
```

This creates the production build in `Frontend/build/`

### 3. Start the Backend Server

```bash
npm start
# or
npm run start-node
```

The backend server will:
- Serve the React app from `Frontend/build/` on the root route (`/`)
- Serve API endpoints at `/api/carts/:id`
- Run on port 80 (or PORT environment variable, defaults to 3000 in development)

### 4. Environment Variables

Set the PORT environment variable if you want to use a different port:

```bash
PORT=8080 npm start
```

## EC2 Deployment

### Step 1: Connect to your EC2 instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### Step 2: Install Node.js (if not already installed)

```bash
# Using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### Step 3: Clone and Setup

```bash
git clone <your-repo-url>
cd ReactNodeTesting
npm run install-all
npm run build
```

### Step 4: Run with PM2 (Recommended for Production)

Install PM2:
```bash
sudo npm install -g pm2
```

**Option 1: Run on Port 80 (Recommended for Production)**

Since port 80 requires root privileges, use sudo:
```bash
cd Backend
sudo PORT=80 pm2 start index.js --name "react-node-app"
sudo pm2 save
sudo pm2 startup
```

**Option 2: Run on Port 3000 (Alternative)**

If you prefer not to use sudo, run on port 3000:
```bash
cd Backend
PORT=3000 pm2 start index.js --name "react-node-app"
pm2 save
pm2 startup
```

**Note:** If using port 3000, users must access the app as `http://<Instance_IP>:3000` instead of `http://<Instance_IP>`.

### Step 5: Configure Security Groups

Ensure your EC2 security group allows:
- **HTTP (Port 80)**: Type: HTTP, Protocol: TCP, Port: 80, Source: 0.0.0.0/0 (or specific IPs)
- **Custom TCP (Port 3000)**: Type: Custom TCP, Protocol: TCP, Port: 3000, Source: 0.0.0.0/0 (if using port 3000 instead)
- **SSH (Port 22)**: Type: SSH, Protocol: TCP, Port: 22, Source: Your IP or 0.0.0.0/0

**Note:** The workflows are configured to use port 80, so ensure HTTP port 80 is open in your security group.

### Step 6: Access the Application

Open your browser and navigate to:
```
http://your-ec2-public-ip
```

**Note:** If you configured the app to run on port 80, you can access it without specifying the port. If you're using port 3000, use `http://your-ec2-public-ip:3000`.

## Development Mode

For development, run frontend and backend separately:

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm start
```

Frontend will run on port 3001 and proxy API requests to backend on port 3000.

## Troubleshooting

### Build directory not found
- Make sure you've run `npm run build` before starting the backend
- Check that `Frontend/build/` directory exists

### Port already in use
- Change the PORT environment variable
- Or kill the process using the port: 
  - For port 80: `sudo lsof -ti:80 | xargs sudo kill`
  - For port 3000: `lsof -ti:3000 | xargs kill`
- Or stop PM2: `sudo pm2 stop react-node-app` (or without sudo if using port 3000)

### CORS errors in development
- The backend includes CORS headers in development mode
- Make sure frontend proxy is configured in `Frontend/package.json`

### API endpoints not working
- Verify backend is running
- Check that routes are correctly configured in `Backend/index.js`
- Test API directly: `curl http://localhost:3000/api/carts/777`

