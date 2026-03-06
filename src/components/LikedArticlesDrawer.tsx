import { motion } from 'framer-motion';
import { Heart, ExternalLink, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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

interface LikedArticlesDrawerProps {
  likedArticles: LikedArticle[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlike: (articleId: number) => void;
  onClearAll: () => void;
}

export function LikedArticlesDrawer({
  likedArticles,
  isOpen,
  onOpenChange,
  onUnlike,
  onClearAll,
}: LikedArticlesDrawerProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              Liked Articles
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({likedArticles.length})
              </span>
            </SheetTitle>
            {likedArticles.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {likedArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No liked articles yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                Tap the heart button on any article to save it here for later reading
              </p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {likedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  {article.thumbnail && (
                    <div className="h-24 w-full overflow-hidden">
                      <img
                        src={article.thumbnail.source}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Liked on {formatDate(article.likedAt)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {article.extract}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={article.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUnlike(article.id)}
                        className="rounded-lg border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
