'use client';

import { useLanguage } from '@/lib/useLanguage';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <button
      onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-medium text-sm"
      title="Change Language"
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
