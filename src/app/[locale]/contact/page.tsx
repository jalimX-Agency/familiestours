'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { tourPackages } from '@/lib/images';
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
    <main className="min-h-screen dark:bg-black bg-white dark:text-white text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg)` }}
        >
          <div className="absolute inset-0 dark:bg-gradient-to-b bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
            <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase">{t.contact.beginYourJourney}</span>
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Reserve Your <span className="font-serif italic text-amber-500">Experience</span>
          </h1>
          
          <p className="dark:text-white/50 text-white/70 font-light max-w-xl mx-auto">
            {t.contact.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
            
            {/* Form Section */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                <div className="dark:bg-zinc-900/50 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-200 p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full dark:bg-emerald-500/10 bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-light mb-3">{t.contact.successTitle}</h3>
                  <p className="dark:text-white/50 text-gray-600 mb-6">{t.contact.successMessage}</p>
                  <p className="text-amber-500/60 text-sm">{t.contact.successImmediate}</p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2 border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black transition-all text-xs tracking-wider uppercase"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {errorMessage && (
                    <div className="p-4 border border-red-500/40 bg-red-500/10 rounded flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Experience Selection */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-4">
                      {t.contact.selectExperience}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage('')}
                        className={`p-4 border text-left transition-all duration-300 ${
                          selectedPackage === '' 
                            ? 'border-amber-500 dark:bg-amber-500/5 bg-amber-50' 
                            : 'dark:border-white/10 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm ${selectedPackage === '' ? 'text-amber-500' : 'dark:text-white/70 text-gray-700'}`}>
                          {t.contact.notSureYet}
                        </span>
                      </button>
                      {tourPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.id.toString())}
                          className={`p-4 border text-left transition-all duration-300 ${
                            selectedPackage === pkg.id.toString() 
                              ? 'border-amber-500 dark:bg-amber-500/5 bg-amber-50' 
                              : 'dark:border-white/10 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-sm ${selectedPackage === pkg.id.toString() ? 'text-amber-500' : 'dark:text-white/70 text-gray-700'}`}>
                              {pkg.id === 1 ? t.packageNames.camelDinner : 
                               pkg.id === 2 ? t.packageNames.quadDinner : 
                               pkg.id === 3 ? t.packageNames.ultimateCombo : 
                               pkg.id === 4 ? t.packageNames.sunriseBreakfast : 
                               t.packageNames.safari4x4}
                            </span>
                            <span className="text-xs dark:text-white/40 text-gray-500 whitespace-nowrap">{pkg.price} MAD</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                        {t.contact.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t.contact.fullNamePlaceholder}
                        className="w-full bg-transparent dark:border-b border-b dark:border-white/10 border-gray-200 py-3 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full bg-transparent dark:border-b border-b dark:border-white/10 border-gray-200 py-3 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Date */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                        {t.contact.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={t.contact.phonePlaceholder}
                        className="w-full bg-transparent dark:border-b border-b dark:border-white/10 border-gray-200 py-3 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                        {t.contact.preferredDate}
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-transparent dark:border-b border-b dark:border-white/10 border-gray-200 py-3 dark:text-white text-gray-900 focus:border-amber-500 focus:outline-none transition-colors [color-scheme:auto]"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                      {t.contact.numberOfGuests}
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="w-full bg-transparent dark:border-b border-b dark:border-white/10 border-gray-200 py-3 dark:text-white text-gray-900 focus:border-amber-500 focus:outline-none transition-colors"
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
                    <label className="block text-xs tracking-[0.2em] uppercase dark:text-white/50 text-gray-500 mb-3">
                      {t.contact.specialRequests}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.contact.specialRequestsPlaceholder}
                      className="w-full bg-transparent dark:border border dark:border-white/10 border-gray-200 p-4 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-500 shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t.contact.sendBookingRequest}
                        <span className="w-0 h-[1px] bg-black/30 group-hover:w-8 transition-all duration-300"></span>
                      </>
                    )}
                  </button>

                  <p className="center dark:text-white/30 text-gray-400 text-xs text-center">
                    {t.contact.submitAgreement}
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Contact Info */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-amber-500 mb-8">{t.contact.contactDirectly}</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 dark:border border rounded-full flex items-center justify-center flex-shrink-0 dark:border-white/10 border-gray-200 group-hover:border-amber-500/50 transition-colors">
                      <Phone className="w-5 h-5 dark:text-white/50 text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-1">{t.contact.phoneWhatsApp}</p>
                      <a href="tel:+212XXXXXXXXX" className="dark:text-white hover:text-amber-500 text-gray-700 hover:text-amber-500 transition-colors">
                        +212 XXX XXXXXX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 dark:border border rounded-full flex items-center justify-center flex-shrink-0 dark:border-white/10 border-gray-200 group-hover:border-amber-500/50 transition-colors">
                      <Mail className="w-5 h-5 dark:text-white/50 text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-1">{t.contact.emailAddress}</p>
                      <a href="mailto:info@familiestours.com" className="dark:text-white hover:text-amber-500 text-gray-700 hover:text-amber-500 transition-colors">
                        info@familiestours.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 dark:border border rounded-full flex items-center justify-center flex-shrink-0 dark:border-white/10 border-gray-200 group-hover:border-amber-500/50 transition-colors">
                      <MapPin className="w-5 h-5 dark:text-white/50 text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-1">{t.contact.location}</p>
                      <p className="dark:text-white text-gray-700">{t.contact.locationDetail}</p>
                      <p className="dark:text-white/50 text-gray-500 text-sm mt-1">{t.contact.hotelPickup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 dark:border border rounded-full flex items-center justify-center flex-shrink-0 dark:border-white/10 border-gray-200 group-hover:border-amber-500/50 transition-colors">
                      <Clock className="w-5 h-5 dark:text-white/50 text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-1">{t.contact.availability}</p>
                      <p className="dark:text-white text-gray-700">{t.contact.available247}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="dark:border border dark:border-amber-400/20 border-amber-200 dark:bg-amber-400/5 bg-amber-50 p-8">
                <h4 className="font-light text-lg mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  {t.contact.whatHappensNext}
                </h4>
                <ol className="space-y-4 text-sm dark:text-white/60 text-gray-600">
                  {t.contact.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-amber-500 font-medium">0{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Transport Reminder */}
              <div className="dark:border-l-2 border-l-2 dark:border-emerald-500/50 border-emerald-400 pl-6 py-1">
                <p className="dark:text-emerald-400/80 text-emerald-600 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
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
