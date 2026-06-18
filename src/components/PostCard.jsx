import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getPostImageUrl } from '../utils/helpers';
import CommentSection from './CommentSection';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Trash2, 
  Share,
  ExternalLink 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PostCard({ post }) {
  const { currentUser } = useAuth();
  const { 
    likes, 
    savedPosts, 
    toggleLike, 
    toggleSave, 
    deletePost,
    localComments 
  } = useSocial();
  
  const [showComments, setShowComments] = useState(false);

  const isLiked = likes.includes(post.id);
  const isSaved = savedPosts.includes(post.id);
  const isOwnPost = post.userId === currentUser?.id;

  // Mock a starting like count based on post ID, plus 1 if user liked it
  const baseLikes = (post.id * 3) % 24 + 5;
  const totalLikes = isLiked ? baseLikes + 1 : baseLikes;

  // Calculate comments count: JSONPlaceholder has 5 comments per post. Plus any local comments added.
  const localCommentsCount = localComments.filter((c) => c.postId === post.id).length;
  const totalComments = post.isLocal ? localCommentsCount : 5 + localCommentsCount;

  const handleLike = (e) => {
    e.preventDefault();
    toggleLike(post.id);
    if (!isLiked) {
      toast.success('Added to liked posts');
    } else {
      toast.success('Removed from liked posts');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    toggleSave(post.id);
    if (!isSaved) {
      toast.success('Post saved successfully');
    } else {
      toast.success('Post removed from saved');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      toast.success('Post deleted successfully');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    // Simulate share
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    toast.success('Post link copied to clipboard!');
  };

  return (
    <article className="glass-card rounded-2xl p-5 md:p-6 space-y-4 hover:shadow-md transition-all duration-200 border border-slate-200/60 dark:border-slate-800/40 animate-slide-up">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-left">
          <img
            src={getAvatarUrl(post.author.username, post.author.name)}
            alt={post.author.name}
            className="h-10 w-10 rounded-full border border-indigo-100 dark:border-slate-800"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-850 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                {post.author.name}
              </span>
              {post.isLocal && (
                <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-350 text-[9px] font-bold rounded-md">
                  Local
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-none mt-0.5">
              @{post.author.username} • {post.author.company?.name || 'Freelance'}
            </p>
          </div>
        </div>

        {/* Delete / Actions */}
        {isOwnPost && (
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-slate-450 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
            title="Delete post"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-2 text-left">
        <Link to={`/posts/${post.id}`} className="group block">
          <h3 className="font-display font-bold text-lg text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed line-clamp-3">
          {post.body}
        </p>
      </div>

      {/* Image Preview (Unsplash Seed) */}
      {!post.isLocal && (
        <div className="relative rounded-xl overflow-hidden aspect-video max-h-72 border border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-950">
          <img
            src={getPostImageUrl(post.id)}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      {/* Footer Interactions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100/60 dark:border-slate-850/40 text-slate-500 dark:text-slate-400">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            isLiked 
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' 
              : 'hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/10'
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{totalLikes}</span>
        </button>

        {/* Comment Drawer Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            showComments
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20'
              : 'hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10'
          }`}
        >
          <MessageCircle className="h-4.5 w-4.5" />
          <span>{totalComments}</span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            isSaved
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
              : 'hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/10'
          }`}
        >
          <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share & More */}
        <div className="flex gap-1">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Copy link"
          >
            <Share className="h-4.5 w-4.5" />
          </button>
          
          <Link
            to={`/posts/${post.id}`}
            className="p-2 rounded-xl text-slate-450 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all"
            title="View details"
          >
            <ExternalLink className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>

      {/* Render Comment Section Inline */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </article>
  );
}
