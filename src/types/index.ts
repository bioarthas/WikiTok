export interface WikipediaArticle {
  id: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
}

export type WikiLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'zh' | 'ar' 
  | 'ko' | 'nl' | 'pl' | 'tr' | 'sv' | 'id' | 'vi' | 'th' | 'hi' | 'uk';

export interface LanguageOption {
  code: WikiLanguage;
  name: string;
  flag: string;
}
