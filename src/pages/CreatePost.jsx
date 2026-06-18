import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { PenTool, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreatePost() {
  const { addPost } = useSocial();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['General', 'Technology', 'Ideas', 'Design', 'Life', 'Coding'];

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Post title is required.';
    } else if (title.trim().length < 5) {
      tempErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!body.trim()) {
      tempErrors.body = 'Post content is required.';
    } else if (body.trim().length < 15) {
      tempErrors.body = 'Post content must be at least 15 characters long.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the validation errors.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate adding a tag by appending it or just using the API mock
      // Since JSONPlaceholder doesn't support tags, we just save title/body in localStorage
      addPost(title, body);
      toast.success('Post published successfully!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 transition-all cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Editor Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-slate-200/60 dark:border-slate-800/40">
        
        {/* Header */}
        <div className="border-b border-slate-150 dark:border-slate-800 pb-4 space-y-1">
          <h1 className="font-display font-extrabold text-2xl text-slate-855 dark:text-slate-100 flex items-center gap-2">
            <PenTool className="h-6 w-6 text-indigo-650 dark:text-indigo-400" />
            Write Something Inspiring
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400">
            Publish your article, share code blocks, or document your thought processes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="Give your article a striking headline..."
              className={`w-full px-4 py-3 rounded-xl text-sm border bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all ${
                errors.title
                  ? 'border-rose-450 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-indigo-500/20 dark:border-slate-800'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Category Selection Simulation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Topic Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-650 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-55 dark:hover:bg-slate-850 bg-slate-50/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Post Body/Content */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Article Body Content *
              </label>
              <span className="text-[10px] text-slate-400">
                {body.length} characters
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) setErrors((prev) => ({ ...prev, body: '' }));
              }}
              placeholder="Unleash your creativity here. Write down paragraphs or outline items..."
              rows="8"
              className={`w-full px-4 py-3 rounded-xl text-sm border bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all resize-y ${
                errors.body
                  ? 'border-rose-450 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-indigo-500/20 dark:border-slate-800'
              }`}
              disabled={isSubmitting}
            />
            {errors.body && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.body}
              </p>
            )}
          </div>

          {/* Tips block */}
          <div className="p-3.5 bg-indigo-50/55 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-xs text-indigo-750 dark:text-indigo-400 leading-relaxed flex gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <p>
              Publishing adds this post immediately to your feed under your author name. We persist it inside your browser session using localStorage so you won't lose it if you refresh.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-850 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-650/20 transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
