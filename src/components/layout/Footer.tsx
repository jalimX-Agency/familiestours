import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { locale, t } = useLocale();

  return (
    <footer className="dark:bg-black bg-gray-50 dark:text-white text-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border border-amber-500/50 rounded-full flex items-center justify-center">
                <span className="text-amber-500 font-serif text-2xl font-bold">F</span>
              </div>
              <div>
                <h2 className="dark:text-white text-gray-900 font-light text-lg tracking-widest uppercase">Families Tours</h2>
                <p className="text-amber-500/80 text-[10px] tracking-[0.3em] uppercase">familiestours.com</p>
              </div>
            </Link>
            <p className="dark:text-white/50 text-gray-600 text-sm leading-relaxed mb-8">
              {t.footer.tagline}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border dark:border-white/20 border-gray-300 rounded-full flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all duration-300 dark:text-white/60 text-gray-600">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border dark:border-white/20 border-gray-300 rounded-full flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all duration-300 dark:text-white/60 text-gray-600">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Experiences Column */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-500 mb-8">{t.footer.experiences}</h3>
            <ul className="space-y-4">
              {[
                { titleKey: 'packageNames.camelDinner', price: '150 MAD' },
                { titleKey: 'packageNames.quadDinner', price: '230 MAD' },
                { titleKey: 'packageNames.ultimateCombo', price: '300 MAD' },
                { titleKey: 'packageNames.sunriseBreakfast', price: '300 MAD' },
                { titleKey: 'packageNames.safari4x4', price: '900 MAD' },
              ].map((item, idx) => {
                const title = (t as any)[item.titleKey.split('.')[0]][item.titleKey.split('.')[1]];
                return (
                  <li key={idx}>
                    <Link href={`/${locale}/tours`} className="group flex justify-between items-center dark:text-white/60 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors duration-300">
                      <span className="text-sm">{title}</span>
                      <span className="text-xs text-amber-500/60 group-hover:text-amber-500">{item.price}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-500 mb-8">{t.footer.navigation}</h3>
            <ul className="space-y-4">
              {[
                { labelKey: 'quickLinks.home', href: '/' },
                { labelKey: 'quickLinks.experiences', href: '/tours' },
                { labelKey: 'quickLinks.about', href: '/about' },
                { labelKey: 'quickLinks.gallery', href: '/gallery' },
                { labelKey: 'quickLinks.reserve', href: '/contact' },
              ].map((link) => {
                const label = (t.footer as any)[link.labelKey.split('.')[0]][link.labelKey.split('.')[1]];
                return (
                  <li key={link.href}>
                    <Link 
                      href={`/${locale}${link.href}`}
                      className="dark:text-white/60 text-gray-600 hover:dark:text-white hover:text-gray-900 text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-[1px] bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-500 mb-8">{t.footer.contact}</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-500/60 flex-shrink-0 mt-0.5" />
                <span className="dark:text-white/60 text-gray-600 text-sm leading-relaxed">
                  {t.footer.hotelPickup}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
                <a href="tel:+212XXXXXXXXX" className="dark:text-white/60 text-gray-600 hover:dark:text-white hover:text-gray-900 text-sm transition-colors">
                  +212 XXX XXXXXX
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
                <a href="mailto:info@familiestours.com" className="dark:text-white/60 text-gray-600 hover:dark:text-white hover:text-gray-900 text-sm transition-colors">
                  info@familiestours.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
                <span className="dark:text-white/60 text-gray-600 text-sm">{t.footer.available247}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="dark:border-t border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="dark:text-white/30 text-gray-400 text-xs tracking-wider">
            © 2024 Families Tours. All rights reserved.
          </p>
          <p className="text-amber-500/40 text-xs tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-pulse"></span>
            {t.footer.transportIncluded}
          </p>
        </div>
      </div>
    </footer>
  );
}
