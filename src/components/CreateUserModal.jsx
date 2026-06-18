import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateUserModal({ isOpen, onClose, onUserCreated }) {
  const { createUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    companyName: '',
    website: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    
    if (!formData.username.trim()) {
      tempErrors.username = 'Username is required.';
    } else if (formData.username.includes(' ')) {
      tempErrors.username = 'Username cannot contain spaces.';
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = createUser(formData);
      toast.success(`User @${newUser.username} created successfully!`);
      
      // Notify parent component to refresh list
      if (onUserCreated) onUserCreated(newUser);
      
      // Reset and close
      setFormData({
        name: '',
        username: '',
        email: '',
        companyName: '',
        website: '',
        phone: '',
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating user.');
      setErrors((prev) => ({ ...prev, username: err.message.includes('Username') ? err.message : '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Create Local User
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. johndoe"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.username}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@gmail.com"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850 transition-all"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g. acme.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1-234-567-890"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850 transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
