# ReactNodeTesting

Sample React and Node/Express project to demonstrate usage of React Test Library and Jest test frameworks.

Article for this can be found here: https://medium.com/@eljamaki01/testing-a-react-node-express-app-with-react-test-library-and-jest-2ac910812c41

## Project Structure

This project has been organized with separate Frontend and Backend directories:

```
ReactNodeTesting/
├── Frontend/          # React application
│   ├── src/          # React source files
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── Backend/          # Node.js/Express API server
│   ├── index.js      # Express server
│   ├── carts.js      # API routes
│   └── package.json  # Backend dependencies
└── package.json      # Root orchestration scripts
```

## Quick Start

### Install Dependencies

```bash
npm run install-all
```

### Development Mode

**Option 1: Run separately (recommended for development)**
```bash
# Terminal 1 - Backend (port 3000)
npm run start-node

# Terminal 2 - Frontend (port 3001)
npm run start-dev
```

**Option 2: Production mode (backend serves frontend)**
```bash
# Build frontend first
npm run build

# Start backend (serves built frontend)
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test-frontend

# Run backend tests only
npm run test-backend
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions, including EC2 setup.

## Available Scripts

- `npm run install-all` - Install dependencies for root, frontend, and backend
- `npm run build` - Build the React frontend for production
- `npm start` - Start the backend server (production mode)
- `npm run start-dev` - Start the React development server
- `npm test` - Run all tests (frontend + backend)
- `npm run test-frontend` - Run frontend tests only
- `npm run test-backend` - Run backend tests only