'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { tourPackages } from '@/lib/images';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Star, Send, CheckCircle, Share2, Copy, Check } from 'lucide-react';

export default function ReviewFormContent() {
  const { t, locale } = useLocale();
  const [packages] = useState<any[]>(tourPackages);
  const [formData, setFormData] = useState({
    author: '',
    location: '',
    tour: '',
    rating: 5,
    text: '',
    honeypot: '', // spam trap, left empty by real users
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: t.review.pageTitle, url: pageUrl });
        return;
      } catch {
        // user cancelled or share failed - fall through to copy
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard unavailable - no-op
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />

      <section className="pt-32 lg:pt-44 pb-16 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-mono text-amber-500 text-xs tracking-[0.3em] uppercase block mb-3">
            {locale === 'fr' ? 'Votre Avis' : locale === 'es' ? 'Tu Reseña' : 'Your Feedback'}
          </span>
          <h1 className="text-4xl md:text-5xl leading-tight mb-5 dark:text-white text-stone-900">
            <span className="font-display font-semibold tracking-tight">{t.review.pageTitle.split(' ')[0]}</span>{' '}
            <span className="font-serif italic text-amber-500">{t.review.pageTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="dark:text-zinc-400 text-stone-600 text-base font-light max-w-md mx-auto mb-6">
            {t.review.pageSubtitle}
          </p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 border dark:border-white/15 border-stone-300 dark:text-zinc-300 text-stone-700 hover:border-amber-500 hover:text-amber-500 transition-colors text-xs tracking-wider uppercase font-semibold rounded-sm"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {linkCopied ? t.review.linkCopied : t.review.copyLink}
          </button>
        </div>
      </section>

      <section className="pb-24 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-xl mx-auto px-6">
          <div className="p-8 lg:p-10 rounded-2xl dark:bg-zinc-900/70 bg-white border dark:border-white/10 border-stone-200/90 shadow-xl shadow-stone-900/5">
            {isSubmitted ? (
              <div className="text-center py-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full dark:bg-emerald-500/15 bg-emerald-100 flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-light mb-3 dark:text-white text-stone-900">{t.review.successTitle}</h2>
                <p className="dark:text-zinc-300 text-stone-600 text-sm leading-relaxed mb-8">{t.review.successMessage}</p>

                <div className="pt-6 border-t dark:border-white/10 border-stone-200">
                  <p className="font-mono text-amber-500 text-xs tracking-wider uppercase mb-2">{t.review.shareTitle}</p>
                  <p className="dark:text-zinc-400 text-stone-500 text-sm mb-4">{t.review.shareSubtitle}</p>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold tracking-wider uppercase text-xs hover:from-amber-400 hover:to-amber-500 transition-all rounded-sm"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {linkCopied ? t.review.linkCopied : t.review.copyLink}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 border border-red-500/40 bg-red-500/10 rounded-lg text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Honeypot - hidden from real users, bots often fill every field */}
                <input
                  type="text"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                  aria-hidden="true"
                />

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                    {t.review.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder={t.review.yourNamePlaceholder}
                    className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                    {t.review.yourLocation}
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t.review.yourLocationPlaceholder}
                    className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                    {t.review.whichExperience}
                  </label>
                  <select
                    required
                    value={formData.tour}
                    onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                  >
                    <option value="" className="dark:bg-zinc-900 bg-white">{t.review.selectExperience}</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.title} className="dark:bg-zinc-900 bg-white">
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-3">
                    {t.review.yourRating}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                        aria-label={`${star} stars`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || formData.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'dark:text-zinc-700 text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                    {t.review.yourReview}
                  </label>
                  <textarea
                    rows={5}
                    required
                    maxLength={2000}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder={t.review.yourReviewPlaceholder}
                    className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all resize-none text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/30 disabled:opacity-50 cursor-pointer rounded-lg"
                >
                  <Send className="w-4 h-4" />
                  {t.review.submitButton}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
