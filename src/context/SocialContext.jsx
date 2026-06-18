import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { fetchPosts, fetchUsers, fetchComments } from '../services/api';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  const { localUsers, currentUser } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Likes and saved posts synced with localStorage
  const [likes, setLikes] = useState(() => {
    try {
      const items = window.localStorage.getItem('sociable_likes');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const items = window.localStorage.getItem('sociable_saved_posts');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  const [localPosts, setLocalPosts] = useState(() => {
    try {
      const items = window.localStorage.getItem('sociable_local_posts');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  const [localComments, setLocalComments] = useState(() => {
    try {
      const items = window.localStorage.getItem('sociable_local_comments');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  // Fetch initial posts and users
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [fetchedUsers, fetchedPosts] = await Promise.all([
          fetchUsers(),
          fetchPosts()
        ]);
        setUsers(fetchedUsers);
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        console.error('Error loading social data:', err);
        setError('Failed to fetch data from API. Serving local data only.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Sync likes to localStorage
  useEffect(() => {
    window.localStorage.setItem('sociable_likes', JSON.stringify(likes));
  }, [likes]);

  // Sync saved posts to localStorage
  useEffect(() => {
    window.localStorage.setItem('sociable_saved_posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  // Sync local posts to localStorage
  useEffect(() => {
    window.localStorage.setItem('sociable_local_posts', JSON.stringify(localPosts));
  }, [localPosts]);

  // Sync local comments to localStorage
  useEffect(() => {
    window.localStorage.setItem('sociable_local_comments', JSON.stringify(localComments));
  }, [localComments]);

  // Combine fetched users with local registered users
  const allUsers = [...localUsers, ...users];

  // Combine fetched posts with local posts
  const allPosts = [...localPosts, ...posts].map(post => {
    // Attach author details to each post
    const author = allUsers.find(u => u.id === post.userId);
    return {
      ...post,
      author: author || {
        id: post.userId,
        name: 'Deleted User',
        username: 'deleted',
        email: 'deleted@sociable.com',
        company: { name: 'Unknown' }
      }
    };
  });

  /**
   * Add a new post locally.
   * @param {string} title 
   * @param {string} body 
   */
  const addPost = (title, body) => {
    if (!currentUser) throw new Error('You must be logged in to create a post.');

    const newPost = {
      id: Date.now(), // Generate a unique numeric timestamp ID
      userId: currentUser.id,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
      isLocal: true,
    };

    setLocalPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  /**
   * Delete a locally created post.
   * @param {number|string} postId 
   */
  const deletePost = (postId) => {
    setLocalPosts((prev) => prev.filter(p => p.id !== postId));
    // Clean up associated likes and saved items
    setLikes((prev) => prev.filter(id => id !== postId));
    setSavedPosts((prev) => prev.filter(id => id !== postId));
  };

  /**
   * Toggle Like status of a post.
   * @param {number|string} postId 
   */
  const toggleLike = (postId) => {
    setLikes((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  /**
   * Toggle Save status of a post.
   * @param {number|string} postId 
   */
  const toggleSave = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  /**
   * Add a comment to a post.
   * @param {number|string} postId 
   * @param {string} commentBody 
   */
  const addComment = (postId, commentBody) => {
    if (!currentUser) throw new Error('You must be logged in to post comments.');

    const newComment = {
      id: Date.now(),
      postId: postId,
      name: currentUser.name,
      email: currentUser.email,
      body: commentBody.trim(),
      createdAt: new Date().toISOString(),
      isLocal: true,
    };

    setLocalComments((prev) => [newComment, ...prev]);
    return newComment;
  };

  /**
   * Fetches comments from API and merges with local comments for a post.
   * @param {number|string} postId 
   */
  const getPostComments = async (postId) => {
    // Get local comments for this post
    const postLocalComments = localComments.filter((c) => c.postId === postId);
    
    // If post is locally created, there are no API comments, only local ones
    const isPostLocal = localPosts.some(p => p.id === postId);
    if (isPostLocal) {
      return postLocalComments;
    }

    try {
      const apiComments = await fetchComments(postId);
      return [...postLocalComments, ...apiComments];
    } catch (err) {
      console.error(`Error loading comments for post ${postId}:`, err);
      // Fallback to local comments only if API fails
      return postLocalComments;
    }
  };

  return (
    <SocialContext.Provider
      value={{
        users: allUsers,
        posts: allPosts,
        likes,
        savedPosts,
        loading,
        error,
        addPost,
        deletePost,
        toggleLike,
        toggleSave,
        addComment,
        getPostComments,
        localPosts,
        localComments
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}
