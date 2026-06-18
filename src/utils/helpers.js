/**
 * Returns initials of a user from their full name.
 * @param {string} name 
 */
export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Returns a high-quality SVG avatar URL based on username.
 * @param {string} username 
 * @param {string} name 
 */
export function getAvatarUrl(username, name) {
  const seed = encodeURIComponent(username || name || 'user');
  // Using dicebear multiavatar style which looks modern, friendly, and colorful
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&radius=50&backgroundColor=6375c7,4f46e5,0ea5e9,f43f5e,10b981,8b5cf6,f59e0b`;
}

/**
 * Returns a beautiful, themed Unsplash image for a post to make the UI look high fidelity.
 * @param {number|string} postId 
 */
export function getPostImageUrl(postId) {
  // A curated list of beautiful technology, nature, team, and workspace photos
  const images = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  ];
  const idx = Math.abs(parseInt(postId, 10) || 0) % images.length;
  return images[idx];
}

/**
 * Returns a readable relative or absolute date.
 * @param {string|number|Date} dateVal 
 */
export function formatDate(dateVal) {
  if (!dateVal) return 'Just now';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return 'Just now';

  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
