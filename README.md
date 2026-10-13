# Digital FIR System

A modern web application for citizens to file and track FIR complaints online, and for authorized police/admin users to manage FIR records.

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, REST API
- **Auth**: JWT (JSON Web Tokens)

## Project Structure
```
digital fir/
├── frontend/          # React.js application
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── services/      # API service functions
│       └── context/       # React Context (Auth)
└── backend/           # Node.js + Express API
    ├── routes/        # API route handlers
    ├── middleware/    # Auth middleware
    └── data/          # In-memory data store
```

## Getting Started

### 1. Start the Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

## Demo Credentials
| Role   | Email                    | Password |
|--------|--------------------------|----------|
| Admin  | admin@digitalfir.gov     | password |
| Citizen| Register a new account   | —        |

## API Endpoints
| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| POST   | /api/auth/register              | Register user         |
| POST   | /api/auth/login                 | Login user            |
| POST   | /api/firs                       | Submit FIR            |
| GET    | /api/firs                       | Get all FIRs          |
| GET    | /api/firs/:id                   | Get FIR by ID         |
| GET    | /api/firs/track/:referenceNumber| Track FIR             |
| PUT    | /api/firs/:id/status            | Update FIR status     |
| GET    | /api/users/profile              | Get user profile      |
| PUT    | /api/users/profile              | Update profile        |
| PUT    | /api/users/change-password      | Change password       |

## Pages
- `/` — Home page
- `/login` — Login
- `/register` — Register
- `/file-fir` — File FIR (multi-step form, requires login)
- `/track-fir` — Track FIR (public)
- `/dashboard` — Citizen dashboard
- `/my-firs` — My FIRs list
- `/fir/:id` — FIR details
- `/admin` — Admin dashboard
- `/admin/firs` — FIR management
- `/admin/fir/:id/review` — FIR review & status update
- `/profile` — User profile
- `/about` — About page
- `/contact` — Contact page
