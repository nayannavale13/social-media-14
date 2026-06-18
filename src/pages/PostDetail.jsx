import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { getAvatarUrl, getPostImageUrl, formatDate } from '../utils/helpers';
import CommentSection from '../components/CommentSection';
import { ArrowLeft, Clock, MessageCircle, Heart, Bookmark, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts, likes, savedPosts, toggleLike, toggleSave } = useSocial();

  const [post, setPost] = useState(null);

  useEffect(() => {
    // Find matching post by converting IDs to string
    const matched = posts.find((p) => p.id.toString() === postId.toString());
    setPost(matched);
  }, [posts, postId]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
          Post Not Found
        </h2>
        <p className="text-slate-500">The post you are trying to view does not exist or was deleted.</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 bg-indigo-650 text-white rounded-xl text-sm font-semibold transition-all hover:bg-indigo-750"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  const isLiked = likes.includes(post.id);
  const isSaved = savedPosts.includes(post.id);

  const baseLikes = (post.id * 3) % 24 + 5;
  const totalLikes = isLiked ? baseLikes + 1 : baseLikes;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 transition-all cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Main Post Card */}
      <article className="glass-card rounded-2xl p-6 md:p-8 space-y-5 border border-slate-200/60 dark:border-slate-800/40">
        
        {/* Author details */}
        <div className="flex items-center space-x-3.5">
          <img
            src={getAvatarUrl(post.author.username, post.author.name)}
            alt={post.author.name}
            className="h-11 w-11 rounded-full border border-indigo-250 dark:border-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-850 dark:text-slate-200">
                {post.author.name}
              </h3>
              {post.isLocal && (
                <span className="px-1.5 py-0.5 bg-indigo-150 text-indigo-750 text-[9px] font-bold rounded-md">
                  Local
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{post.author.username} • {post.author.company?.name || 'Freelance'}
            </p>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-slate-100 leading-tight">
          {post.title}
        </h1>

        {/* Relative date indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{post.createdAt ? formatDate(post.createdAt) : 'API Data Feed'}</span>
        </div>

        {/* Post Body */}
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {post.body}
        </p>

        {/* Post Image Preview (only API posts have images) */}
        {!post.isLocal && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 shadow-sm aspect-video max-h-96">
            <img
              src={getPostImageUrl(post.id)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Interaction Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400">
          
          {/* Like */}
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              isLiked 
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' 
                : 'hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/10'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{totalLikes} Likes</span>
          </button>

          {/* Save */}
          <button
            onClick={() => toggleSave(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              isSaved
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
                : 'hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/10'
            }`}
          >
            <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm hover:text-slate-800 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all font-semibold ml-auto"
          >
            <Share2 className="h-4.5 w-4.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Detailed Comments */}
        <div className="pt-4">
          <CommentSection postId={post.id} />
        </div>

      </article>
    </div>
  );
}
