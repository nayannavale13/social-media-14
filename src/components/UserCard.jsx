import React from 'react';
import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../utils/helpers';
import { Globe, Building, Mail, Phone, ArrowUpRight } from 'lucide-react';

export default function UserCard({ user }) {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-slate-200/60 dark:border-slate-800/40 animate-slide-up">
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={getAvatarUrl(user.username, user.name)}
              alt={user.name}
              className="h-20 w-20 rounded-full border-2 border-indigo-500/20 p-0.5 shadow-sm"
            />
            {user.isLocal && (
              <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full shadow-md">
                Local
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mt-3 leading-snug">
            {user.name}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            @{user.username}
          </p>
        </div>

        {/* Contact & Company Details */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-850/60 text-sm text-left">
          {/* Email */}
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <a 
              href={`mailto:${user.email}`} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate text-xs font-medium"
              title={user.email}
            >
              {user.email}
            </a>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" />
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate text-xs font-medium flex items-center gap-0.5"
            >
              {user.website}
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </a>
          </div>

          {/* Company */}
          <div className="flex gap-2.5 text-slate-650 dark:text-slate-350 pt-1">
            <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">
                {user.company?.name || 'Freelance'}
              </p>
              {user.company?.catchPhrase && (
                <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5 italic leading-tight">
                  "{user.company.catchPhrase}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-850/60">
        <Link
          to={`/users/${user.id}`}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/65 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
