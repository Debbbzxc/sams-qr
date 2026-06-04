<p align="center">
  <img src="frontend/public/icon-192.png" width="120" alt="SAMS QR Logo" />
</p>

<h1 align="center">SAMS QR: Student Attendance Monitoring System via QR Code</h1>

<p align="center">
  A full-stack, timezone-safe, and Progressive Web App (PWA) enabled attendance tracking platform.
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=progressive-web-apps&logoColor=white" alt="PWA" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /></a>
</p>

---

<img width="1907" height="948" alt="Screenshot 2026-06-04 084104" src="https://github.com/user-attachments/assets/e9246d41-26bc-4e72-a89f-350d05136202" />

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
* **Runtime:** Node.js (ES Modules) <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" height="20" align="center" /></a>
* **Framework:** Express.js <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=white" height="20" align="center" /></a>
* **Database:** MongoDB (via Mongoose) <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white" height="20" align="center" /></a>
* **Authentication:** JSON Web Tokens (JWT) & BcryptJS <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens&logoColor=white" height="20" align="center" /></a>
* **Deployment Compatibility:** Vercel Serverless Function configuration (`vercel.json`) with persistent database connection caching. <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white" height="20" align="center" /></a>

### Frontend
* **Build Tool:** Vite <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" height="20" align="center" /></a>
* **Framework:** React 19 <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" height="20" align="center" /></a>
* **Router:** React Router DOM (v7)
* **Styling:** Tailwind CSS (v3) <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" height="20" align="center" /></a>
* **PWA Capability:** Progressive Web Apps <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=progressive-web-apps&logoColor=white" height="20" align="center" /></a>
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
