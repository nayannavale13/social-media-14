import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocialProvider } from './context/SocialContext';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocialProvider>
          {/* Main App Routes */}
          <AppRoutes />

          {/* Premium Toast Notification System */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              className: 'font-sans text-xs font-semibold rounded-2xl bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 border border-slate-150 dark:border-slate-800 shadow-xl py-3 px-4.5',
              style: {
                borderRadius: '1rem',
                fontSize: '0.825rem',
              },
              success: {
                iconTheme: {
                  primary: '#4f46e5',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </SocialProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
