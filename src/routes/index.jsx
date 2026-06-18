import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Users from '../pages/Users';
import UserDetail from '../pages/UserDetail';
import CreatePost from '../pages/CreatePost';
import Profile from '../pages/Profile';
import PostDetail from '../pages/PostDetail';
import NotFound from '../pages/NotFound';

/**
 * Standard layout for authenticated pages that includes the Navigation Bar.
 */
function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />

      {/* Protected Pages (require login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
