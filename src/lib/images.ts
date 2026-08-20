// Real images from image search - Luxury Desert Tours
export const images = {
  // Hero & Background
  hero: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/699188f13359.jpg',
  heroOverlay: 'https://z-cdn.chatglm.cn/image-search-mpt/images-ppt/c7fda9914ca7.jpg',
  
  // Experiences
  camel: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2d90656f1b2.jpg',
  quad: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8236d9fe6f52.jpg',
  safari4x4: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40ff8f0c0e1c.jpg',
  camp: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8fb99c4ca27a.jpg',
  family: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/53f19f3f0722.jpg',
  sunrise: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg',
  tent: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1da183b5d52d.jpg',
  camelCaravan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7fda9914ca7.jpg',
  quadFamily: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e66d590d1cad.jpg',
  dinner: 'https://z-cdn.chatglm.cn/image-search-mpt/images-ppt/027a1bb77aa1.jpg',
  
  // Gallery
  gallery: [
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7fda9914ca7.jpg', alt: 'Camel caravan at sunset', category: 'camels' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8fb99c4ca27a.jpg', alt: 'Desert camp at night', category: 'camp' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8236d9fe6f52.jpg', alt: 'Quad biking on dunes', category: 'adventure' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mp/images-ppt/53f19f3f0722.jpg', alt: 'Family enjoying the desert', category: 'family' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1da183b5d52d.jpg', alt: 'Luxury desert tent', category: 'accommodation' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg', alt: 'Desert sunrise', category: 'nature' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2d90656f1b2.jpg', alt: 'Camel ride experience', category: 'camels' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e66d590d1cad.jpg', alt: 'Family quad adventure', category: 'adventure' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40ff8f0c0e1c.jpg', alt: '4x4 desert safari', category: 'safari' },
    { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f7bd0704347.jpg', alt: 'Desert camels resting', category: 'camels' },
  ],
};

// Tour packages data
export const tourPackages = [
  {
    id: 1,
    title: 'Camel Trek & Dinner',
    subtitle: 'The Classic Desert Experience',
    price: 150,
    description: 'Experience the timeless magic of the Sahara on a traditional camel caravan. Watch the sunset paint the dunes in gold and crimson, then indulge in an authentic Berber feast under a canopy of stars.',
    image: images.camel,
    gallery: [images.camel, images.camp, images.dinner],
    features: ['Sunset camel trek (1 hour)', 'Traditional Moroccan dinner', 'Live Berber music & entertainment', 'Mint tea ceremony', 'Sandboarding'],
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
    description: 'Feel the thrill of conquering golden dunes on a powerful quad bike. After your desert adventure, unwind with a spectacular dinner in our exclusive desert camp.',
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
    description: 'The complete desert immersion. Begin with an exhilarating quad ride, transition to a peaceful camel trek as the sun sets, and conclude with an unforgettable evening of Berber hospitality.',
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
    description: 'Witness the desert awaken in a blaze of golden light. This early morning adventure combines the serenity of dawn with exciting activities and a traditional breakfast in the dunes.',
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
    description: 'Journey beyond the ordinary into the heart of the Sahara in private luxury. This exclusive expedition takes you to hidden oases, remote villages, and pristine dunes few ever witness.',
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
