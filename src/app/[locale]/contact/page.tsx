'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { tourPackages, images } from '@/lib/images';
import { useLocale, LocaleProvider, Locale } from '@/context/LocaleContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Calendar, Users, AlertCircle, Loader2 } from 'lucide-react';

function ContactContent() {
  const { locale, t } = useLocale();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '2',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getPackageName = (pkgId: string) => {
    if (!pkgId) return 'Custom Experience';
    const pkg = tourPackages.find((p) => p.id.toString() === pkgId);
    return pkg ? pkg.title : 'Custom Experience';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: getPackageName(selectedPackage),
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          date: formData.date || new Date().toISOString().split('T')[0],
          guests: parseInt(formData.guests || '1', 10),
          message: formData.message || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking. Please try again.');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', date: '', guests: '2', message: '' });
      setSelectedPackage('');
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please reach out to us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[48vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.camel})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400"></span>
            <span className="text-amber-400 text-xs tracking-[0.35em] uppercase font-semibold drop-shadow-sm">{t.contact.beginYourJourney}</span>
            <span className="w-8 h-[1px] bg-amber-400"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-white drop-shadow-md">
            Reserve Your <span className="font-serif italic text-amber-400">Experience</span>
          </h1>
          
          <p className="text-white/90 font-light max-w-xl mx-auto drop-shadow-sm text-base">
            {t.contact.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-28 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-3 p-8 lg:p-10 rounded-2xl dark:bg-zinc-900/70 bg-white border dark:border-white/10 border-stone-200/90 shadow-xl shadow-stone-900/5">
              {isSubmitted ? (
                <div className="dark:bg-emerald-950/30 bg-emerald-50/80 border dark:border-emerald-500/30 border-emerald-300/80 p-10 rounded-xl text-center animate-in fade-in duration-500">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full dark:bg-emerald-500/15 bg-emerald-100 flex items-center justify-center shadow-inner">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-light mb-3 dark:text-white text-stone-900">{t.contact.successTitle}</h3>
                  <p className="dark:text-zinc-300 text-stone-600 mb-6 text-sm leading-relaxed">{t.contact.successMessage}</p>
                  <p className="text-amber-500 text-sm font-semibold">{t.contact.successImmediate}</p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-7 py-2.5 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black transition-all text-xs tracking-wider uppercase font-semibold rounded-sm"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMessage && (
                    <div className="p-4 border border-red-500/40 bg-red-500/10 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Experience Selection */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase font-semibold text-amber-500 mb-3">
                      {t.contact.selectExperience}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage('')}
                        className={`p-3.5 rounded-lg border text-left transition-all duration-300 ${
                          selectedPackage === '' 
                            ? 'border-amber-500 dark:bg-amber-500/15 bg-amber-50 shadow-sm' 
                            : 'dark:border-white/10 border-stone-200 hover:border-amber-500/40 dark:bg-zinc-800/40 bg-stone-50'
                        }`}
                      >
                        <span className={`text-sm font-medium ${selectedPackage === '' ? 'text-amber-500 font-semibold' : 'dark:text-zinc-300 text-stone-700'}`}>
                          {t.contact.notSureYet}
                        </span>
                      </button>
                      {tourPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.id.toString())}
                          className={`p-3.5 rounded-lg border text-left transition-all duration-300 ${
                            selectedPackage === pkg.id.toString() 
                              ? 'border-amber-500 dark:bg-amber-500/15 bg-amber-50 shadow-sm' 
                              : 'dark:border-white/10 border-stone-200 hover:border-amber-500/40 dark:bg-zinc-800/40 bg-stone-50'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className={`text-sm font-medium ${selectedPackage === pkg.id.toString() ? 'text-amber-500 font-semibold' : 'dark:text-zinc-300 text-stone-700'}`}>
                              {pkg.id === 1 ? t.packageNames.camelDinner : 
                               pkg.id === 2 ? t.packageNames.quadDinner : 
                               pkg.id === 3 ? t.packageNames.ultimateCombo : 
                               pkg.id === 4 ? t.packageNames.sunriseBreakfast : 
                               t.packageNames.safari4x4}
                            </span>
                            <span className="text-xs font-semibold text-amber-500 whitespace-nowrap">{pkg.price} MAD</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                        {t.contact.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t.contact.fullNamePlaceholder}
                        className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone & Date */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                        {t.contact.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={t.contact.phonePlaceholder}
                        className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                        {t.contact.preferredDate}
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm [color-scheme:auto]"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                      {t.contact.numberOfGuests}
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all text-sm"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n} className="dark:bg-zinc-900 bg-white">
                          {n} {n === 1 ? t.contact.guest : t.contact.guests}
                        </option>
                      ))}
                      <option value="12" className="dark:bg-zinc-900 bg-white">{t.contact.group}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase dark:text-zinc-400 text-stone-600 font-medium mb-2">
                      {t.contact.specialRequests}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.contact.specialRequestsPlaceholder}
                      className="w-full px-4 py-3 rounded-lg dark:bg-zinc-800/60 bg-stone-50 border dark:border-white/15 border-stone-300 dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all resize-none text-sm"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/30 disabled:opacity-50 cursor-pointer rounded-lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t.contact.sendBookingRequest}
                      </>
                    )}
                  </button>

                  <p className="dark:text-zinc-500 text-stone-500 text-xs text-center">
                    {t.contact.submitAgreement}
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Contact Info Card */}
              <div className="p-8 rounded-2xl dark:bg-zinc-900/60 bg-white border dark:border-white/10 border-stone-200/90 shadow-lg shadow-stone-900/5">
                <h3 className="text-xs tracking-[0.25em] uppercase font-bold text-amber-500 mb-6">{t.contact.contactDirectly}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/30 border-amber-200">
                      <Phone className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold mb-0.5">{t.contact.phoneWhatsApp}</p>
                      <a href="tel:+212XXXXXXXXX" className="dark:text-white hover:text-amber-500 text-stone-800 hover:text-amber-500 transition-colors font-medium text-sm">
                        +212 XXX XXXXXX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/30 border-amber-200">
                      <Mail className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold mb-0.5">{t.contact.emailAddress}</p>
                      <a href="mailto:info@familiestours.com" className="dark:text-white hover:text-amber-500 text-stone-800 hover:text-amber-500 transition-colors font-medium text-sm">
                        info@familiestours.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/30 border-amber-200">
                      <MapPin className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold mb-0.5">{t.contact.location}</p>
                      <p className="dark:text-white text-stone-800 font-medium text-sm">{t.contact.locationDetail}</p>
                      <p className="dark:text-zinc-400 text-stone-500 text-xs mt-0.5">{t.contact.hotelPickup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/30 border-amber-200">
                      <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold mb-0.5">{t.contact.availability}</p>
                      <p className="dark:text-white text-stone-800 font-medium text-sm">{t.contact.available247}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="rounded-2xl border dark:border-amber-500/30 border-amber-300 dark:bg-amber-500/5 bg-amber-50/90 p-6 shadow-sm">
                <h4 className="font-semibold text-base mb-3 flex items-center gap-2.5 dark:text-amber-400 text-amber-900">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  {t.contact.whatHappensNext}
                </h4>
                <ol className="space-y-2.5 text-sm dark:text-zinc-300 text-stone-700">
                  {t.contact.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="text-amber-500 font-bold">0{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Transport Reminder */}
              <div className="rounded-xl border-l-4 dark:border-emerald-500 border-emerald-600 dark:bg-emerald-950/20 bg-emerald-50 p-4 shadow-sm">
                <p className="dark:text-emerald-300 text-emerald-800 text-sm flex items-center gap-2 font-medium">
                  <Users className="w-4 h-4 text-emerald-500" />
                  {t.contact.transportReminder}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';
  
  return (
    <LocaleProvider defaultLoc={locale}>
      <ContactContent />
    </LocaleProvider>
  );
}
