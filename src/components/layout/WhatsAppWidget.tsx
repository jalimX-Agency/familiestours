'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const whatsappConfig = {
  phone: '+212631024326', // Agency WhatsApp number
  agencyName: 'Families Tours',
};

const widgetCopy = {
  en: {
    title: 'Chat with Agafay Specialist',
    subtitle: 'Typically replies in minutes',
    greeting: 'Salam & Welcome! How can we help you plan your Agafay Desert experience today?',
    cta: 'Start WhatsApp Chat',
    placeholder: 'Ask about tours, private camps, camel rides...',
    badge: 'Online Now',
  },
  fr: {
    title: 'Conseiller Spécialiste du Désert',
    subtitle: 'Réponse en quelques minutes',
    greeting: 'Salam & Bienvenue ! Comment pouvons-nous vous aider à organiser votre séjour dans le désert d\'Agafay ?',
    cta: 'Discuter sur WhatsApp',
    placeholder: 'Posez vos questions sur les circuits...',
    badge: 'En ligne',
  },
  es: {
    title: 'Especialista en el Desierto',
    subtitle: 'Responde en minutos',
    greeting: '¡Salam y bienvenidos! ¿Cómo podemos ayudarle a planificar su aventura en el desierto de Agafay?',
    cta: 'Chatear por WhatsApp',
    placeholder: 'Pregunte sobre tours, campamentos...',
    badge: 'En línea',
  },
};

export default function WhatsAppWidget() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const copy = widgetCopy[locale as keyof typeof widgetCopy] || widgetCopy.en;

  // Show subtle greeting prompt after 3 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const getContextMessage = () => {
    let context = 'Agafay Desert Experience';
    if (pathname.includes('/tours')) context = 'Desert Tours & Excursions';
    if (pathname.includes('/contact')) context = 'Tour Reservation & Booking';
    if (pathname.includes('/gallery')) context = 'Desert Photos & Camp Details';

    const greeting =
      locale === 'fr'
        ? `Bonjour Families Tours, j'aimerais avoir plus d'informations concernant (${context}).`
        : locale === 'es'
        ? `Hola Families Tours, me gustaría solicitar información sobre (${context}).`
        : `Hello Families Tours, I would like to inquire about (${context}).`;

    return customMsg.trim() ? `${greeting}\n\nNote: ${customMsg}` : greeting;
  };

  const handleStartChat = () => {
    const message = encodeURIComponent(getContextMessage());
    const cleanPhone = whatsappConfig.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Prompt Notification */}
      {showPrompt && !isOpen && (
        <div className="mb-3 max-w-xs bg-zinc-950/95 border border-amber-500/30 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-light text-white/90 leading-relaxed">
              {copy.greeting}
            </p>
            <button
              onClick={() => {
                setIsOpen(true);
                setShowPrompt(false);
              }}
              className="mt-2 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              {copy.cta} &rarr;
            </button>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border border-amber-500/50 bg-amber-500/10 flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Families Tours" className="w-full h-full object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-900"></span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{copy.title}</h4>
                <p className="text-[10px] text-emerald-400 font-light flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {copy.badge} &bull; {copy.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-4">
            <div className="bg-zinc-900/90 border border-white/5 p-3.5 rounded-xl text-xs text-white/80 leading-relaxed">
              <p>{copy.greeting}</p>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] text-amber-400/80">
                ✨ Free luxury pickup included from your Marrakech accommodation
              </div>
            </div>

            <div>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={copy.placeholder}
                rows={2}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleStartChat}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{copy.cta}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPrompt(false);
        }}
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300 border border-emerald-400/30 cursor-pointer"
        aria-label="Contact on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
        </span>
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
}
