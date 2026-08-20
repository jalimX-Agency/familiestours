'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLocale, Locale, locales } from '@/context/LocaleContext';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/tours', labelKey: 'nav.experiences' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/gallery', labelKey: 'nav.gallery' },
  { href: '/contact', labelKey: 'nav.reserve' },
];

const localeNames: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
};

export default function Navbar() {
  const pathname = usePathname();
  const { locale, t, switchLocale } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current path without locale
  const currentPath = pathname.replace(`/${locale}`, '') || '/';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-md shadow-2xl shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 border border-amber-400/50 rounded-full flex items-center justify-center group-hover:bg-amber-400/10 transition-all duration-300">
                  <span className="text-amber-400 font-serif text-xl lg:text-2xl font-bold">F</span>
                </div>
                <div className="absolute inset-0 w-10 h-10 lg:w-12 lg:h-12 border border-amber-400/30 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-light text-lg lg:text-xl tracking-widest uppercase">Families Tours</h1>
                <p className="text-amber-400/80 text-[10px] lg:text-xs tracking-[0.3em] uppercase">familiestours.com</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={`relative px-5 py-2 text-sm tracking-wider uppercase transition-all duration-300 group ${
                    currentPath === link.href 
                      ? 'text-amber-400' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {(t as any)[link.labelKey.split('.')[0]][link.labelKey.split('.')[1]] || link.labelKey}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-amber-400 transition-all duration-300 ${
                    currentPath === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
              
              {/* Language Switcher */}
              <div className="relative ml-4">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{localeNames[locale]}</span>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/10 overflow-hidden shadow-xl">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full px-6 py-3 text-left text-sm tracking-wider uppercase transition-colors ${
                          locale === loc 
                            ? 'text-amber-400 bg-amber-400/10' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {loc === 'en' ? 'English' : loc === 'fr' ? 'Français' : 'Español'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href={`/${locale}/contact`}
                className="ml-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium text-sm tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/25"
              >
                {t.nav.bookNow}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-xl transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl md:text-3xl font-light tracking-widest uppercase transition-colors ${
                currentPath === link.href ? 'text-amber-400' : 'text-white/80 hover:text-white'
              }`}
            >
              {(t as any)[link.labelKey.split('.')[0]][link.labelKey.split('.')[1]] || link.labelKey}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="flex gap-4 mt-4">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  switchLocale(loc);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-medium transition-all ${
                  locale === loc 
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10' 
                    : 'border-white/20 text-white/60 hover:border-white/40'
                }`}
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
          
          <Link 
            href={`/${locale}/contact`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase"
          >
            {t.nav.bookNow}
          </Link>
        </div>
      </div>
    </>
  );
}
