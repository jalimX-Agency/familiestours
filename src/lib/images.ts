const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.familiestours.com';

// Official Cloudflare R2 Images for Families Tours
export const images = {
  // Hero & Background
  hero: `${CDN_BASE}/tours/hero.jpg`,
  heroOverlay: `${CDN_BASE}/tours/camel-caravan.jpg`,

  // Experiences
  camel: `${CDN_BASE}/tours/camel.jpg`,
  quad: `${CDN_BASE}/tours/quad.jpg`,
  safari4x4: `${CDN_BASE}/tours/safari4x4.jpg`,
  camp: `${CDN_BASE}/tours/camp.jpg`,
  family: `${CDN_BASE}/tours/family.jpg`,
  sunrise: `${CDN_BASE}/tours/sunrise.jpg`,
  tent: `${CDN_BASE}/tours/tent.jpg`,
  camelCaravan: `${CDN_BASE}/tours/camel-caravan.jpg`,
  quadFamily: `${CDN_BASE}/tours/quad-family.jpg`,
  dinner: `${CDN_BASE}/tours/camp.jpg`,

  // Gallery
  gallery: [
    { src: `${CDN_BASE}/tours/camel-caravan.jpg`, alt: 'Camel caravan in Agafay rocky desert', category: 'camels' },
    { src: `${CDN_BASE}/tours/camp.jpg`, alt: 'Agafay desert camp at sunset', category: 'camp' },
    { src: `${CDN_BASE}/tours/quad.jpg`, alt: 'Camel ride in Agafay rocky terrain', category: 'adventure' },
    { src: `${CDN_BASE}/tours/family.jpg`, alt: 'Family enjoying the Agafay desert', category: 'family' },
    { src: `${CDN_BASE}/tours/tent.jpg`, alt: 'Luxury tent in Agafay desert', category: 'accommodation' },
    { src: `${CDN_BASE}/tours/sunrise.jpg`, alt: 'Dromedaries at golden hour in Agafay', category: 'nature' },
    { src: `${CDN_BASE}/tours/camel.jpg`, alt: 'Camel ride experience in Agafay', category: 'camels' },
    { src: `${CDN_BASE}/tours/quad-family.jpg`, alt: 'Camel group in Agafay rocky desert', category: 'adventure' },
    { src: `${CDN_BASE}/tours/safari4x4.jpg`, alt: '4x4 safari through Agafay landscape', category: 'safari' },
    { src: `${CDN_BASE}/gallery/gallery-camels-1.jpg`, alt: 'Agafay rocky desert landscape', category: 'nature' },
    { src: `${CDN_BASE}/gallery/gallery-agafay-1.jpg`, alt: 'Agafay afternoon panorama', category: 'nature' },
    { src: `${CDN_BASE}/gallery/gallery-agafay-2.jpg`, alt: 'Agafay evening rocky terrain', category: 'nature' },
    { src: `${CDN_BASE}/gallery/gallery-agafay-3.jpg`, alt: 'Agafay rocky hills at dusk', category: 'nature' },
    { src: `${CDN_BASE}/gallery/gallery-agafay-4.jpg`, alt: 'Agafay desert at twilight', category: 'nature' },
  ],
};

