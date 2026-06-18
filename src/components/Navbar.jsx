import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/helpers';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  Home, 
  Users, 
  PlusSquare, 
  User, 
  Share2 
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem('sociable_theme') || 'light';
  });

  // Toggle Dark/Light Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('sociable_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Create Post', path: '/create-post', icon: PlusSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/55 dark:border-slate-800/50 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl gradient-text">
              Instamedia
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-slate-105'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* User Info & Settings */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-150"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Profile Brief Badge */}
            {currentUser && (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                <Link to="/profile" className="flex items-center space-x-2.5 group">
                  <img
                    src={getAvatarUrl(currentUser.username, currentUser.name)}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full border border-indigo-200 dark:border-indigo-850 group-hover:scale-105 transition-transform duration-150"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450">
                      @{currentUser.username}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-slide-up">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            
            {currentUser && (
              <div className="border-t border-slate-200 dark:border-slate-800 mt-3 pt-3 px-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={getAvatarUrl(currentUser.username, currentUser.name)}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full border border-indigo-200 dark:border-indigo-850"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium text-sm transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
