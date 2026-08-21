'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images } from '@/lib/images';
import { Heart, Globe, Award, Users, Sparkles, TreePine } from 'lucide-react';

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Family First',
    description: 'Every experience is designed with multi-generational enjoyment in mind. From grandparents to grandchildren, everyone finds their moment of wonder.',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Authentic Connection',
    description: 'We facilitate genuine exchanges between your family and our Berber hosts, creating cultural bridges that last a lifetime.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Excellence Without Compromise',
    description: 'From the vehicles we use to the meals we serve, every detail meets the highest standards of quality and safety.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Local Empowerment',
    description: 'We employ and train local guides, support Berber families, and ensure tourism benefits the communities we visit.',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Creating Magic',
    description: 'We believe in the transformative power of extraordinary experiences. Every tour is an opportunity to create lifelong memories.',
  },
  {
    icon: <TreePine className="w-8 h-8" />,
    title: 'Responsible Tourism',
    description: 'We are committed to preserving the fragile desert ecosystem and minimizing our environmental footprint.',
  },
];

const team = [
  {
    name: 'Hassan El-Fassi',
    role: 'Founder & Lead Guide',
    story: 'Born in the Atlas Mountains, Hassan has spent over 20 years guiding families through the Sahara. His warmth and expertise are the foundation of everything we do.',
  },
  {
    name: 'Fatima Benhassan',
    role: 'Experience Curator',
    story: 'Fatima ensures every detail of your journey is perfect. Her attention to detail and deep understanding of hospitality excellence sets our experiences apart.',
  },
  {
    name: 'Mohammed Ait Brahim',
    role: 'Head of Operations',
    story: 'Mohammed coordinates our fleet, guides, and camp operations. His logistical mastery ensures seamless experiences for every guest.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.camelCaravan})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase">Since 2009</span>
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6">
            Our <span className="font-serif italic text-amber-400">Story</span>
          </h1>
          
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            A journey that began with a single camel and a dream to share the magic of the desert.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="relative">
              <div className="overflow-hidden">
                <img 
                  src={images.family} 
                  alt="Happy family in desert"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-amber-400/10 -z-10 hidden lg:block"></div>
              
              {/* Stats Overlay */}
              <div className="absolute -right-4 top-1/4 bg-zinc-900/90 backdrop-blur-sm border border-white/10 p-6 hidden md:block">
                <div className="text-4xl font-light text-amber-400 mb-1">15+</div>
                <div className="text-xs text-white/50 tracking-wider uppercase">Years of Excellence</div>
              </div>
            </div>

            {/* Story Content */}
            <div>
              <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-6">The Beginning</span>
              
              <h2 className="text-3xl lg:text-4xl font-light mb-8 leading-tight">
                From a Single Camel to
                <br />
                <span className="font-serif italic text-amber-400">Thousands of Smiles</span>
              </h2>
              
              <div className="space-y-6 text-white/60 leading-relaxed">
                <p>
                  In 2009, <strong className="text-white/90">Hassan El-Fassi</strong> stood at the edge of the Erg Chebbi dunes with nothing but his family&apos;s camel, a deep love for his homeland, and an audacious dream: to share the profound beauty of the Moroccan desert with families from around the world.
                </p>
                
                <p>
                  What began as one man offering sunset camel rides has blossomed into <strong className="text-white/90">Desert Family Tours</strong>—a curated collection of exceptional desert experiences that have welcomed over <strong className="text-amber-400/80">10,000 guests</strong> from every corner of the globe.
                </p>
                
                <p>
                  Our philosophy has never wavered: every family deserves to experience the desert not as tourists, but as <em className="text-white/90">honored guests</em>. This belief guides every decision we make, from the Berber families who welcome you to their camps, to the carefully crafted moments that become your most cherished memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Divider */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-amber-950/20 to-zinc-950"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-400/40 text-7xl font-serif block mb-6">&ldquo;</span>
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 italic">
            We don&apos;t just show families the desert—we help them feel its ancient rhythm, 
            hear its whispered secrets, and carry a piece of its magic home in their hearts forever.
          </blockquote>
          <p className="mt-8 text-amber-400/60 text-sm tracking-widest uppercase">— Hassan El-Fassi, Founder</p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-4">What Guides Us</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
              Our Core <span className="font-serif italic text-amber-400">Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="bg-zinc-950 p-10 lg:p-12 group hover:bg-zinc-900 transition-colors duration-500"
              >
                <div className="text-amber-400/60 mb-6 group-hover:text-amber-400 transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-light mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-4">The People Behind the Magic</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
              Meet Our <span className="font-serif italic text-amber-400">Team</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                {/* Image Placeholder with Initials */}
                <div className="aspect-[3/4] bg-gradient-to-br from-zinc-800 to-zinc-900 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-light text-amber-400/20 group-hover:text-amber-400/30 transition-colors duration-500">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white/70 text-sm leading-relaxed">{member.story}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-light mb-1">{member.name}</h3>
                <p className="text-amber-400/60 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { number: '15+', label: 'Years of Experience' },
              { number: '10K+', label: 'Happy Guests' },
              { number: '100%', label: 'Family Owned' },
              { number: '4.9', label: 'Average Rating' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-amber-400 mb-2">{stat.number}</div>
                <div className="text-white/40 text-sm tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
