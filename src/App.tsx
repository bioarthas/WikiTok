import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from '@/components/ArticleCard';
import { Header } from '@/components/Header';
import { LikedArticlesDrawer } from '@/components/LikedArticlesDrawer';
import { useWikipedia } from '@/hooks/useWikipedia';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useTheme } from '@/hooks/useTheme';
import { useLikedArticles } from '@/hooks/useLikedArticles';
import type { WikiLanguage } from '@/types';
import { Loader2, RefreshCw, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

function App() {
  const [language, setLanguage] = useState<WikiLanguage>('en');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [likedDrawerOpen, setLikedDrawerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollDirection } = useScrollDirection();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { likedArticles, isLiked, toggleLike, unlikeArticle, clearAllLiked, likedCount } = useLikedArticles();
  
  const { articles, loading, error, loadMoreArticles, searchArticles, refreshArticles, languageName } = useWikipedia(language);

  // Handle header visibility based on scroll direction
  useEffect(() => {
    if (scrollDirection === 'down') {
      setShowHeader(false);
    } else if (scrollDirection === 'up') {
      setShowHeader(true);
    }
  }, [scrollDirection]);

  // Intersection Observer for tracking active article
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.3,
      }
    );

    const items = container.querySelectorAll('[data-index]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [articles]);

  // Load more articles when reaching near the end
  useEffect(() => {
    if (articles.length > 0 && activeIndex >= articles.length - 2 && !loading) {
      loadMoreArticles(3);
    }
  }, [activeIndex, articles.length, loading, loadMoreArticles]);

  const handleLanguageChange = useCallback((newLang: WikiLanguage) => {
    setLanguage(newLang);
    toast.success(`Switched to ${newLang.toUpperCase()}`, {
      description: `Showing articles in ${languageName}`,
    });
  }, [languageName]);

  const handleSearch = useCallback((query: string) => {
    searchArticles(query);
    toast.info(`Searching for "${query}"`);
  }, [searchArticles]);

  const handleRefresh = () => {
    refreshArticles();
    toast.success('Feed refreshed!');
  };

  const handleToggleLike = (article: typeof articles[0]) => {
    const nowLiked = toggleLike(article);
    if (nowLiked) {
      toast.success('Added to liked articles!');
    } else {
      toast.info('Removed from liked articles');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Toaster position="top-center" richColors theme={isDark ? 'dark' : 'light'} />
      
      {/* Header with Search, Theme Toggle and Language Selector */}
      <Header
        isVisible={showHeader}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onSearch={handleSearch}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        likedCount={likedCount}
        onOpenLikedDrawer={() => setLikedDrawerOpen(true)}
      />

      {/* Liked Articles Drawer */}
      <LikedArticlesDrawer
        likedArticles={likedArticles}
        isOpen={likedDrawerOpen}
        onOpenChange={setLikedDrawerOpen}
        onUnlike={unlikeArticle}
        onClearAll={clearAllLiked}
      />

      {/* Main Feed Container */}
      <div
        ref={containerRef}
        className="min-h-screen overflow-y-scroll scroll-smooth pt-20 pb-24"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Empty State */}
          {articles.length === 0 && !loading && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Globe className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  No articles found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Try refreshing or searching for something else
                </p>
                <Button onClick={handleRefresh} variant="outline" size="lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </Button>
              </motion.div>
            </div>
          )}

          {/* Article Cards */}
          <AnimatePresence mode="popLayout">
            {articles.map((article, index) => (
              <div
                key={`${article.id}-${index}`}
                data-index={index}
              >
                <ArticleCard
                  article={article}
                  isLiked={isLiked(article.id)}
                  onToggleLike={() => handleToggleLike(article)}
                />
              </div>
            ))}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex items-center justify-center"
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Loading amazing articles...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex items-center justify-center"
            >
              <div className="text-center px-4">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bottom Spacer */}
          {articles.length > 0 && !loading && (
            <div className="py-8 text-center">
              <p className="text-gray-400 text-sm">Keep scrolling for more!</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Liked Articles Button */}
        <motion.button
          onClick={() => setLikedDrawerOpen(true)}
          className="w-12 h-12 bg-white dark:bg-gray-800 text-red-500 rounded-full shadow-lg flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Heart className="w-5 h-5" />
          {likedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {likedCount > 99 ? '99+' : likedCount}
            </span>
          )}
        </motion.button>

        {/* Refresh Button */}
        <motion.button
          onClick={handleRefresh}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Language Indicator */}
      <motion.div
        className="fixed bottom-6 left-6 z-40 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg text-sm font-medium text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {languageName}
      </motion.div>
    </div>
  );
}

export default App;
