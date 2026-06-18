import React, { useState, useEffect } from 'react';
import { useSocial } from '../context/SocialContext';
import { getAvatarUrl, formatDate } from '../utils/helpers';
import { Send, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CommentSection({ postId }) {
  const { getPostComments, addComment } = useSocial();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments dynamically
  useEffect(() => {
    let active = true;
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await getPostComments(postId);
        if (active) {
          setComments(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError('Could not load comments.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      active = false;
    };
  }, [postId, getPostComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const added = addComment(postId, newComment);
      setComments((prev) => [added, ...prev]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-indigo-500" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Comments ({loading ? '...' : comments.length})
        </h4>
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-250 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-850 transition-all"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition-colors"
          title="Send comment"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-2 py-2">
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ) : error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1.5 py-1">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="flex gap-3 text-left p-2.5 rounded-xl bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-850/50 animate-slide-up"
            >
              <img
                src={getAvatarUrl(comment.email, comment.name)}
                alt={comment.name}
                className="h-7 w-7 rounded-full mt-0.5"
              />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-250">
                    {comment.name}
                  </h5>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500">
                    {comment.createdAt ? formatDate(comment.createdAt) : 'API'}
                  </span>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-350 mt-1 leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
