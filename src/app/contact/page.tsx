'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { tourPackages } from '@/lib/images';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Calendar, Users } from 'lucide-react';

export default function ContactPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', date: '', guests: '', message: '' });
      setSelectedPackage('');
    }, 5000);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.sunrise})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase">Begin Your Journey</span>
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Reserve Your <span className="font-serif italic text-amber-400">Experience</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-xl mx-auto">
            Complete the form below and our team will craft your perfect desert escape within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
            
            {/* Form Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                /* Success State */
                <div className="bg-zinc-900/50 border border-emerald-500/30 p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-light mb-3">Request Received</h3>
                  <p className="text-white/50 mb-6">
                    Thank you for your inquiry. Our team will contact you within 24 hours to finalize your desert adventure.
                  </p>
                  <p className="text-amber-400/60 text-sm">
                    For immediate assistance: +212 XXX XXXXXX
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Experience Selection */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-4">
                      Select Your Experience
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage('')}
                        className={`p-4 border text-left transition-all duration-300 ${
                          selectedPackage === '' 
                            ? 'border-amber-400 bg-amber-400/5' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className={`text-sm ${selectedPackage === '' ? 'text-amber-400' : 'text-white/70'}`}>
                          Not Sure Yet / Custom
                        </span>
                      </button>
                      {tourPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.id.toString())}
                          className={`p-4 border text-left transition-all duration-300 ${
                            selectedPackage === pkg.id.toString() 
                              ? 'border-amber-400 bg-amber-400/5' 
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-sm ${selectedPackage === pkg.id.toString() ? 'text-amber-400' : 'text-white/70'}`}>
                              {pkg.title}
                            </span>
                            <span className="text-xs text-white/40 whitespace-nowrap">{pkg.price} MAD</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Date */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+212 XXX XXXXXX"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                      Number of Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-zinc-900">Select group size</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n} className="bg-zinc-900">
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                      <option value="10+" className="bg-zinc-900">10+ Guests (Group)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
                      Special Requests or Questions
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your family's interests, any special requirements, dietary restrictions, or questions..."
                      className="w-full bg-transparent border border-white/10 p-4 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-500 shadow-lg shadow-amber-500/25"
                  >
                    <Send className="w-4 h-4" />
                    Send Booking Request
                    <span className="w-0 h-[1px] bg-black/30 group-hover:w-8 transition-all duration-300"></span>
                  </button>

                  <p className="text-center text-white/30 text-xs">
                    By submitting this form, you agree to be contacted regarding your inquiry.
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Contact Info */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-amber-400 mb-8">Contact Us Directly</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/50 transition-colors">
                      <Phone className="w-5 h-5 text-white/50 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Phone / WhatsApp</p>
                      <a href="tel:+212XXXXXXXXX" className="text-white hover:text-amber-400 transition-colors">
                        +212 XXX XXXXXX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/50 transition-colors">
                      <Mail className="w-5 h-5 text-white/50 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Email</p>
                      <a href="mailto:info@desertfamilytours.com" className="text-white hover:text-amber-400 transition-colors">
                        info@desertfamilytours.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/50 transition-colors">
                      <MapPin className="w-5 h-5 text-white/50 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Location</p>
                      <p className="text-white">Marrakech, Morocco</p>
                      <p className="text-white/50 text-sm mt-1">Hotel pickup available</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/50 transition-colors">
                      <Clock className="w-5 h-5 text-white/50 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Availability</p>
                      <p className="text-white">24 / 7</p>
                      <p className="text-white/50 text-sm mt-1">Always ready to assist</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="border border-amber-400/20 bg-amber-400/5 p-8">
                <h4 className="font-light text-lg mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  What Happens Next?
                </h4>
                <ol className="space-y-4 text-sm text-white/60">
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-medium">01</span>
                    <span>We receive your request and review availability</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-medium">02</span>
                    <span>Our team contacts you within 24 hours</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-medium">03</span>
                    <span>We customize details to your preferences</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-medium">04</span>
                    <span>Confirm with a small deposit & get excited!</span>
                  </li>
                </ol>
              </div>

              {/* Transport Reminder */}
              <div className="border-l-2 border-emerald-500/50 pl-6 py-2">
                <p className="text-emerald-400/80 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Complimentary hotel transport included in all experiences
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

// Import images for hero background
const images = {
  sunrise: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg',
};
