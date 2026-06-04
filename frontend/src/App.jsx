import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            {/* --- Public Routes (Anyone can access these) --- */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* --- Protected Routes (Must be logged in to access) --- */}
            <Route 
              path="/instructor" 
              element={
                <ProtectedRoute allowedRole="Instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRole="Student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
