'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Users, 
  Truck,
  ChevronRight,
  Menu,
  X,
  Heart,
  Camera,
  UtensilsCrossed,
  Sun
} from 'lucide-react';

// Real images from image search
const images = {
  hero: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/699188f13359.jpg',
  camel: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2d90656f1b2.jpg',
  quad: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8236d9fe6f52.jpg',
  safari4x4: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40ff8f0c0e1c.jpg',
  camp: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8fb99c4ca27a.jpg',
  family: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/53f19f3f0722.jpg',
  sunrise: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg',
  tent: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1da183b5d52d.jpg',
  camelCaravan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7fda9914ca7.jpg',
  quadFamily: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e66d590d1cad.jpg',
};

// Tour packages data
const tourPackages = [
  {
    id: 1,
    title: 'Camel Trek & Dinner',
    price: 150,
    description: 'Experience the magic of the desert on a traditional camel ride followed by an authentic Berber dinner under the stars.',
    image: images.camel,
    features: ['Camel ride (1 hour)', 'Traditional dinner', 'Berber entertainment', 'Tea & welcome drinks'],
    duration: '4-5 hours',
    icon: <Camera className="w-5 h-5" />,
    popular: false,
  },
  {
    id: 2,
    title: 'Quad Adventure & Dinner',
    price: 230,
    description: 'Feel the adrenaline rush as you explore the dunes on a quad bike, then relax with a delicious dinner in our desert camp.',
    image: images.quad,
    features: ['Quad bike ride (1 hour)', 'Traditional dinner', 'Safety equipment', 'Professional guide'],
    duration: '4-5 hours',
    icon: <Camera className="w-5 h-5" />,
    popular: true,
  },
  {
    id: 3,
    title: 'Ultimate Combo: Quad + Camel + Dinner',
    price: 300,
    description: 'The complete desert experience! Enjoy both quad biking and camel riding, finished with a memorable dinner under the stars.',
    image: images.quadFamily,
    features: ['Quad bike ride', 'Camel trek', 'Traditional dinner', 'Berber show', 'Tea & snacks'],
    duration: '5-6 hours',
    icon: <Star className="w-5 h-5" />,
    popular: true,
  },
  {
    id: 4,
    title: 'Sunrise Breakfast + Quad + Camel',
    price: 300,
    description: 'Start your day with an unforgettable sunrise experience including breakfast, quad adventure, and peaceful camel ride.',
    image: images.sunrise,
    features: ['Sunrise viewing', 'Traditional breakfast', 'Quad bike ride', 'Camel trek', 'Photography time'],
    duration: '5-6 hours',
    icon: <Sun className="w-5 h-5" />,
    popular: false,
  },
  {
    id: 5,
    title: '4x4 Safari & Premium Dinner',
    price: 900,
    description: 'The ultimate luxury experience! Explore remote desert locations in comfort with our 4x4 vehicle and enjoy a premium dining experience.',
    image: images.safari4x4,
    features: ['Private 4x4 vehicle', 'Extended desert exploration', 'Premium dinner', 'Private tent', 'VIP service', 'Stargazing'],
    duration: 'Full day',
    icon: <Heart className="w-5 h-5" />,
    popular: false,
    luxury: true,
  },
];

const features = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Transport Included',
    description: 'Hotel pickup and drop-off from Marrakech included in all packages'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Family Friendly',
    description: 'Safe and enjoyable activities suitable for all ages, kids welcome!'
  },
  {
    icon: <UtensilsCrossed className="w-8 h-8" />,
    title: 'Authentic Cuisine',
    description: 'Traditional Moroccan dinner prepared fresh by local Berber families'
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Expert Guides',
    description: 'Experienced local guides who know the desert like their home'
  },
];

