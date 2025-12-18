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
- Run on port 3000 (or PORT environment variable)

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

Start the application:
```bash
PORT=3000 pm2 start Backend/index.js --name "react-node-app"
pm2 save
pm2 startup
```

### Step 5: Configure Security Groups

Ensure your EC2 security group allows:
- Inbound traffic on port 3000 (or your chosen port) from your IP or 0.0.0.0/0
- SSH access on port 22

### Step 6: Access the Application

Open your browser and navigate to:
```
http://your-ec2-public-ip:3000
```

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
- Or kill the process using the port: `lsof -ti:3000 | xargs kill`

### CORS errors in development
- The backend includes CORS headers in development mode
- Make sure frontend proxy is configured in `Frontend/package.json`

### API endpoints not working
- Verify backend is running
- Check that routes are correctly configured in `Backend/index.js`
- Test API directly: `curl http://localhost:3000/api/carts/777`

