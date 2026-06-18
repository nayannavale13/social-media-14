import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { getAvatarUrl } from '../utils/helpers';
import PostCard from '../components/PostCard';
import { ArrowLeft, Mail, Globe, Building, MapPin, ExternalLink, Users } from 'lucide-react';

export default function UserDetail() {
  const { userId } = useParams();
  const { users, posts, loading, error } = useSocial();

  const user = users.find((item) => item.id.toString() === userId.toString());
  const userPosts = posts.filter((post) => post.userId.toString() === userId.toString());

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500 dark:text-slate-400">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-rose-500">
        <p>{error}</p>
        <Link
          to="/users"
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-600 dark:text-slate-300">
        <h1 className="font-display text-3xl font-bold mb-3">User not found</h1>
        <p className="text-sm mb-5">We couldn't locate that user. Try selecting another profile from the users directory.</p>
        <Link
          to="/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
            <Users className="h-4 w-4" />
            User Details
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
        </div>
        <Link
          to="/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
            <img
              src={getAvatarUrl(user.username, user.name)}
              alt={user.name}
              className="h-28 w-28 rounded-full border-4 border-indigo-600/20 shadow-lg"
            />
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.company?.name || 'Independent'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.company?.catchPhrase || 'Building value locally'}</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-sm">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 font-semibold mb-2">Email</p>
                <a href={`mailto:${user.email}`} className="block text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                  {user.email}
                </a>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-sm">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 font-semibold mb-2">Website</p>
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                >
                  {user.website || 'No website'}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-sm">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 font-semibold mb-2">Phone</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.phone || 'Unavailable'}</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-sm">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 font-semibold mb-2">Location</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.address?.city ? `${user.address.city}, ${user.address.street}` : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/40">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.24em] font-semibold">Posts by {user.username}</p>
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">{userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Users className="h-4 w-4" /> {userPosts.filter((item) => item.isLocal).length} Local
            </span>
          </div>
          {userPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              This user has not posted yet. Explore other profiles or create a new post.
            </div>
          ) : (
            <div className="space-y-5">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
