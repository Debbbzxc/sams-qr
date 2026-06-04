# SAMS QR: Student Attendance Management System

SAMS QR is a full-stack, timezone-safe, and Progressive Web App (PWA) enabled attendance tracking platform. Built with a React frontend and an Express/Node.js backend, the system allows instructors to generate dynamic QR codes for live class sessions and enables students to scan them using their mobile device cameras to log attendance instantly.

The codebase is structured as a monorepo, containing dedicated services for the frontend client and the backend server.

---

## Architecture Overview

```
sams-project/
├── backend/                  # Express REST API & Mongoose Models
│   ├── config/               # Database configurations & caching
│   ├── controllers/          # Request handling logic
│   ├── middlewares/          # JWT and role-based authorization guards
│   ├── models/               # MongoDB schemas (User, Class, Attendance)
│   ├── routes/               # API endpoints (Auth, Classes/Attendance)
│   └── utils/                # Date/time conversions and helpers
├── frontend/                 # Vite + React Client
│   ├── src/
│   │   ├── components/       # Shared UI components (Navbar, Footer, Clock)
│   │   ├── config/           # API and client configurations
│   │   ├── pages/            # View pages (Dashboard, Login, Register)
│   │   └── utils/            # Timezone formatters and auth helpers
│   └── public/               # Static assets & PWA manifest
└── .env.example              # Consolidated environment configuration guide
```

---

## Features

### Authentication & Authorization
* **Role-Based Routing:** Users register as either an **Instructor** or a **Student**. Dashboards and API endpoints are protected using JWT authorization.
* **Dual Identifier Login:** Users can log in using either their registered email address or their institutional ID number.

### Instructor Dashboard
* **Class Management:** Create, archive, and manage classes. Each class contains information on subject name, code, schedule, and room.
* **Dynamic QR Code Session Generator:** Launch a live class session to generate a single-use QR code containing a secure, randomized session identifier.
* **Batch Student Enrollment:** Enroll multiple students at once by entering their institutional ID numbers in a plain text list (one per line).
* **Attendance Ledger:** View real-time status (Present, Absent, Not Marked) for all enrolled students during a class session.
* **Manual Override:** Manually update any student's status for a given session.
* **Auto-Absence Logging:** Mark all "Not Marked" students as "Absent" at the end of a session with a single click.
* **CSV Data Export:** Generate and download spreadsheet-compatible CSV reports featuring automated calculations for total attendance counts.

### Student Dashboard
* **Mobile-Optimized Scanner:** Access built-in camera controls to scan active class QR codes.
* **Real-time Overview:** Monitor personalized attendance rates (Present vs. Absent counts) for all enrolled classes.
* **PWA Capability:** Installable on mobile devices for native-like camera performance.

### Timezone Standardization
* All schedules, session ranges, and log entries are parsed and synced using the `Asia/Manila` timezone (UTC+8). This ensures date key uniformity across different student devices and prevents double check-ins.

---

## Tech Stack

### Backend
* **Runtime:** Node.js (ES Modules)
* **Framework:** Express
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JSON Web Tokens (JWT) & BcryptJS
* **Deployment Compatibility:** Vercel Serverless Function configuration (`vercel.json`) with persistent database connection caching.

### Frontend
* **Build Tool:** Vite
* **Framework:** React 19
* **Router:** React Router DOM (v7)
* **Styling:** Tailwind CSS (v3) & React Icons
* **Camera Integration:** HTML5-QRCode
* **QR Generator:** QRCode
* **HTTP Client:** Axios

---

## Installation & Setup

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/Debbbzxc/sams-qr.git
cd sams-project
```

### 2. Configure Environment Variables
Copy the consolidated environment configurations from the root to their respective directories.

#### For the Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-frontend.vercel.app
```

#### For the Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
Run npm installations in both root directories.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Running the Application Locally

### Start the Backend Server
From the `backend/` directory:
```bash
npm run dev
```
The backend API will run at `http://localhost:5000`. You can access the root path (`http://localhost:5000/`) in your browser to verify that the server is online.

### Start the Frontend Client
From the `frontend/` directory:
```bash
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

---

## Seeding Initial Test Accounts

To quickly test the dashboards, you can seed two default users (one Instructor and one Student):

1. Start both the backend and frontend servers.
2. Send a `POST` request to `http://localhost:5000/api/auth/seed` (using Postman, cURL, or any API client).
3. Log in using the following credentials:

* **Instructor Account:**
  * **Email / ID:** `instructor@sams.com` or `INS-001`
  * **Password:** `password123`

* **Student Account:**
  * **Email / ID:** `student@sams.com` or `STU-001`
  * **Password:** `password123`

---

## Key Configurations & Patterns

### 1. Database Connection Caching (Serverless Compatibility)
To support seamless scaling in Vercel Serverless Functions without reaching MongoDB pool limits, connection resources are cached in `backend/config/db.js`:
```javascript
const globalCache = globalThis.__samsMongoose || { conn: null, promise: null };
globalThis.__samsMongoose = globalCache;
```

### 2. Manila Timezone Alignment
To prevent server and client runtime mismatches, the application calculates range endpoints strictly within `Asia/Manila`:
* **Backend (`backend/utils/dateTime.js`):** Generates database queries starting at `00:00:00` and ending at `23:59:59` UTC+8.
* **Frontend (`frontend/src/utils/datetime.js`):** Formats localized ISO date keys using browser-native `Intl.DateTimeFormat` configurations for local reference.
