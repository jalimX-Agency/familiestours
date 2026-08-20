import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border border-amber-400/50 rounded-full flex items-center justify-center">
                <span className="text-amber-400 font-serif text-2xl font-bold">D</span>
              </div>
              <div>
                <h2 className="text-white font-light text-lg tracking-widest uppercase">Desert Family</h2>
                <p className="text-amber-400/80 text-[10px] tracking-[0.3em] uppercase">Tours</p>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Crafting extraordinary desert experiences for discerning families since 2009. 
              Where luxury meets authentic Moroccan hospitality.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Experiences Column */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-400 mb-8">Experiences</h3>
            <ul className="space-y-4">
              {[
                { title: 'Camel Trek & Dinner', price: '150 MAD' },
                { title: 'Quad Adventure & Dinner', price: '230 MAD' },
                { title: 'Ultimate Desert Combo', price: '300 MAD' },
                { title: 'Golden Sunrise Experience', price: '300 MAD' },
                { title: 'Royal 4x4 Safari', price: '900 MAD' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href="/tours" className="group flex justify-between items-center text-white/60 hover:text-white transition-colors duration-300">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-xs text-amber-400/60 group-hover:text-amber-400">{item.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-400 mb-8">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Experiences', href: '/tours' },
                { label: 'Our Story', href: '/about' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Reserve', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-amber-400 group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-amber-400 mb-8">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-400/60 flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">
                  Marrakech, Morocco<br />
                  (Hotel pickup available)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-amber-400/60 flex-shrink-0" />
                <a href="tel:+212XXXXXXXXX" className="text-white/60 hover:text-white text-sm transition-colors">
                  +212 XXX XXXXXX
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-amber-400/60 flex-shrink-0" />
                <a href="mailto:info@desertfamilytours.com" className="text-white/60 hover:text-white text-sm transition-colors">
                  info@desertfamilytours.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-amber-400/60 flex-shrink-0" />
                <span className="text-white/60 text-sm">Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © 2024 Desert Family Tours. All rights reserved.
          </p>
          <p className="text-amber-400/40 text-xs tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-pulse"></span>
            Complimentary transport included in all experiences
          </p>
        </div>
      </div>
    </footer>
  );
}
