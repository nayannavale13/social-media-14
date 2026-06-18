import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUsers } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = window.localStorage.getItem('sociable_current_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const [localUsers, setLocalUsers] = useState(() => {
    try {
      const users = window.localStorage.getItem('sociable_local_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  });

  // Sync local users to localStorage
  useEffect(() => {
    window.localStorage.setItem('sociable_local_users', JSON.stringify(localUsers));
  }, [localUsers]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('sociable_current_user', JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem('sociable_current_user');
    }
  }, [currentUser]);

  /**
   * Log in user by verifying credentials against API and local users.
   * @param {string} username 
   * @param {string} email 
   */
  const login = async (username, email) => {
    try {
      const apiUsers = await fetchUsers();
      const allUsers = [...localUsers, ...apiUsers];

      const match = allUsers.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (match) {
        setCurrentUser(match);
        return { success: true, user: match };
      }
      return { success: false, error: 'Invalid username or email combination.' };
    } catch (err) {
      console.error('Login error:', err);
      // If offline or API fails, try logging in using local users only
      const match = localUsers.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (match) {
        setCurrentUser(match);
        return { success: true, user: match };
      }
      return { success: false, error: 'Database connection error and no matching local account found.' };
    }
  };

  /**
   * Log out current user.
   */
  const logout = () => {
    setCurrentUser(null);
  };

  /**
   * Create a new local user without logging them in.
   * @param {object} userData 
   */
  const createUser = (userData) => {
    const newUser = {
      id: Date.now(), // Unique ID for local users
      name: userData.name.trim(),
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      company: {
        name: userData.companyName?.trim() || 'Freelance / Self',
        catchPhrase: 'Innovating locally',
        bs: 'local network',
      },
      website: userData.website?.trim() || 'mysite.com',
      phone: userData.phone?.trim() || '1-234-567-890',
      address: {
        street: 'Local St',
        suite: 'Suite 101',
        city: 'LocalCity',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' },
      },
      isLocal: true, // Marker for locally created users
    };

    // Check if username or email already exists in local users
    const exists = localUsers.some(
      (u) =>
        u.username.toLowerCase() === newUser.username.toLowerCase() ||
        u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (exists) {
      throw new Error('Username or email already exists.');
    }

    setLocalUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  /**
   * Create a new local user and log them in immediately.
   * @param {object} userData 
   */
  const register = (userData) => {
    const newUser = createUser(userData);
    setCurrentUser(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, createUser, localUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
