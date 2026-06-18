import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/helpers';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';
import { 
  Search, 
  Filter, 
  Heart, 
  Bookmark, 
  Globe, 
  PlusCircle, 
  PenTool, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  X,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { currentUser } = useAuth();
  const { 
    posts, 
    users, 
    likes, 
    savedPosts, 
    loading, 
    error, 
    addPost 
  } = useSocial();

  const [searchParams, setSearchParams] = useSearchParams();
  const feedTopRef = useRef(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, liked, saved

  // Quick post creation state
  const [quickPostTitle, setQuickPostTitle] = useState('');
  const [quickPostBody, setQuickPostBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Sync route query parameter `userId` to the author filter state
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setSelectedUserFilter(userIdParam);
    }
  }, [searchParams]);

  // Handle setting/clearing user filter
  const handleUserFilterChange = (userId) => {
    setSelectedUserFilter(userId);
    if (userId) {
      setSearchParams({ userId });
    } else {
      searchParams.delete('userId');
      setSearchParams(searchParams);
    }
    setCurrentPage(1); // Reset page
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    handleUserFilterChange('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Handle Quick Post Submit
  const handleQuickPostSubmit = (e) => {
    e.preventDefault();
    if (!quickPostTitle.trim()) {
      toast.error('Post title cannot be empty.');
      return;
    }
    if (!quickPostBody.trim()) {
      toast.error('Post content body cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      addPost(quickPostTitle, quickPostBody);
      toast.success('Post published successfully!');
      setQuickPostTitle('');
      setQuickPostBody('');
      setCurrentPage(1); // Return to first page to see new post
    } catch (err) {
      toast.error(err.message || 'Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Apply Filtering & Searching logic
  const filteredPosts = posts.filter((post) => {
    // Search match (title or body)
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase());

    // User filter match
    const matchesUser = selectedUserFilter 
      ? post.userId.toString() === selectedUserFilter.toString()
      : true;

    // Status filter match (All, Liked, Saved)
    let matchesStatus = true;
    if (statusFilter === 'liked') {
      matchesStatus = likes.includes(post.id);
    } else if (statusFilter === 'saved') {
      matchesStatus = savedPosts.includes(post.id);
    }

    return matchesSearch && matchesUser && matchesStatus;
  });

  // 2. Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to feed top
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get random sidebar suggestions
  const suggestedFollowers = users
    .filter(u => u.id !== currentUser?.id)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative" ref={feedTopRef}>
      
      {/* LEFT SIDEBAR - Quick Profile & Filters (3 Cols) */}
      <aside className="lg:col-span-3 space-y-6 hidden lg:block">
        
        {/* Profile Card */}
        {currentUser && (
          <div className="glass-card rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-indigo-500 to-indigo-650" />
            
            <div className="relative pt-6">
              <img
                src={getAvatarUrl(currentUser.username, currentUser.name)}
                alt={currentUser.name}
                className="h-16 w-16 rounded-full border-4 border-white dark:border-slate-900 mx-auto shadow-sm"
              />
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 mt-2.5">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">@{currentUser.username}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button 
                onClick={() => { setStatusFilter('liked'); setCurrentPage(1); }}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  statusFilter === 'liked'
                    ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-600'
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">
                  {likes.length}
                </span>
                <span className="text-[10px] text-slate-450 dark:text-slate-500">Liked</span>
              </button>

              <button 
                onClick={() => { setStatusFilter('saved'); setCurrentPage(1); }}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  statusFilter === 'saved'
                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-600'
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Bookmark className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">
                  {savedPosts.length}
                </span>
                <span className="text-[10px] text-slate-450 dark:text-slate-500">Saved</span>
              </button>
            </div>

            <Link 
              to="/profile" 
              className="mt-4 block w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              My Profile
            </Link>
          </div>
        )}

        {/* Global Filter Panel */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider font-display">
            Quick Status
          </h4>
          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Feed', icon: Globe, color: 'text-indigo-500' },
              { id: 'liked', label: 'Liked Posts', icon: Heart, color: 'text-rose-500' },
              { id: 'saved', label: 'Saved Posts', icon: Bookmark, color: 'text-amber-500' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    statusFilter === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MIDDLE SECTION - Feed & Post Editor (6 Cols) */}
      <main className="lg:col-span-6 space-y-6">
        
        {/* Mobile Search and Filters */}
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 pl-3.5 h-full w-4.5 text-slate-400 flex items-center pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search posts by title or keywords..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            {/* Filter by Author Select */}
            <div className="flex-1 min-w-[140px] relative">
              <select
                value={selectedUserFilter}
                onChange={(e) => handleUserFilterChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Authors</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (@{u.username})
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Mobile / Tablet Status Buttons */}
            <div className="flex gap-1.5 lg:hidden">
              {[
                { id: 'all', label: 'All', icon: Globe },
                { id: 'liked', label: 'Liked', icon: Heart },
                { id: 'saved', label: 'Saved', icon: Bookmark },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                    statusFilter === tab.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <tab.icon className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active filters summary reset */}
            {(searchQuery || selectedUserFilter || statusFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 border border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Quick Create Post Card */}
        {currentUser && (
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <img
                src={getAvatarUrl(currentUser.username, currentUser.name)}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full border border-indigo-100"
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  What's on your mind, {currentUser.name.split(' ')[0]}?
                </h4>
                <p className="text-[10px] text-slate-450">Share your thoughts instantly</p>
              </div>
            </div>

            <form onSubmit={handleQuickPostSubmit} className="space-y-3">
              <input
                type="text"
                value={quickPostTitle}
                onChange={(e) => setQuickPostTitle(e.target.value)}
                placeholder="Post Title *"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                disabled={isSubmitting}
              />
              <textarea
                value={quickPostBody}
                onChange={(e) => setQuickPostBody(e.target.value)}
                placeholder="Write your story details here... *"
                rows="3"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || !quickPostTitle.trim() || !quickPostBody.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          ) : error && posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-rose-500 space-y-3">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-4">
              <p className="text-base italic">No posts match your filters or search query.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl transition-all"
              >
                Reset Feed
              </button>
            </div>
          ) : (
            currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Local Pagination */}
        {totalPages > 1 && !loading && (
          <nav className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`h-9 w-9 text-xs font-bold rounded-xl border transition-all ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </main>

      {/* RIGHT SIDEBAR - Recommended People & Guidelines (3 Cols) */}
      <aside className="lg:col-span-3 space-y-6 hidden lg:block text-left">
        
        {/* Recommended users */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider font-display flex items-center gap-1.5">
            <Users className="h-4 w-4 text-indigo-500" />
            People you may know
          </h4>
          <div className="space-y-4">
            {suggestedFollowers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2.5">
                <Link to={`/users?userId=${user.id}`} className="flex items-center gap-2.5 hover:opacity-90 min-w-0">
                  <img
                    src={getAvatarUrl(user.username, user.name)}
                    alt={user.name}
                    className="h-8.5 w-8.5 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 truncate">
                      @{user.username}
                    </p>
                  </div>
                </Link>
                <Link
                  to={`/users?userId=${user.id}`}
                  className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] font-bold rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Profile
                </Link>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
            <Link 
              to="/users" 
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
            >
              See all active members
            </Link>
          </div>
        </div>

        {/* Help Guidelines */}
        <div className="glass-card rounded-2xl p-5 space-y-3 text-slate-500 dark:text-slate-400 text-xs">
          <h4 className="font-display font-semibold text-slate-705 dark:text-slate-300">
            💡 Useful Tips
          </h4>
          <p className="leading-relaxed">
            - Search updates dynamically inside the title or post description instantly.
          </p>
          <p className="leading-relaxed">
            - Toggle post save to access items later via the saved list filters.
          </p>
          <p className="leading-relaxed">
            - Register custom users under the <strong>Users</strong> directory to simulate logins.
          </p>
        </div>
      </aside>

    </div>
  );
}
