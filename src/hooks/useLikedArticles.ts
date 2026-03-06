import { useState, useEffect, useCallback } from 'react';
import type { WikipediaArticle } from '@/types';

interface LikedArticle {
  id: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
  likedAt: number;
}

const STORAGE_KEY = 'wikitok-liked-articles';

export function useLikedArticles() {
  const [likedArticles, setLikedArticles] = useState<LikedArticle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLikedArticles(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse liked articles:', e);
      }
    }
  }, []);

  const saveToStorage = useCallback((articles: LikedArticle[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, []);

  const isLiked = useCallback((articleId: number): boolean => {
    return likedArticles.some(a => a.id === articleId);
  }, [likedArticles]);

  const likeArticle = useCallback((article: WikipediaArticle) => {
    setLikedArticles(prev => {
      if (prev.some(a => a.id === article.id)) {
        return prev;
      }
      const newArticle: LikedArticle = {
        id: article.id,
        title: article.title,
        extract: article.extract,
        thumbnail: article.thumbnail,
        pageUrl: article.pageUrl,
        likedAt: Date.now(),
      };
      const updated = [newArticle, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const unlikeArticle = useCallback((articleId: number) => {
    setLikedArticles(prev => {
      const updated = prev.filter(a => a.id !== articleId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const toggleLike = useCallback((article: WikipediaArticle) => {
    if (isLiked(article.id)) {
      unlikeArticle(article.id);
      return false;
    } else {
      likeArticle(article);
      return true;
    }
  }, [isLiked, likeArticle, unlikeArticle]);

  const clearAllLiked = useCallback(() => {
    setLikedArticles([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    likedArticles,
    isLiked,
    likeArticle,
    unlikeArticle,
    toggleLike,
    clearAllLiked,
    likedCount: likedArticles.length,
    mounted,
  };
}
