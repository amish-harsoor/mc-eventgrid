import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import UserCourses from './pages/UserCourses';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/AuthContext';

// ScrollToTop component to ensure pages start at the top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-sans text-brand-900 antialiased">
          <Header />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/user/courses" element={<ProtectedRoute><UserCourses /></ProtectedRoute>} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
