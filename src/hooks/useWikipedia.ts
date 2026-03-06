import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import type { WikipediaArticle, WikiLanguage } from '@/types';

// Wikipedia API endpoint for random articles

const languageNames: Record<WikiLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  zh: '中文',
  ar: 'العربية',
  ko: '한국어',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  sv: 'Svenska',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  hi: 'हिन्दी',
  uk: 'Українська',
};

export function useWikipedia(language: WikiLanguage = 'en') {
  const [articles, setArticles] = useState<WikipediaArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomArticle = useCallback(async (): Promise<WikipediaArticle | null> => {
    try {
      const response = await axios.get(
        `https://${language}.wikipedia.org/api/rest_v1/page/random/summary`,
        { timeout: 10000 }
      );
      
      const data = response.data;
      return {
        id: data.pageid || Math.random(),
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail,
        pageUrl: data.content_urls?.desktop?.page || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      };
    } catch (err) {
      console.error('Error fetching Wikipedia article:', err);
      return null;
    }
  }, [language]);

  const loadMoreArticles = useCallback(async (count: number = 3) => {
    setLoading(true);
    setError(null);
    
    try {
      const newArticles: WikipediaArticle[] = [];
      
      for (let i = 0; i < count; i++) {
        const article = await fetchRandomArticle();
        if (article) {
          newArticles.push(article);
        }
      }
      
      setArticles(prev => [...prev, ...newArticles]);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [fetchRandomArticle]);

  const searchArticles = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadMoreArticles(5);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://${language}.wikipedia.org/w/api.php`,
        {
          params: {
            action: 'query',
            list: 'search',
            srsearch: query,
            format: 'json',
            origin: '*',
            srlimit: 10,
          },
          timeout: 10000,
        }
      );
      
      const searchResults = response.data.query.search;
      const detailedArticles: WikipediaArticle[] = [];
      
      for (const result of searchResults.slice(0, 5)) {
        try {
          const summaryResponse = await axios.get(
            `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`,
            { timeout: 10000 }
          );
          
          const data = summaryResponse.data;
          detailedArticles.push({
            id: data.pageid || Math.random(),
            title: data.title,
            extract: data.extract,
            thumbnail: data.thumbnail,
            pageUrl: data.content_urls?.desktop?.page || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
          });
        } catch (err) {
          console.error('Error fetching article details:', err);
        }
      }
      
      setArticles(detailedArticles);
    } catch (err) {
      setError('Failed to search articles');
    } finally {
      setLoading(false);
    }
  }, [language, loadMoreArticles]);

  const refreshArticles = useCallback(() => {
    setArticles([]);
    loadMoreArticles(5);
  }, [loadMoreArticles]);

  useEffect(() => {
    refreshArticles();
  }, [language]);

  return {
    articles,
    loading,
    error,
    loadMoreArticles,
    searchArticles,
    refreshArticles,
    languageName: languageNames[language],
  };
}