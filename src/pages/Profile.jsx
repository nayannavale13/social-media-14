import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { getAvatarUrl } from '../utils/helpers';
import PostCard from '../components/PostCard';
import { 
  User, 
  Mail, 
  Globe, 
  Building, 
  MapPin, 
  Phone, 
  Layers, 
  Heart, 
  Bookmark, 
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useAuth();
  const { posts, likes, savedPosts } = useSocial();

  const [activeTab, setActiveTab] = useState('my-posts'); // my-posts, liked, saved

  if (!currentUser) return null; // Route is protected anyway

  // Filter posts based on tab
  const myPostsList = posts.filter((p) => p.userId === currentUser.id);
  const likedPostsList = posts.filter((p) => likes.includes(p.id));
  const savedPostsList = posts.filter((p) => savedPosts.includes(p.id));

  const tabItems = [
    { id: 'my-posts', label: 'My Posts', count: myPostsList.length, icon: Layers, color: 'text-indigo-500' },
    { id: 'liked', label: 'Liked', count: likedPostsList.length, icon: Heart, color: 'text-rose-500' },
    { id: 'saved', label: 'Saved', count: savedPostsList.length, icon: Bookmark, color: 'text-amber-500' },
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'my-posts':
        return myPostsList;
      case 'liked':
        return likedPostsList;
      case 'saved':
        return savedPostsList;
      default:
        return [];
    }
  };

  const currentList = getActiveList();

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Profile Cover & Main Details Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/40 relative">
        <div className="h-32 md:h-44 bg-gradient-to-r from-indigo-500 via-indigo-650 to-indigo-800" />
        
        {/* Profile Info Overlay */}
        <div className="p-6 md:p-8 -mt-16 md:-mt-20 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            <img
              src={getAvatarUrl(currentUser.username, currentUser.name)}
              alt={currentUser.name}
              className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white dark:border-slate-900 shadow-md bg-white shrink-0"
            />
            <div className="mb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl text-slate-850 dark:text-slate-100">
                  {currentUser.name}
                </h1>
                {currentUser.isLocal && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-350 text-[10px] font-bold rounded-full">
                    Local Account
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">@{currentUser.username}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            <a
              href={`https://${currentUser.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-350 transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
              <span>Website</span>
            </a>
          </div>
        </div>

        {/* Profile Metadata Details Grid */}
        <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-650 dark:text-slate-350">
          
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-450 uppercase font-semibold leading-none mb-0.5">Email Address</p>
              <a href={`mailto:${currentUser.email}`} className="text-xs font-semibold hover:text-indigo-650 dark:hover:text-indigo-400">
                {currentUser.email}
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex items-center gap-3">
            <Building className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-455 uppercase font-semibold leading-none mb-0.5">Company Office</p>
              <p className="text-xs font-bold text-slate-850 dark:text-slate-205">
                {currentUser.company?.name} ({currentUser.company?.catchPhrase || 'Freelance'})
              </p>
            </div>
          </div>

          {/* Website link */}
          <div className="flex items-center gap-3">
            <Globe className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-455 uppercase font-semibold leading-none mb-0.5">Website Domain</p>
              <a href={`https://${currentUser.website}`} target="_blank" rel="noopener" className="text-xs font-semibold hover:text-indigo-650 dark:hover:text-indigo-400">
                {currentUser.website}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-455 uppercase font-semibold leading-none mb-0.5">Current Location</p>
              <p className="text-xs font-semibold text-slate-850 dark:text-slate-205">
                {currentUser.address?.street}, {currentUser.address?.city}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-455 uppercase font-semibold leading-none mb-0.5">Phone Number</p>
              <p className="text-xs font-semibold text-slate-850 dark:text-slate-205">
                {currentUser.phone || 'N/A'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs list filter */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4 md:gap-6">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 pb-3.5 text-sm font-semibold transition-all relative border-b-2 cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${tab.color}`} />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-md border border-slate-200/40 dark:border-slate-850/40">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Tab Articles Feed */}
      <div className="space-y-5">
        {currentList.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-500 space-y-4">
            <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="text-sm italic">
              {activeTab === 'my-posts' && "You haven't written any posts yet. Start publishing ideas!"}
              {activeTab === 'liked' && "You haven't liked any posts yet. Explore the feed and like some insights!"}
              {activeTab === 'saved' && "You haven't saved any posts yet. Bookmark references for future reference!"}
            </p>
            <Link
              to={activeTab === 'my-posts' ? '/create-post' : '/'}
              className="inline-block px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl transition-all"
            >
              {activeTab === 'my-posts' ? 'Write First Post' : 'Explore Feed'}
            </Link>
          </div>
        ) : (
          currentList.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
}
