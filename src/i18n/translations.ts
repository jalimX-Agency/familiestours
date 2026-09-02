export const locales = ['en', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    experiences: string;
    about: string;
    gallery: string;
    reserve: string;
    bookNow: string;
  };
  
  // Hero Section
  hero: {
    location: string;
    title1: string;
    title2: string;
    subtitle: string;
    discover: string;
    viewGallery: string;
    scroll: string;
  };
  
  // Home Page
  home: {
    curatedForYou: string;
    signatureExperiences: string;
    viewAllExperiences: string;
    quote: string;
    quoteAuthor: string;
    difference: string;
    whyChooseUs: string;
    values: {
      title: string;
      description: string;
    }[];
    guestStories: string;
    beginJourney: string;
    ctaTitle: string;
    ctaSubtitle: string;
    reserveExperience: string;
  };
  
  // Tours/Experiences
  tours: {
    pageTitle: string;
    pageSubtitle: string;
    transportIncluded: string;
    transportDetail: string;
    allExperiences: string;
    familyAdventures: string;
    luxuryPrivate: string;
    startingFrom: string;
    perPerson: string;
    signature: string;
    luxury: string;
    duration: string;
    difficulty: string;
    groupSize: string;
    whatsIncluded: string;
    bookThisExperience: string;
    customTitle: string;
    customSubtitle: string;
    requestCustom: string;
    features: {
      camelTrek: string;
      traditionalDinner: string;
      liveMusic: string;
      mintTea: string;
      sandboarding: string;
      quadTour: string;
      safetyEquipment: string;
      professionalInstructor: string;
      desertCampRelaxation: string;
      quadAdventure: string;
      sunsetCamel: string;
      gourmetDinner: string;
      berberShow: string;
      stargazing: string;
      professionalPhotography: string;
      preDawnDeparture: string;
      sunriseViewing: string;
      traditionalBreakfast: string;
      morningCamelTrek: string;
      quadExploration: string;
      photographyOpportunities: string;
      private4x4: string;
      extendedExploration: string;
      berberVillage: string;
      premiumDinner: string;
      privateTent: string;
      vipService: string;
      photographerIncluded: string;
      customizableItinerary: string;
    };
    packages: {
      title: string;
      subtitle: string;
      description: string;
    }[];
  };
  
  // About Page
  about: {
    pageTitle: string;
    pageSubtitle: string;
    since: string;
    theBeginning: string;
    storyTitle: string;
    storySubtitle: string;
    storyP1: string;
    storyP2: string;
    storyP3: string;
    founderQuote: string;
    founderName: string;
    guidesUs: string;
    coreValues: string;
    values: {
      title: string;
      description: string;
    }[];
    teamTitle: string;
    teamSubtitle: string;
    yearsOfExperience: string;
    happyGuests: string;
    familyOwned: string;
    averageRating: string;
    yearsOfExperienceLabel: string;
    happyGuestsLabel: string;
    familyOwnedLabel: string;
    averageRatingLabel: string;
    team: {
      name: string;
      role: string;
      story: string;
    }[];
  };
  
  // Gallery Page
  gallery: {
    pageTitle: string;
    pageSubtitle: string;
    visualJourney: string;
    glimpses: string;
    all: string;
    camels: string;
    adventure: string;
    camp: string;
    nature: string;
    photos: string;
    createMemories: string;
    galleryCta: string;
    startJourney: string;
    categories: {
      camels: string;
      adventure: string;
      camp: string;
      nature: string;
    };
  };
  
  // Contact Page
  contact: {
    pageTitle: string;
    pageSubtitle: string;
    beginYourJourney: string;
    formDescription: string;
    selectExperience: string;
    notSureYet: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    preferredDate: string;
    numberOfGuests: string;
    selectGroupSize: string;
      guest: string;
      guests: string;
      group: string;
    specialRequests: string;
    specialRequestsPlaceholder: string;
    sendBookingRequest: string;
    submitAgreement: string;
    contactDirectly: string;
    phoneWhatsApp: string;
    emailAddress: string;
    location: string;
    locationDetail: string;
    hotelPickup: string;
    availability: string;
    alwaysReady: string;
    whatHappensNext: string;
    steps: string[];
    transportReminder: string;
    successTitle: string;
    successMessage: string;
    successImmediate: string;
  };
  
  // Footer
  footer: {
    tagline: string;
    experiences: string;
    navigation: string;
    contact: string;
    hotelPickup: string;
    available247: string;
    copyright: string;
    transportIncluded: string;
    quickLinks: {
      home: string;
      experiences: string;
      about: string;
      gallery: string;
      reserve: string;
    };
  };

  // Package names (keep original for consistency)
  packageNames: {
    camelDinner: string;
    quadDinner: string;
    ultimateCombo: string;
    sunriseBreakfast: string;
    safari4x4: string;
  };
  
  packageSubtitles: {
    camelDinner: string;
    quadDinner: string;
    ultimateCombo: string;
    sunriseBreakfast: string;
    safari4x4: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: 'Home',
      experiences: 'Experiences',
      about: 'Our Story',
      gallery: 'Gallery',
      reserve: 'Reserve',
      bookNow: 'Book Now',
    },
    hero: {
      location: 'Morocco • Agafay Desert',
      title1: 'Where Golden Dunes',
      title2: 'Meet Family Dreams',
      subtitle: 'Curated desert experiences that weave together adventure, culture, and unforgettable family moments in the heart of Morocco.',
      discover: 'Discover Experiences',
      viewGallery: 'View Gallery',
      scroll: 'Scroll',
    },
    home: {
      curatedForYou: 'Curated For You',
      signatureExperiences: 'Signature Experiences',
      viewAllExperiences: 'View All Experiences',
      quote: 'The desert has a voice for those who listen—it speaks of timelessness, wonder, and the joy of shared moments under infinite stars.',
      quoteAuthor: 'Berber Proverb',
      difference: 'The Difference',
      whyChooseUs: 'Why Families Choose Us',
      values: [
        { title: 'Complimentary Transport', description: 'Luxury hotel pickup and return included in every experience' },
        { title: 'Family-Centered Design', description: 'Every activity crafted for multi-generational enjoyment and safety' },
        { title: 'Authentic Hospitality', description: 'Traditional Berber families welcome you as honored guests' },
        { title: 'Local Expertise', description: 'Guides who have walked these dunes for generations' },
      ],
      guestStories: 'Guest Stories',
      beginJourney: 'Begin Your Journey',
      ctaTitle: 'Ready to Create Timeless Memories?',
      ctaSubtitle: "Let us craft your perfect desert escape. Every detail tailored to your family's dreams.",
      reserveExperience: 'Reserve Your Experience',
    },
    tours: {
      pageTitle: 'Desert Experiences',
      pageSubtitle: 'Each experience is meticulously crafted to offer your family an authentic journey into the heart of Moroccan desert culture.',
      transportIncluded: '✦ Complimentary Hotel Transport Included in All Experiences',
      transportDetail: 'Pickup & drop-off from your accommodation',
      allExperiences: 'All Experiences',
      familyAdventures: 'Family Adventures',
      luxuryPrivate: 'Luxury & Private',
      startingFrom: 'Starting from',
      perPerson: '/ person',
      signature: 'Signature',
      luxury: 'Luxury',
      duration: 'Duration',
      difficulty: 'Difficulty',
      groupSize: 'Group Size',
      whatsIncluded: "What's Included",
      bookThisExperience: 'Book This Experience',
      customTitle: 'Something Unique in Mind?',
      customSubtitle: 'Every family is unique. Let us create a bespoke desert experience tailored precisely to your dreams and desires.',
      requestCustom: 'Request Custom Experience',
      features: {
        camelTrek: 'Sunset camel trek (1 hour)',
        traditionalDinner: 'Traditional Moroccan dinner',
        liveMusic: 'Live Berber music & entertainment',
        mintTea: 'Mint tea ceremony',
        sandboarding: 'Sandboarding',
        quadTour: 'Guided quad bike tour (1 hour)',
        safetyEquipment: 'Full safety equipment provided',
        professionalInstructor: 'Professional instructor',
        desertCampRelaxation: 'Desert camp relaxation',
        quadAdventure: 'Quad bike adventure (1 hour)',
        sunsetCamel: 'Sunset camel caravan',
        gourmetDinner: 'Gourmet traditional dinner',
        berberShow: 'Berber cultural show',
        stargazing: 'Stargazing session',
        professionalPhotography: 'Professional photography',
        preDawnDeparture: 'Pre-dawn departure from hotel',
        sunriseViewing: 'Sunrise viewing at panoramic point',
        traditionalBreakfast: 'Traditional Moroccan breakfast',
        morningCamelTrek: 'Morning camel trek',
        quadExploration: 'Quad bike exploration',
        photographyOpportunities: 'Photography opportunities',
        private4x4: 'Private 4x4 vehicle with driver',
        extendedExploration: 'Extended desert exploration (full day)',
        berberVillage: 'Visit to traditional Berber village',
        premiumDinner: 'Premium gourmet dinner',
        privateTent: 'Private luxury tent accommodation',
        vipService: 'VIP service throughout',
        photographerIncluded: 'Professional photographer included',
        customizableItinerary: 'Customizable itinerary',
      },
      packages: [
        {
          title: 'Camel Trek & Dinner',
          subtitle: 'The Classic Desert Experience',
          description: 'Experience the timeless magic of Agafay on a traditional camel caravan. Watch the sunset paint the rocky terrain in gold and crimson, then indulge in an authentic Berber feast under a canopy of stars.',
        },
        {
          title: 'Quad Adventure & Dinner',
          subtitle: 'Adrenaline Meets Tradition',
          description: 'Feel the thrill of conquering golden dunes on a powerful quad bike. After your desert adventure, unwind with a spectacular dinner in our exclusive desert camp.',
        },
        {
          title: 'Ultimate Desert Combo',
          subtitle: 'Quad • Camel • Dinner',
          description: 'The complete desert immersion. Begin with an exhilarating quad ride, transition to a peaceful camel trek as the sun sets, and conclude with an unforgettable evening of Berber hospitality.',
        },
        {
          title: 'Golden Sunrise Experience',
          subtitle: 'Breakfast • Quad • Camel',
          description: 'Witness the desert awaken in a blaze of golden light. This early morning adventure combines the serenity of dawn with exciting activities and a traditional breakfast in the dunes.',
        },
        {
          title: 'Royal 4x4 Safari',
          subtitle: 'The Ultimate Luxury Experience',
          description: 'Journey beyond the ordinary into the heart of the Agafay rocky desert in private luxury. This exclusive expedition takes you to hidden Berber villages, remote plateaus, and breathtaking Atlas panoramas few ever witness.',
        },
      ],
    },
    about: {
      pageTitle: 'Our Story',
      pageSubtitle: 'A journey that began with a single camel and a dream to share the magic of the desert.',
      since: 'Since 2009',
      theBeginning: 'The Beginning',
      storyTitle: 'From a Single Camel to Thousands of Smiles',
      storySubtitle: '',
      storyP1: 'In 2009, Hassan El-Fassi stood at the edge of the Erg Chebbi dunes with nothing but his family\'s camel, a deep love for his homeland, and an audacious dream: to share the profound beauty of the Moroccan desert with families from around the world.',
      storyP2: 'What began as one man offering sunset camel rides has blossomed into Families Tours—a curated collection of exceptional desert experiences that have welcomed over 10,000 guests from every corner of the globe.',
      storyP3: 'Our philosophy has never wavered: every family deserves to experience the desert not as tourists, but as honored guests. This belief guides every decision we make, from the Berber families who welcome you to their camps, to the carefully crafted moments that become your most cherished memories.',
      founderQuote: "We don't just show families the desert—we help them feel its ancient rhythm, hear its whispered secrets, and carry a piece of its magic home in their hearts forever.",
      founderName: '— Hassan El-Fassi, Founder',
      guidesUs: 'What Guides Us',
      coreValues: 'Our Core Values',
      values: [
        { title: 'Family First', description: 'Every experience is designed with multi-generational enjoyment in mind. From grandparents to grandchildren, everyone finds their moment of wonder.' },
        { title: 'Authentic Connection', description: 'We facilitate genuine exchanges between your family and our Berber hosts, creating cultural bridges that last a lifetime.' },
        { title: 'Excellence Without Compromise', description: 'From the vehicles we use to the meals we serve, every detail meets the highest standards of quality and safety.' },
        { title: 'Local Empowerment', description: 'We employ and train local guides, support Berber families, and ensure tourism benefits the communities we visit.' },
        { title: 'Creating Magic', description: 'We believe in the transformative power of extraordinary experiences. Every tour is an opportunity to create lifelong memories.' },
        { title: 'Responsible Tourism', description: 'We are committed to preserving the fragile desert ecosystem and minimizing our environmental footprint.' },
      ],
      teamTitle: 'Meet Our Team',
      teamSubtitle: 'The People Behind the Magic',
      yearsOfExperience: '15+',
      happyGuests: '10K+',
      familyOwned: '100%',
      averageRating: '4.9',
      yearsOfExperienceLabel: 'Years of Experience',
      happyGuestsLabel: 'Happy Guests',
      familyOwnedLabel: 'Family Owned',
      averageRatingLabel: 'Average Rating',
      team: [
        {
          name: 'Hassan El-Fassi',
          role: 'Founder & Lead Guide',
          story: 'Born in the Atlas Mountains, Hassan has spent over 20 years guiding families through the Agafay desert. His warmth and expertise are the foundation of everything we do.',
        },
        {
          name: 'Fatima Benhassan',
          role: 'Experience Curator',
          story: 'Fatima ensures every detail of your journey is perfect. Her attention to detail and deep understanding of hospitality excellence set our experiences apart.',
        },
        {
          name: 'Mohammed Ait Brahim',
          role: 'Head of Operations',
          story: 'Mohammed coordinates our fleet, guides, and camp operations. His logistical mastery ensures seamless experiences for every guest.',
        },
      ],
    },
    gallery: {
      pageTitle: 'Desert Gallery',
      pageSubtitle: 'Glimpses of the magic that awaits your family',
      visualJourney: 'Visual Journey',
      glimpses: 'Glimpses of the magic that awaits your family',
      all: 'All',
      camels: 'Camels',
      adventure: 'Adventure',
      camp: 'Camp',
      nature: 'Nature',
      photos: 'photos',
      createMemories: "Ready to Create Your Own Desert Memories?",
      galleryCta: 'These moments are waiting for your family. Let us craft your perfect desert experience.',
      startJourney: 'Start Your Journey',
      categories: {
        camels: 'Camels',
        adventure: 'Adventure',
        camp: 'Camp',
        nature: 'Nature',
      },
    },
    contact: {
      pageTitle: 'Reserve Your Experience',
      pageSubtitle: 'Complete the form below and our team will craft your perfect desert escape within 24 hours.',
      beginYourJourney: 'Begin Your Journey',
      formDescription: "Complete the form below and our team will craft your perfect desert escape within 24 hours.",
      selectExperience: 'Select Your Experience',
      notSureYet: 'Not Sure Yet / Custom',
      fullName: 'Full Name *',
      fullNamePlaceholder: 'Your full name',
      email: 'Email Address *',
      emailPlaceholder: 'your@email.com',
      phone: 'Phone / WhatsApp',
      phonePlaceholder: '+212 XXX XXXXXX',
      preferredDate: 'Preferred Date',
      numberOfGuests: 'Number of Guests',
      selectGroupSize: 'Select group size',
      guest: 'Guest',
      guests: 'Guests',
      group: 'Guests (Group)',
      specialRequests: 'Special Requests or Questions',
      specialRequestsPlaceholder: "Tell us about your family's interests, any special requirements, dietary restrictions, or questions...",
      sendBookingRequest: 'Send Booking Request',
      submitAgreement: 'By submitting this form, you agree to be contacted regarding your inquiry.',
      contactDirectly: 'Contact Us Directly',
      phoneWhatsApp: 'Phone / WhatsApp',
      emailAddress: 'Email',
      location: 'Location',
      locationDetail: 'Marrakech, Morocco',
      hotelPickup: 'Hotel pickup available',
      availability: 'Availability',
      alwaysReady: 'Always ready to assist',
      whatHappensNext: 'What Happens Next?',
      steps: [
        'We receive your request and review availability',
        'Our team contacts you within 24 hours',
        'We customize details to your preferences',
        'Confirm with a small deposit & get excited!',
      ],
      transportReminder: 'Complimentary hotel transport included in all experiences',
      successTitle: 'Request Received',
      successMessage: 'Thank you for your inquiry. Our team will contact you within 24 hours to finalize your desert adventure.',
      successImmediate: 'For immediate assistance: +212 XXX XXXXXX',
    },
    footer: {
      tagline: 'Crafting extraordinary desert experiences for discerning families since 2009. Where luxury meets authentic Moroccan hospitality.',
      experiences: 'Experiences',
      navigation: 'Navigation',
      contact: 'Contact',
      hotelPickup: 'Marrakech, Morocco (Hotel pickup available)',
      available247: 'Available 24/7',
      copyright: '© 2024 Families Tours. All rights reserved.',
      transportIncluded: 'Complimentary transport included in all experiences',
      quickLinks: {
        home: 'Home',
        experiences: 'Experiences',
        about: 'Our Story',
        gallery: 'Gallery',
        reserve: 'Reserve',
      },
    },
    packageNames: {
      camelDinner: 'Camel Trek & Dinner',
      quadDinner: 'Quad Adventure & Dinner',
      ultimateCombo: 'Ultimate Desert Combo',
      sunriseBreakfast: 'Golden Sunrise Experience',
      safari4x4: 'Royal 4x4 Safari',
    },
    packageSubtitles: {
      camelDinner: 'The Classic Desert Experience',
      quadDinner: 'Adrenaline Meets Tradition',
      ultimateCombo: 'Quad • Camel • Dinner',
      sunriseBreakfast: 'Breakfast • Quad • Camel',
      safari4x4: 'The Ultimate Luxury Experience',
    },
  },

  // French Translations
  fr: {
    nav: {
      home: 'Accueil',
      experiences: 'Expériences',
      about: 'Notre Histoire',
      gallery: 'Galerie',
      reserve: 'Réserver',
      bookNow: 'Réserver',
    },
    hero: {
      location: 'Maroc • Désert d\'Agafay',
      title1: 'Où les Dunes Dorées',
      title2: 'Rencontrent les Rêves Familiaux',
      subtitle: 'Expériences désertiques soigneusement élaborées, mêlant aventure, culture et moments familiaux inoubliables au cœur du Maroc.',
      discover: 'Découvrir les Expériences',
      viewGallery: 'Voir la Galerie',
      scroll: 'Défiler',
    },
    home: {
      curatedForYou: 'Sélectionné Pour Vous',
      signatureExperiences: 'Expériences Signature',
      viewAllExperiences: 'Voir Toutes les Expériences',
      quote: 'Le désert a une voix pour ceux qui écoutent — il parle de l\'intemporel, de la merveille et de la joie des moments partagés sous une infinité d\'étoiles.',
      quoteAuthor: 'Proverbe Berbère',
      difference: 'La Différence',
      whyChooseUs: 'Pourquoi les Familles Nous Choisissent',
      values: [
        { title: 'Transport Complémentaire', description: 'Prise en charge luxueuse à l\'hôtel et retour incluse dans chaque expérience' },
        { title: 'Conçu pour la Famille', description: 'Chaque activité conçue pour le plaisir intergénérationnel et la sécurité' },
        { title: 'Hospitalité Authentique', description: 'Les familles berbères traditionnelles vous accueillent comme des invités honorés' },
        { title: 'Expertise Locale', description: 'Des guides qui marchent sur ces dunes depuis des générations' },
      ],
      guestStories: 'Témoignages',
      beginJourney: 'Commencer Votre Voyage',
      ctaTitle: 'Prêt à Créer des Souvenirs Intemporels ?',
      ctaSubtitle: 'Laissez-nous façonner votre échappée désertique parfaite. Chaque détail adapté aux rêves de votre famille.',
      reserveExperience: 'Réserver Votre Expérience',
    },
    tours: {
      pageTitle: 'Expériences Désertiques',
      pageSubtitle: 'Chaque expérience est méticuleusement conçue pour offrir à votre famille un voyage authentique au cœur de la culture désertique marocaine.',
      transportIncluded: '✦ Transport Hôtelier Complémentaire Inclus dans Toutes les Expériences',
      transportDetail: 'Prise en charge & dépôt à votre hébergement',
      allExperiences: 'Toutes les Expériences',
      familyAdventures: 'Aventures Familiales',
      luxuryPrivate: 'Luxe & Privé',
      startingFrom: 'À partir de',
      perPerson: '/ personne',
      signature: 'Signature',
      luxury: 'Luxe',
      duration: 'Durée',
      difficulty: 'Difficulté',
      groupSize: 'Taille du Groupe',
      whatsIncluded: 'Ce Qui Est Inclus',
      bookThisExperience: 'Réserver Cette Expérience',
      customTitle: 'Quelque Chose d\'Unique en Tête ?',
      customSubtitle: 'Chaque famille est unique. Laissez-nous créer une expérience désertique sur mesure adaptée précisément à vos rêves et vos désirs.',
      requestCustom: 'Demander une Expérience Sur Mesure',
      features: {
        camelTrek: 'Balade à chameau au coucher de soleil (1 heure)',
        traditionalDinner: 'Dîner marocain traditionnel',
        liveMusic: 'Musique berbère live & divertissement',
        mintTea: 'Cérémonie du thé à la menthe',
        sandboarding: 'Sandboard',
        quadTour: 'Visite guidée en quad (1 heure)',
        safetyEquipment: 'Équipement de sécurité complet fourni',
        professionalInstructor: 'Instructeur professionnel',
        desertCampRelaxation: 'Détente au camp désertique',
        quadAdventure: 'Aventure en quad (1 heure)',
        sunsetCamel: 'Caravane de chameaux au coucher du soleil',
        gourmetDinner: 'Dîner gastronomique traditionnel',
        berberShow: 'Spectacle culturel berbère',
        stargazing: 'Session d\'observation des étoiles',
        professionalPhotography: 'Photographie professionnelle',
        preDawnDeparture: 'Départ avant l\'aube depuis l\'hôtel',
        sunriseViewing: 'Observation du lever du soleil depuis un point panoramique',
        traditionalBreakfast: 'Petit-déjeuner marocain traditionnel',
        morningCamelTrek: 'Balade à chameau matinale',
        quadExploration: 'Exploration en quad',
        photographyOpportunities: 'Opportunités photographiques',
        private4x4: 'Véhicule 4x4 privé avec chauffeur',
        extendedExploration: 'Exploration désertique prolongée (journée complète)',
        berberVillage: 'Visite d\'un village berbère traditionnel',
        premiumDinner: 'Dîner gastronomique premium',
        privateTent: 'Hébergement en tente de luxe privée',
        vipService: 'Service VIP tout au long',
        photographerIncluded: 'Photographe professionnel inclus',
        customizableItinerary: 'Itinéraire personnalisable',
      },
      packages: [
        {
          title: 'Balade à Chameau & Dîner',
          subtitle: 'L\'Expérience Classique du Désert',
          description: 'Découvrez la magie intemporelle d\'Agafay lors d\'une caravane de chameaux traditionnelle. Regardez le coucher de soleil peindre le terrain rocailleux en or et cramoisi, puis régalez-vous avec un festin berbère authentique sous un ciel étoilé.',
        },
        {
          title: 'Aventure en Quad & Dîner',
          subtitle: 'Quand l\'Adrénaline Rencontre la Tradition',
          description: 'Ressentez le frisson de conquérir les dunes dorées sur un puissant quad. Après votre aventure désertique, détendez-vous avec un dîner spectaculaire dans notre camp désertique exclusif.',
        },
        {
          title: 'Combo Désert Ultime',
          subtitle: 'Quad • Chameau • Dîner',
          description: 'L\'immersion désertique complète. Commencez par une exhilarante balade en quad, passez à une paisible randonnée à chameau tandis que le soleil se couche, et concluez par une soirée inoubliable d\'hospitalité berbère.',
        },
        {
          title: 'Expérience du Lever de Soleil Doré',
          subtitle: 'Petit-déjeuner • Quad • Chameau',
          description: 'Témoin du réveil du désert dans une explosion de lumière dorée. Cette aventure matinale combine la sérénité de l\'aube avec des activités excitantes et un petit-déjeuner traditionnel dans les dunes.',
        },
        {
          title: 'Safari 4x4 Royal',
          subtitle: 'L\'Expérience Luxe Ultime',
          description: 'Voyagez au-delà de l\'ordinaire au cœur du désert rocailleux d\'Agafay dans un luxe privé. Cette expédition exclusive vous emmène vers des villages berbères cachés, des plateaux reculés et des panoramas de l\'Atlas que peu ont le privilège de voir.',
        },
      ],
    },
    about: {
      pageTitle: 'Notre Histoire',
      pageSubtitle: 'Un voyage qui a commencé avec un seul chameau et le rêve de partager la magie du désert.',
      since: 'Depuis 2009',
      theBeginning: 'Les Débuts',
      storyTitle: 'D\'un Seul Chameau à des Milliers de Sourires',
      storySubtitle: '',
      storyP1: 'En 2009, Hassan El-Fassi se tenait au bord des dunes d\'Erg Chebbi avec seulement le chameau de sa famille, un amour profond pour sa terre natale, et un rêve audacieux : partager la beauté profonde du désert marocain avec des familles du monde entier.',
      storyP2: 'Ce qui a commencé comme un seul homme offrant des balades à chameau au coucher du soleil s\'est épanoui en Families Tours — une collection soignée d\'expériences désertiques exceptionnelles qui ont accueilli plus de 10 000 invités de chaque coin du globe.',
      storyP3: 'Notre philosophie n\'a jamais vacillé : chaque famille mérite de vivre le désert non pas comme des touristes, mais comme des invités honorés. Cette conviction guide chacune de nos décisions, des familles berbères qui vous accueillent dans leurs camps, aux moments soigneusement craftés qui deviennent vos souvenirs les plus précieux.',
      founderQuote: "Nous ne montrons pas simplement le désert aux familles — nous les aidons à ressentir son rythme ancien, à entendre ses secrets murmurés, et à emporter un peu de sa magie dans leur cœur pour toujours.",
      founderName: '— Hassan El-Fassi, Fondateur',
      guidesUs: 'Ce Qui Nous Guide',
      coreValues: 'Nos Valeurs Fondamentales',
      values: [
        { title: 'La Famille D\'Abord', description: 'Chaque expérience est conçue avec le plaisir intergénéral à l\'esprit. Des grands-parents aux petits-enfants, chacun trouve son moment d\'émerveillement.' },
        { title: 'Connexion Authentique', description: 'Nous facilitons des échanges genuins entre votre famille et nos hôtes berbères, créant des ponts culturels qui durent toute une vie.' },
        { title: 'Excellence Sans Compromis', description: 'Des véhicules que nous utilisons aux repas que nous servons, chaque détail répond aux normes les plus élevées de qualité et de sécurité.' },
        { title: 'Empouvoirement Local', description: 'Nous employons et formons des guides locaux, soutenons les familles berbères, et assurons que le tourisme bénéficie aux communautés que nous visitons.' },
        { title: 'Créer de la Magie', description: 'Nous croyons au pouvoir transformateur des expériences extraordinaires. Chaque visite est une opportunité de créer des souvenirs pour la vie.' },
        { title: 'Tourisme Responsable', description: 'Nous sommes engagés à préserver l\'écosystème désertique fragile et à minimiser notre empreinte environnementale.' },
      ],
      teamTitle: 'Rencontrez Notre Équipe',
      teamSubtitle: 'Les Personnes Derrière la Magie',
      yearsOfExperience: '15+',
      happyGuests: '10K+',
      familyOwned: '100%',
      averageRating: '4.9',
      yearsOfExperienceLabel: 'Années d\'Expérience',
      happyGuestsLabel: 'Invités Satisfaits',
      familyOwnedLabel: 'Familial',
      averageRatingLabel: 'Note Moyenne',
      team: [
        {
          name: 'Hassan El-Fassi',
          role: 'Fondateur & Guide Principal',
          story: 'Né dans l\'Atlas, Hassan passe plus de 20 ans à guider des familles à travers le désert d\'Agafay. Sa chaleur et son expertise sont le fondement de tout ce que nous faisons.',
        },
        {
          name: 'Fatima Benhassan',
          role: 'Curatrice d\'Expériences',
          story: 'Fatima s\'assure que chaque détail de votre voyage est parfait. Son attention aux détails et sa compréhension profonde de l\'excellence hôtelière distinguent nos expériences.',
        },
        {
          name: 'Mohammed Ait Brahim',
          role: 'Directeur des Opérations',
          story: 'Mohammed coordonne notre flotte, nos guides et nos opérations de camp. Sa maîtrise logistique assure des expériences fluides pour chaque invité.',
        },
      ],
    },
    gallery: {
      pageTitle: 'Galerie Désert',
      pageSubtitle: 'Aperçus de la magie qui attend votre famille',
      visualJourney: 'Voyage Visuel',
      glimpses: 'Aperçus de la magie qui attend votre famille',
      all: 'Tout',
      camels: 'Chameaux',
      adventure: 'Aventure',
      camp: 'Camp',
      nature: 'Nature',
      photos: 'photos',
      createMemories: 'Prêt à Créer Vos Propres Souvenirs Désertiques ?',
      galleryCta: 'Ces moments attendent votre famille. Laissez-nous façonner votre expérience désertique parfaite.',
      startJourney: 'Commencer Votre Voyage',
      categories: {
        camels: 'Chameaux',
        adventure: 'Aventure',
        camp: 'Camp',
        nature: 'Nature',
      },
    },
    contact: {
      pageTitle: 'Réserver Votre Expérience',
      pageSubtitle: 'Remplissez le formulaire ci-dessous et notre équipe façonnera votre échappée désertique parfaite dans les 24 heures.',
      beginYourJourney: 'Commencer Votre Voyage',
      formDescription: 'Remplissez le formulaire ci-dessous et notre équipe façonnera votre échappée désertique parfaite dans les 24 heures.',
      selectExperience: 'Sélectionnez Votre Expérience',
      notSureYet: 'Pas Encore Sûr / Sur Mesure',
      fullName: 'Nom Complet *',
      fullNamePlaceholder: 'Votre nom complet',
      email: 'Adresse Email *',
      emailPlaceholder: 'votre@email.com',
      phone: 'Téléphone / WhatsApp',
      phonePlaceholder: '+212 XXX XXXXXX',
      preferredDate: 'Date Préférée',
      numberOfGuests: 'Nombre d\'Invités',
      selectGroupSize: 'Sélectionnez la taille du groupe',
      guest: 'Invité',
      guests: 'Invités',
      group: 'Invités (Groupe)',
      specialRequests: 'Demandes Spéciales ou Questions',
      specialRequestsPlaceholder: 'Parlez-nous des intérêts de votre famille, de toute exigence particulière, de restrictions alimentaires, ou questions...',
      sendBookingRequest: 'Envoyer la Demande de Réservation',
      submitAgreement: 'En soumettant ce formulaire, vous acceptez d\'être contacté concernant votre demande.',
      contactDirectly: 'Contactez-Nous Directement',
      phoneWhatsApp: 'Téléphone / WhatsApp',
      emailAddress: 'Email',
      location: 'Localisation',
      locationDetail: 'Marrakech, Maroc',
      hotelPickup: 'Prise en charge à l\'hôtel disponible',
      availability: 'Disponibilité',
      alwaysReady: 'Toujours prêt à aider',
      whatHappensNext: 'Ce Qui Se Passe Ensuite ?',
      steps: [
        'Nous recevons votre demande et vérifions la disponibilité',
        'Notre équipe vous contacte dans les 24 heures',
        'Nous personnalisons les détails selon vos préférences',
        'Confirmez avec un petit acompte et préparez-vous !',
      ],
      transportReminder: 'Transport hôtelier complémentaire inclus dans toutes les expériences',
      successTitle: 'Demande Reçue',
      successMessage: 'Merci pour votre demande. Notre équipe vous contactera dans les 24 heures pour finaliser votre aventure désertique.',
      successImmediate: 'Pour une assistance immédiate : +212 XXX XXXXXX',
    },
    footer: {
      tagline: 'Créant des expériences désertiques extraordinaires pour des familles exigeantes depuis 2009. Où le luxe rencontre l\'hospitalité marocaine authentique.',
      experiences: 'Expériences',
      navigation: 'Navigation',
      contact: 'Contact',
      hotelPickup: 'Marrakech, Maroc (Prise en charge à l\'hotel disponible)',
      available247: 'Disponible 24/7',
      copyright: '© 2024 Families Tours. Tous droits réservés.',
      transportIncluded: 'Transport complémentaire inclus dans toutes les expériences',
      quickLinks: {
        home: 'Accueil',
        experiences: 'Expériences',
        about: 'Notre Histoire',
        gallery: 'Galerie',
        reserve: 'Réserver',
      },
    },
    packageNames: {
      camelDinner: 'Balade à Chameau & Dîner',
      quadDinner: 'Aventure en Quad & Dîner',
      ultimateCombo: 'Combo Désert Ultime',
      sunriseBreakfast: 'Expérience du Lever de Soleil Doré',
      safari4x4: 'Safari 4x4 Royal',
    },
    packageSubtitles: {
      camelDinner: 'L\'Expérience Classique du Désert',
      quadDinner: 'Quand l\'Adrénaline Rencontre la Tradition',
      ultimateCombo: 'Quad • Chameau • Dîner',
      sunriseBreakfast: 'Petit-déjeuner • Quad • Chameau',
      safari4x4: 'L\'Expérience Luxe Ultime',
    },
  },

  // Spanish Translations
  es: {
    nav: {
      home: 'Inicio',
      experiences: 'Experiencias',
      about: 'Nuestra Historia',
      gallery: 'Galería',
      reserve: 'Reservar',
      bookNow: 'Reservar Ahora',
    },
    hero: {
      location: 'Marruecos • Desierto de Agafay',
      title1: 'Donde las Dunas Doradas',
      title2: 'Encuentran los Sueños Familiares',
      subtitle: 'Experiencias desérticas cuidadosamente elaboradas que tejen aventura, cultura y momentos familiares inolvidables en el corazón de Marruecos.',
      discover: 'Descubrir Experiencias',
      viewGallery: 'Ver Galería',
      scroll: 'Desplazar',
    },
    home: {
      curatedForYou: 'Seleccionado Para Ti',
      signatureExperiences: 'Experiencias Firma',
      viewAllExperiences: 'Ver Todas las Experiencias',
      quote: 'El desierto tiene una voz para quienes escucha — habla de atemporalidad, maravilla y la alegría de los momentos compartidos bajo infinitas estrellas.',
      quoteAuthor: 'Proverbio Bereber',
      difference: 'La Diferencia',
      whyChooseUs: 'Por Qué las Familias Nos Eligen',
      values: [
        { title: 'Transporte Complementario', description: 'Recogida de lujo en el hotel e incluida en cada experiencia' },
        { title: 'Diseñado para la Familia', description: 'Cada actividad diseñada para el disfrute multigeneracional y seguridad' },
        { title: 'Hospitalidad Auténtica', description: 'Las familias bereberes tradicionales te reciben como invitados honorados' },
        { title: 'Experticia Local', description: 'Guías que han caminado por estas dunas durante generaciones' },
      ],
      guestStories: 'Historias de Invitados',
      beginJourney: 'Comenzar Tu Viaje',
      ctaTitle: '¿Listo para Crear Recuerdos Atemporales?',
      ctaSubtitle: 'Dejanos crear tu escapada desértica perfecta. Cada detalle adaptado a los sueños de tu familia.',
      reserveExperience: 'Reservar Tu Experiencia',
    },
    tours: {
      pageTitle: 'Experiencias del Desierto',
      pageSubtitle: 'Cada experiencia está meticulosamente elaborada para ofrecer a tu familia un viaje auténtico al corazón de la cultura desértica marroquí.',
      transportIncluded: '✦ Transporte Hotelero Complementario Incluido en Todas las Experiencias',
      transportDetail: 'Recogida y dejada en tu alojamiento',
      allExperiences: 'Todas las Experiencias',
      familyAdventures: 'Aventuras Familiares',
      luxuryPrivate: 'Lujo y Privado',
      startingFrom: 'Desde',
      perPerson: '/ persona',
      signature: 'Firma',
      luxury: 'Lujo',
      duration: 'Duración',
      difficulty: 'Dificultad',
      groupSize: 'Tamaño del Grupo',
      whatsIncluded: 'Qué Está Incluido',
      bookThisExperience: 'Reservar Esta Experiencia',
      customTitle: '¿Algo Único en Mente?',
      customSubtitle: 'Cada familia es única. Dejanos crear una experiencia desértica hecha a medida adaptada precisamente a tus sueños y deseos.',
      requestCustom: 'Solicitar Experiencia Personalizada',
      features: {
        camelTrek: 'Paseo en camello al atardecer (1 hora)',
        traditionalDinner: 'Cena marroquí tradicional',
        liveMusic: 'Música bereber en vivo y entretenimiento',
        mintTea: 'Ceremonia del té de mentha',
        sandboarding: 'Sandboard',
        quadTour: 'Tour guiado en cuatrimoto (1 hora)',
        safetyEquipment: 'Equipo de seguridad completo proporcionado',
        professionalInstructor: 'Instructor profesional',
        desertCampRelaxation: 'Relajación en el campamento desértico',
        quadAdventure: 'Aventura en cuatrimoto (1 hora)',
        sunsetCamel: 'Caravana de camellos al atardecer',
        gourmetDinner: 'Cena gastronómica tradicional',
        berberShow: 'Espectáculo cultural bereber',
        stargazing: 'Sesión de observación de estrellas',
        professionalPhotography: 'Fotografía profesional',
        preDawnDeparture: 'Salida antes del amanecer desde el hotel',
        sunriseViewing: 'Observación del amanecer desde un punto panorámico',
        traditionalBreakfast: 'Desayuno marroquí tradicional',
        morningCamelTrek: 'Paseo en camello matutino',
        quadExploration: 'Exploración en cuatrimoto',
        photographyOpportunities: 'Oportunidades fotográficas',
        private4x4: 'Vehículo 4x4 privado con conductor',
        extendedExploration: 'Exploración desértica extendida (día completo)',
        berberVillage: 'Visita a un pueblo bereber tradicional',
        premiumDinner: 'Cena gourmet premium',
        privateTent: 'Alojamiento en tienda de lujo privada',
        vipService: 'Servicio VIP durante todo el recorrido',
        photographerIncluded: 'Fotógrafo profesional incluido',
        customizableItinerary: 'Itinerario personalizable',
      },
      packages: [
        {
          title: 'Paseo en Camello y Cena',
          subtitle: 'La Experiencia Clásica del Desierto',
          description: 'Experimenta la magia atemporal de Agafay en una caravana tradicional de camellos. Observa cómo el atardecer pinta el terreno rocoso de oro y carmesí, luego disfruta de un festín bereber auténtico bajo un dosel de estrellas.',
        },
        {
          title: 'Aventura en Cuatrimoto y Cena',
          subtitle: 'Cuando la Adrenalina Encuentra la Tradición',
          description: 'Siente la emoción de conquistar las dunas doradas en una poderosa cuatrimoto. Después de tu aventura desértica, relájate con una cena espectacular en nuestro campamento desértico exclusivo.',
        },
        {
          title: 'Combo Desértico Definitivo',
          subtitle: 'Cuatrimoto • Camello • Cena',
          description: 'La inmersión desértica completa. Comienza con una emocionante paseo en cuatrimoto, transiciona a un pacífico paseo en cam mientras el sol se pone, y concluye con una inolvidable noche de hospitalidad bereber.',
        },
        {
          title: 'Experiencia del Amanecer Dorado',
          subtitle: 'Desayuno • Cuatrimoto • Camello',
          description: 'Presencia cómo el desierto se despierta en una explosión de luz dorada. Esta aventura matutina combina la serenidad del amanecer con actividades emocionantes y un desayuno tradicional en las dunas.',
        },
        {
          title: 'Safari 4x4 Real',
          subtitle: 'La Experiencia de Lujo Definitiva',
          description: 'Viaja más allá de lo ordinario hacia el corazón del desierto rocoso de Agafay en lujo privado. Esta expedición exclusiva te lleva a pueblos bereberes ocultos, mesetas remotas y panorámicas del Atlas que pocos tienen el privilegio de presenciar.',
        },
      ],
    },
    about: {
      pageTitle: 'Nuestra Historia',
      pageSubtitle: 'Un viaje que comenzó con un solo camello y el sueño de compartir la magia del desierto.',
      since: 'Desde 2009',
      theBeginning: 'El Comienzo',
      storyTitle: 'De un Solo Camello a Miles de Sonrisas',
      storySubtitle: '',
      storyP1: 'En 2009, Hassan El-Fassi estaba al borde de las dunas de Erg Chebbi con solo el camello de su familia, un amor profundo por su tierra natal, y un sueño audaz: compartir la profunda belleza del desierto marroquí con familias de todo el mundo.',
      storyP2: 'Lo que comenzó como un solo hombre ofreciendo paseos en camello al atardecer ha florecido en Families Tours — una colección curada de experiencias desérticas excepcionales que han dado la bienvenida a más de 10,000 invitados de cada rincón del globo.',
      storyP3: 'Nuestra filosofía nunca ha vacilado: cada familia merece experimentar el desierto no como turistas, sino como invitados honorados. Esta creencia guía cada decisión que tomamos, desde las familias bereberes que te dan la bienvenida a sus campamentos, hasta los momentos cuidadosamente elaborados que se convierten en tus recuerdos más preciados.',
      founderQuote: "No solo mostramos el desierto a las familias — les ayudamos a sentir su ritmo antiguo, escuchar sus secretos susurrados, y llevar un poco de su magia en sus corazones para siempre.",
      founderName: '— Hassan El-Fassi, Fundador',
      guidesUs: 'Lo Que Nos Guía',
      coreValues: 'Nuestros Valores Fundamentales',
      values: [
        { title: 'La Familia Primero', description: 'Cada experiencia está diseñada con el disfrute multigeneracional en mente. Desde abuelos hasta nietos, todos encuentran su momento de maravilla.' },
        { title: 'Conexión Auténtica', description: 'Facilitamos intercambios genuinos entre tu familia y nuestros anfitriones bereberes, creando puentes culturales que duran toda la vida.' },
        { title: 'Excelencia Sin Compromisos', description: 'Desde los vehículos que usamos hasta las comidas que servimos, cada detalle cumple con los más altos estándares de calidad y seguridad.' },
        { title: 'Empoderamiento Local', description: 'Empleamos y entrenamos guías locales, apoyamos a las familias bereberes, y aseguramos que el turismo beneficie a las comunidades que visitamos.' },
        { title: 'Crear Magia', description: 'Creemos en el poder transformador de las experiencias extraordinarias. Cada visita es una oportunidad para crear recuerdos para toda la vida.' },
        { title: 'Turismo Responsable', description: 'Estamos comprometidos a preservar el frágil ecosistema desértico y minimizar nuestra huella ambiental.' },
      ],
      teamTitle: 'Conoce Nuestro Equipo',
      teamSubtitle: 'Las Personas Detrás de la Magia',
      yearsOfExperience: '15+',
      happyGuests: '10K+',
      familyOwned: '100%',
      averageRating: '4.9',
      yearsOfExperienceLabel: 'Años de Experiencia',
      happyGuestsLabel: 'Invitos Felices',
      familyOwnedLabel: 'Familiar',
      averageRatingLabel: 'Calificación Promedio',
      team: [
        {
          name: 'Hassan El-Fassi',
          role: 'Fundador y Guía Principal',
          story: 'Nacido en el Atlas, Hassan ha pasado más de 20 años guiando familias a través del desierto de Agafay. Su calidez y experiencia son el fundamento de todo lo que hacemos.',
        },
        {
          name: 'Fatima Benhassan',
          role: 'Curadora de Experiencias',
          story: 'Fatima asegura que cada detalle de tu viaje sea perfecto. Su atención al detalle y profunda comprensión de la excelencia hospitalaria distinguen nuestras experiencias.',
        },
        {
          name: 'Mohammed Ait Brahim',
          role: 'Jefe de Operaciones',
          story: 'Mohammed coordina nuestra flota, guías y operaciones de campamento. Su dominio logístico asegura experiencias fluidas para cada invitado.',
        },
      ],
    },
    gallery: {
      pageTitle: 'Galería del Desierto',
      pageSubtitle: 'Vistazos de la magia que espera a tu familia',
      visualJourney: 'Viaje Visual',
      glimpses: 'Vistazos de la magia que espera a tu familia',
      all: 'Todo',
      camels: 'Camellos',
      adventure: 'Aventura',
      camp: 'Campamento',
      nature: 'Naturaleza',
      photos: 'fotos',
      createMemories: '¿Listo para Crear Tus Propios Recuerdes Desérticos?',
      galleryCta: ' Estos momentos esperan a tu familia. Dejanos crear tu experiencia desértica perfecta.',
      startJourney: 'Comenzar Tu Viaje',
      categories: {
        camels: 'Camellos',
        adventure: 'Aventura',
        camp: 'Campamento',
        nature: 'Naturaleza',
      },
    },
    contact: {
      pageTitle: 'Reserva Tu Experiencia',
      pageSubtitle: 'Completa el formulario a continuación y nuestro equipo creará tu escapada desértica perfecta dentro de 24 horas.',
      beginYourJourney: 'Comenzar Tu Viaje',
      formDescription: 'Completa el formulario a continuación y nuestro equipo creará tu escapada desértica perfecta dentro de 24 horas.',
      selectExperience: 'Selecciona Tu Experiencia',
      notSureYet: 'No Seguro Aún / Personalizado',
      fullName: 'Nombre Completo *',
      fullNamePlaceholder: 'Tu nombre completo',
      email: 'Correo Electrónico *',
      emailPlaceholder: 'tu@email.com',
      phone: 'Teléfono / WhatsApp',
      phonePlaceholder: '+212 XXX XXXXXX',
      preferredDate: 'Fecha Preferida',
      numberOfGuests: 'Número de Invitados',
      selectGroupSize: 'Selecciona el tamaño del grupo',
      guest: 'Invitado',
      guests: 'Invitados',
      group: 'Invitados (Grupo)',
      specialRequests: 'Solicitudes Especiales o Preguntas',
      specialRequestsPlaceholder: 'Cuéntanos sobre los intereses de tu familia, cualquier requisito especial, restricciones dietéticas, o preguntas...',
      sendBookingRequest: 'Enviar Solicitud de Reserva',
      submitAgreement: 'Al enviar este formulario, aceptas ser contactado respecto a tu consulta.',
      contactDirectly: 'Contáctanos Directamente',
      phoneWhatsApp: 'Teléfono / WhatsApp',
      emailAddress: 'Email',
      location: 'Ubicación',
      locationDetail: 'Marrakech, Marruecos',
      hotelPickup: 'Recogida en el hotel disponible',
      availability: 'Disponibilidad',
      alwaysReady: 'Siempre listo para ayudar',
      whatHappensNext: 'Qué Pasa Después?',
      steps: [
        'Recibimos tu solicitud y revisamos disponibilidad',
        'Nuestro equipo te contacta dentro de 24 horas',
        'Personalizamos los detalles según tus preferencias',
        '¡Confirma con un pequeño depósito y prepárate!',
      ],
      transportReminder: 'Transporte hotelero complementario incluido en todas las experiencias',
      successTitle: 'Solicitud Recibida',
      successMessage: 'Gracias por tu consulta. Nuestro equipo te contactará dentro de 24 horas para finalizar tu aventura desértica.',
      successImmediate: 'Para asistencia inmediata: +212 XXX XXXXXX',
    },
    footer: {
      tagline: 'Creando experiencias desérticas extraordinarias para familias exigentes desde 2009. Donde el lujo encuentra la hospitalidad marroquí auténtica.',
      experiences: 'Experiencias',
      navigation: 'Navegación',
      contact: 'Contacto',
      hotelPickup: 'Marrakech, Marruecos (Recogida en hotel disponible)',
      available247: 'Disponible 24/7',
      copyright: '© 2024 Families Tours. Todos los derechos reservados.',
      transportIncluded: 'Transporte complementario incluido en todas las experiencias',
      quickLinks: {
        home: 'Inicio',
        experiences: 'Experiencias',
        about: 'Nuestra Historia',
        gallery: 'Galería',
        reserve: 'Reservar',
      },
    },
    packageNames: {
      camelDinner: 'Paseo en Camello y Cena',
      quadDinner: 'Aventura en Cuatrimoto y Cena',
      ultimateCombo: 'Combo Desértico Definitivo',
      sunriseBreakfast: 'Experiencia del Amanecer Dorado',
      safari4x4: 'Safari 4x4 Real',
    },
    packageSubtitles: {
      camelDinner: 'La Experiencia Clásica del Desierto',
      quadDinner: 'Cuando la Adrenalina Encuentra la Tradición',
      ultimateCombo: 'Cuatrimoto • Camello • Cena',
      sunriseBreakfast: 'Desayuno • Cuatrimoto • Camello',
      safari4x4: 'La Experiencia de Lujo Definitiva',
    },
  },
};

// Helper function to get translation
export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}
