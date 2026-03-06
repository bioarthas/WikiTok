import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WikipediaArticle } from '@/types';
import { ExternalLink, BookOpen, Share2, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  article: WikipediaArticle;
  isLiked: boolean;
  onToggleLike: () => void;
}

export function ArticleCard({ article, isLiked, onToggleLike }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const extractRef = useRef<HTMLDivElement>(null);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    if (extractRef.current) {
      const element = extractRef.current;
      setCanExpand(element.scrollHeight > element.clientHeight);
    }
  }, [article.extract]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.extract.slice(0, 100) + '...',
          url: article.pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(article.pageUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Estimate read time
  const wordCount = article.extract.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Hero Section - Full width image with title overlay */}
        {article.thumbnail ? (
          <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
            <img
              src={article.thumbnail.source}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {article.title}
              </motion.h2>
              <motion.div
                className="flex items-center gap-2 mt-2 text-white/80 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Clock className="w-4 h-4" />
                {readTime} min read
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-5 sm:p-6">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {article.title}
            </motion.h2>
            <motion.div
              className="flex items-center gap-2 mt-2 text-white/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="w-4 h-4" />
              {readTime} min read
            </motion.div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 sm:p-6">
          {/* Extract - Full text with expand option */}
          <motion.div
            className="mb-5"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              ref={extractRef}
              className={`text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed ${
                isExpanded ? '' : 'line-clamp-6'
              }`}
            >
              {article.extract}
            </div>
            {canExpand && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-3 hover:underline"
              >
                {isExpanded ? 'Show less' : 'Read more...'}
              </button>
            )}
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleLike}
                className={`rounded-full transition-all ${
                  isLiked
                    ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1.5 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-1.5" />
                Share
              </Button>
            </div>
            
            <a
              href={article.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Read Full Article
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
