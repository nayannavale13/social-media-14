import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200 text-center font-sans">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 md:p-10 space-y-6 border border-slate-200/60 dark:border-slate-800/40 shadow-2xl animate-scale-up">
        
        {/* Graphic */}
        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-indigo-100/50 dark:border-indigo-900/30">
          <Compass className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-5xl text-indigo-600 dark:text-indigo-400">
            404
          </h1>
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
            Lost in Space?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you are looking for has either been moved, deleted, or never existed in the first place. Let's guide you back.
          </p>
        </div>

        {/* Action Link */}
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-650/15 hover:shadow-indigo-600/25 transition-all"
        >
          <span>Return Home</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>
    </div>
  );
}