// Tour packages data
export const tourPackages = [
  {
    id: 1,
    title: 'Camel Trek & Dinner',
    subtitle: 'The Classic Desert Experience',
    price: 150,
    description: 'Experience the timeless magic of Agafay on a traditional camel caravan. Watch the sunset paint the rocky terrain in gold and crimson, then indulge in an authentic Berber feast under a canopy of stars.',
    image: images.camel,
    gallery: [images.camel, images.camp, images.dinner],
    features: ['Sunset camel trek (1 hour)', 'Traditional Moroccan dinner', 'Live Berber music & entertainment', 'Mint tea ceremony', 'Atlas Mountains views'],
    duration: '4-5 hours',
    difficulty: 'Easy',
    groupSize: 'Up to 12 guests',
    highlight: true,
  },
  {
    id: 2,
    title: 'Quad Adventure & Dinner',
    subtitle: 'Adrenaline Meets Tradition',
    price: 230,
    description: 'Feel the thrill of conquering the rocky Agafay terrain on a powerful quad bike. After your desert adventure, unwind with a spectacular dinner in our exclusive camp with Atlas Mountains views.',
    image: images.quad,
    gallery: [images.quad, images.quadFamily, images.camp],
    features: ['Guided quad bike tour (1 hour)', 'Full safety equipment provided', 'Traditional Moroccan dinner', 'Professional instructor', 'Desert camp relaxation'],
    duration: '4-5 hours',
    difficulty: 'Moderate',
    groupSize: 'Up to 10 guests',
    highlight: true,
  },
  {
    id: 3,
    title: 'Ultimate Desert Combo',
    subtitle: 'Quad • Camel • Dinner',
    price: 300,
    description: 'The complete Agafay desert immersion. Begin with an exhilarating quad ride through rocky terrain, transition to a peaceful camel trek as the sun sets over the Atlas Mountains, and conclude with an unforgettable evening of Berber hospitality.',
    image: images.quadFamily,
    gallery: [images.quadFamily, images.camel, images.camp],
    features: ['Quad bike adventure (1 hour)', 'Sunset camel caravan', 'Gourmet traditional dinner', 'Berber cultural show', 'Stargazing session', 'Professional photography'],
    duration: '5-6 hours',
    difficulty: 'Moderate',
    groupSize: 'Up to 12 guests',
    highlight: true,
    signature: true,
  },
  {
    id: 4,
    title: 'Golden Sunrise Experience',
    subtitle: 'Breakfast • Quad • Camel',
    price: 300,
    description: 'Witness the Agafay desert awaken in a blaze of golden light over the Atlas Mountains. This early morning adventure combines the serenity of dawn with exciting activities and a traditional breakfast with breathtaking views.',
    image: images.sunrise,
    gallery: [images.sunrise, images.quad, images.camel],
    features: ['Pre-dawn departure from hotel', 'Sunrise viewing at panoramic point', 'Traditional Moroccan breakfast', 'Morning camel trek', 'Quad bike exploration', 'Photography opportunities'],
    duration: '5-6 hours',
    difficulty: 'Easy to Moderate',
    groupSize: 'Up to 10 guests',
    highlight: false,
  },
  {
    id: 5,
    title: 'Royal 4x4 Safari',
    subtitle: 'The Ultimate Luxury Experience',
    price: 900,
    description: 'Journey beyond the ordinary into the heart of the Agafay rocky desert in private luxury. This exclusive expedition takes you to hidden Berber villages, remote plateaus, and breathtaking Atlas panoramas few ever witness.',
    image: images.safari4x4,
    gallery: [images.safari4x4, images.tent, images.camp],
    features: ['Private 4x4 vehicle with driver', 'Extended desert exploration (full day)', 'Visit to traditional Berber village', 'Premium gourmet dinner', 'Private luxury tent accommodation', 'VIP service throughout', 'Professional photographer included', 'Customizable itinerary'],
    duration: 'Full Day + Evening',
    difficulty: 'Easy',
    groupSize: 'Private (up to 6 guests)',
    highlight: false,
    luxury: true,
  },
];

// Testimonials
export const testimonials = [
  {
    name: 'Sarah & James Wellington',
    location: 'London, United Kingdom',
    text: 'An absolutely transcendent experience. The attention to detail, the warmth of our Berber hosts, and the sheer beauty of the desert at sunset created memories our family will cherish forever. This is not merely a tour—it is a journey into the soul of Morocco.',
    rating: 5,
    tour: 'Ultimate Desert Combo',
    avatar: 'SW'
  },
  {
    name: 'The Al-Rashid Family',
    location: 'Dubai, UAE',
    text: 'We have traveled extensively, yet Desert Family Tours stands apart. The seamless organization, the genuine care for our children\'s enjoyment, and the authentic cultural immersion made this the highlight of our year. Already planning our return.',
    rating: 5,
    tour: 'Quad Adventure & Dinner',
    avatar: 'AR'
  },
  {
    name: 'Marie & Pierre Dupont',
    location: 'Paris, France',
    text: 'From the moment we were collected from our riad to the final starlit drive back, every moment was curated with elegance and authenticity. The Royal Safari exceeded our highest expectations—a true masterpiece of experiential travel.',
    rating: 5,
    tour: 'Royal 4x4 Safari',
    avatar: 'MD'
  },
  {
    name: 'The Chen Family',
    location: 'Singapore',
    text: 'Our children still speak of their camel ride as if it was a fairy tale come to life. The team\'s patience, professionalism, and genuine warmth made this accessible and magical for all ages. An extraordinary family adventure.',
    rating: 5,
    tour: 'Camel Trek & Dinner',
    avatar: 'CF'
  },
];
