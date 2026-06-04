import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
// Configure CORS with allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://sams-qr-bxwb.vercel.app', 'http://localhost:5173'];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SAMS QR - Backend</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #F5FAF7 0%, #E8F8F3 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          padding: 60px 40px;
          max-width: 500px;
          text-align: center;
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        h1 {
          color: #0a8a76;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        
        .status {
          color: #636e7d;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #0a8a76;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .redirect-link {
          display: inline-block;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 14px 28px rgba(5, 150, 105, 0.22);
          border: none;
          cursor: pointer;
        }
        
        .redirect-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 45px rgba(5, 150, 105, 0.32);
          background: linear-gradient(135deg, #047857 0%, #065f46 100%);
        }
        
        .redirect-link:active {
          transform: translateY(0);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SAMS QR</h1>
        <div class="status">
          <span class="status-dot"></span>
          Backend is Running
        </div>
        <a href="https://sams-qr-bxwb.vercel.app" class="redirect-link">
          Go to SAMS QR Website
        </a>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// CRUCIAL FOR VERCEL SERVERLESS DEPLOYMENT:
export default app;
