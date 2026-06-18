import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Share2, Lock, Mail, User, Building, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { currentUser, login, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    companyName: '',
    website: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (isLoginMode) {
      if (!formData.username.trim()) tempErrors.username = 'Username is required.';
      if (!formData.email.trim()) {
        tempErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address.';
      }
    } else {
      if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
      if (!formData.username.trim()) {
        tempErrors.username = 'Username is required.';
      } else if (formData.username.includes(' ')) {
        tempErrors.username = 'Username cannot contain spaces.';
      }
      if (!formData.email.trim()) {
        tempErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address.';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve validation errors.');
      return;
    }

    setLoading(true);
    if (isLoginMode) {
      const res = await login(formData.username, formData.email);
      setLoading(false);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate('/', { replace: true });
      } else {
        toast.error(res.error || 'Failed to authenticate.');
      }
    } else {
      try {
        const newUser = register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          companyName: formData.companyName,
          website: formData.website,
        });
        setLoading(false);
        toast.success(`Account registered! Welcome, ${newUser.name}.`);
        navigate('/', { replace: true });
      } catch (err) {
        setLoading(false);
        toast.error(err.message || 'Registration failed.');
        setErrors((prev) => ({ 
          ...prev, 
          username: err.message.includes('Username') ? err.message : '',
          email: err.message.includes('email') ? err.message : '',
        }));
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      
      {/* Visual Banner Panel (Left Side on Large Screens) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-indigo-650 dark:bg-indigo-950 overflow-hidden text-white border-r border-indigo-700/20 shadow-2xl">
        {/* Fancy Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 opacity-90 z-0" />
        <div className="absolute top-[-20%] left-[-20%] w-[80%] aspect-square rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-violet-500/25 blur-3xl" />

        {/* Banner Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-wide">Instamedia</span>
        </div>

        {/* Content Showcase */}
        <div className="relative z-10 space-y-6 my-auto text-left max-w-md">
          <h1 className="font-display font-extrabold text-4xl leading-tight tracking-tight">
            Connect with thinkers, developers & creatives.
          </h1>
          <p className="text-indigo-100 text-base leading-relaxed">
            Instamedia leverages the JSONPlaceholder mock network, letting you create profiles, post ideas, save references, and interact in real-time.
          </p>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-indigo-200 pt-4">
            <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10">React v19</span>
            <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10">Tailwind v4</span>
            <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10">Context API</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-indigo-200/80 text-left">
          © {new Date().getFullYear()} Instamedia Inc. All rights reserved.
        </div>
      </div>

      {/* Auth Form Panel (Right Side) */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 relative">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          {/* Header Mobile Logo / Welcoming */}
          <div className="text-left">
            <div className="flex items-center gap-2.5 lg:hidden mb-6">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wide gradient-text">Instamedia</span>
            </div>
            
            <h2 className="font-display font-extrabold text-3xl tracking-tight text-slate-850 dark:text-slate-100">
              {isLoginMode ? 'Sign in to Instamedia' : 'Create an Account'}
            </h2>
            <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400">
              {isLoginMode ? (
                <>
                  No account?{' '}
                  <button 
                    onClick={() => { setIsLoginMode(false); setErrors({}); }} 
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Register locally
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button 
                    onClick={() => { setIsLoginMode(true); setErrors({}); }} 
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
            
            {/* REGISTER ONLY FIELDS */}
            {!isLoginMode && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      errors.name 
                        ? 'border-rose-400 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-800'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={isLoginMode ? "Enter username (e.g. Bret)" : "e.g. johndoe"}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                    errors.username 
                      ? 'border-rose-400 focus:ring-rose-500/20' 
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-800'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isLoginMode ? "Enter email (e.g. Sincere@april.biz)" : "e.g. johndoe@gmail.com"}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-rose-400 focus:ring-rose-500/20' 
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-800'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                </p>
              )}
            </div>

            {/* REGISTER-ONLY OPTIONAL FIELDS */}
            {!isLoginMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                {/* Company */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Building className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Corp"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Website URL
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Globe className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g. myportfolio.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hint for Login credentials to make user experience fantastic */}
            {isLoginMode && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                💡 <strong>Try logging in using:</strong><br />
                Username: <code className="bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.5 rounded">Bret</code> & 
                Email: <code className="bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.5 rounded">Sincere@april.biz</code>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-600/10 hover:shadow-sky-600/25 transition-all disabled:opacity-50 mt-6"
            >
              <span>{loading ? 'Authenticating...' : isLoginMode ? 'Sign In' : 'Create Account'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