const galleryImages = [
  { src: images.camelCaravan, alt: 'Camel caravan at sunset' },
  { src: images.camp, alt: 'Desert camp at night' },
  { src: images.quad, alt: 'Quad biking on dunes' },
  { src: images.family, alt: 'Family enjoying the desert' },
  { src: images.tent, alt: 'Luxury desert tent' },
  { src: images.sunrise, alt: 'Desert sunrise' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleBooking = (packageId: number) => {
    setSelectedPackage(packageId);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your booking request! We will contact you shortly to confirm your desert adventure.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Desert Family Tours
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-amber-600 transition-colors">Home</a>
            <a href="#packages" className="text-foreground hover:text-amber-600 transition-colors">Packages</a>
            <a href="#features" className="text-foreground hover:text-amber-600 transition-colors">Why Us</a>
            <a href="#gallery" className="text-foreground hover:text-amber-600 transition-colors">Gallery</a>
            <a href="#booking">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                Book Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#home" className="text-foreground hover:text-amber-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#packages" className="text-foreground hover:text-amber-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Packages</a>
              <a href="#features" className="text-foreground hover:text-amber-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Why Us</a>
              <a href="#gallery" className="text-foreground hover:text-amber-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
              <a href="#booking" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white w-full">
                  Book Now
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${images.hero})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30 px-4 py-2 text-sm">
            ✨ Luxury Family Desert Experiences
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the Magic of<br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Moroccan Desert
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Create unforgettable family memories with our exclusive desert tours. 
            Camel rides, quad adventures, and authentic Berber dinners await you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#packages">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg">
                Explore Packages
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="#booking">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Book Your Adventure
              </Button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">10K+</div>
              <div className="text-sm text-gray-300">Happy Families</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">15+</div>
              <div className="text-sm text-gray-300">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">4.9</div>
              <div className="text-sm text-gray-300">Rating ⭐</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gradient-to-b from-background to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-600">Our Tours</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Exclusive Tour Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose from our carefully crafted desert experiences. All packages include free hotel transport!
            </p>
          </div>

          {/* Transport Included Banner */}
          <div className="mb-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Truck className="w-8 h-8" />
              <span className="text-xl font-semibold">FREE Hotel Transport Included in All Packages!</span>
              <Truck className="w-8 h-8" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  pkg.luxury ? 'border-amber-500 border-2' : ''
                } ${pkg.popular ? 'ring-2 ring-amber-400' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                  </div>
                )}
                {pkg.luxury && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">Luxury</Badge>
                  </div>
                )}
                
                <div className="h-48 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    {pkg.icon}
                    <span className="text-sm font-medium">{pkg.duration}</span>
                  </div>
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">{pkg.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="flex-col gap-4">
                  <div className="w-full flex items-end justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">From</span>
                      <div className="text-3xl font-bold text-amber-600">{pkg.price} MAD</div>
                      <span className="text-xs text-muted-foreground">per person</span>
                    </div>
                  </div>
                  <Button 
                    className={`w-full ${
                      pkg.luxury 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white' 
                        : ''
                    }`}
                    onClick={() => handleBooking(pkg.id)}
                  >
                    Book This Package
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-600">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The Desert Family Tours Difference
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We&apos;re committed to providing your family with safe, memorable, and authentic desert experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-transparent border border-amber-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-b from-background to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-600">Gallery</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Capture The Moment
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See what awaits you on your desert adventure
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                  idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className="w-full h-full object-cover min-h-[200px] md:min-h-[300px] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-600">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                location: 'London, UK',
                text: 'Absolutely magical experience! The camel ride at sunset was breathtaking, and the dinner under the stars was unforgettable. My kids are still talking about it!',
                rating: 5,
              },
              {
                name: 'Mohammed Al-Rashid',
                location: 'Dubai, UAE',
                text: 'Best family vacation we have ever had! The quad biking was so much fun and very safe for the children. The transport was punctual and comfortable.',
                rating: 5,
              },
              {
                name: 'Marie Dupont',
                location: 'Paris, France',
                text: 'We chose the 4x4 Safari package and it exceeded all expectations. The private tent was luxurious, the food incredible, and the stargazing was mesmerizing.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {testimonial.location}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">Book Now</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready for Your Desert Adventure?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Fill out the form below and we&apos;ll get back to you within 24 hours to confirm your booking.
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedPackage && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-amber-800">
                      Selected: <strong>{tourPackages.find(p => p.id === selectedPackage)?.title}</strong> - {tourPackages.find(p => p.id === selectedPackage)?.price} MAD
                    </span>
                    <button 
                      type="button"
                      onClick={() => setSelectedPackage(null)}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (WhatsApp)</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="+212 XXX XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your group size, preferred date, and any special requests..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-6 text-lg"
                >
                  Send Booking Request
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Call Us</h3>
              <p className="text-muted-foreground">+212 XXX XXXXXX</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Email Us</h3>
              <p className="text-muted-foreground">info@desertfamilytours.com</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Available 24/7</h3>
              <p className="text-muted-foreground">We're always here for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Desert Family Tours</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Creating unforgettable family memories in the Moroccan desert since 2009. 
                Experience the magic of the Sahara with our expertly guided tours.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#packages" className="hover:text-amber-400 transition-colors">Packages</a></li>
                <li><a href="#features" className="hover:text-amber-400 transition-colors">Why Us</a></li>
                <li><a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a></li>
                <li><a href="#booking" className="hover:text-amber-400 transition-colors">Book Now</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Our Packages</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Camel + Dinner - 150 MAD</li>
                <li>Quad + Dinner - 230 MAD</li>
                <li>Quad + Camel + Dinner - 300 MAD</li>
                <li>Breakfast + Quad + Camel - 300 MAD</li>
                <li>4x4 Safari + Dinner - 900 MAD</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Desert Family Tours. All rights reserved. | Transport included in all packages 🚐</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
