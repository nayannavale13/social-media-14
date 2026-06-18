import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import UserCard from '../components/UserCard';
import CreateUserModal from '../components/CreateUserModal';
import { UserCardSkeleton } from '../components/Skeleton';
import { Search, UserPlus, Users as UsersIcon, X, AlertCircle } from 'lucide-react';

export default function Users() {
  const { users, loading, error } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search filter logic
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.company?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header section with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/40 pb-5">
        <div className="text-left space-y-1">
          <h1 className="font-display font-extrabold text-3xl text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <UsersIcon className="h-7 w-7 text-indigo-650 dark:text-indigo-400" />
            Users Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search active profiles, check company details, or register a new member profile locally.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Add Local User</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md text-left">
        <Search className="absolute inset-y-0 left-0 pl-3.5 h-full w-4.5 text-slate-400 flex items-center pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members by name, username, or company..."
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : error && users.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-rose-500 max-w-md mx-auto space-y-2">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-500 max-w-md mx-auto space-y-3">
          <p className="italic text-sm">No members match your search criteria.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-55 transition-colors"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={() => {
          // SocialContext automatically gets updated because of localUsers state in useAuth
        }}
      />
    </div>
  );
}
