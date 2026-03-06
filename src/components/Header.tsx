import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, X, ChevronDown, Sun, Moon, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { WikiLanguage, LanguageOption } from '@/types';

interface HeaderProps {
  isVisible: boolean;
  currentLanguage: WikiLanguage;
  onLanguageChange: (lang: WikiLanguage) => void;
  onSearch: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  likedCount: number;
  onOpenLikedDrawer: () => void;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

export function Header({ 
  isVisible, 
  currentLanguage, 
  onLanguageChange, 
  onSearch, 
  isDark, 
  onToggleTheme,
  likedCount,
  onOpenLikedDrawer 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const currentLang = languages.find(l => l.code === currentLanguage);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div
                  className={`relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-200 ${
                    isSearchFocused ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Search className="w-4 h-4 text-gray-400 ml-3" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search Wikipedia..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-2 px-2"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </form>

              {/* Liked Articles Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenLikedDrawer}
                className="relative rounded-full w-9 h-9 border-gray-200 dark:border-gray-700 flex-shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                aria-label="View liked articles"
              >
                <Heart className="w-4 h-4" />
                {likedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {likedCount > 9 ? '9+' : likedCount}
                  </span>
                )}
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleTheme}
                className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-700 flex-shrink-0"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-indigo-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-2.5 py-2 flex items-center gap-1.5 border-gray-200 dark:border-gray-700 flex-shrink-0"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{currentLang?.flag}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 max-h-64 overflow-auto"
                >
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code)}
                      className={`flex items-center gap-2 cursor-pointer ${
                        currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
