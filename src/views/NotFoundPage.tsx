/**
 * Friendly 404 Not Found View in Gold on Black Marble Theme
 */

import React from 'react';
import { Compass, Home, Search } from 'lucide-react';
import { Logo } from '../components/Logo';

interface NotFoundPageProps {
  onNavigate: (view: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <Logo size="lg" showText={false} />
      </div>

      <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <h1 className="font-serif text-5xl font-bold shine-title mb-2">404</h1>
      <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-[#b9b09a] max-w-md mx-auto mb-8 leading-relaxed">
        The page or job vacancy you are looking for might have been moved, expired, or does not exist on JobConnect Kenya.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold px-6 py-2.5 text-xs font-semibold w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold-outline px-6 py-2.5 text-xs font-semibold w-full sm:w-auto"
        >
          <Search className="w-4 h-4" />
          <span>Browse Open Jobs</span>
        </button>
      </div>
    </div>
  );
};
