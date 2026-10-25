import { Category, Product, StoreSettings, HomepageBanner, Order } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  store_name: "SETH SANWARIYA COLLECTION",
  store_name_hi: "सेठ सांवरिया कलेक्शन",
  tagline_hi: "प्रीमियम एवं प्रामाणिक भारतीय परिधान संग्रह",
  phone_number: "+91 8529095431",
  whatsapp_number: "+91 8529095431",
  address_hi: "सेठ सांवरिया कलेक्शन, मुख्य बाजार (गूगल मैप लोकेशन नीचे देखें)",
  google_maps_url: "https://maps.app.goo.gl/NQzTTJeZxeSj55bj8",
  business_hours_hi: "सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक (सप्ताह के सभी 7 दिन खुली रहती है)",
  opening_time: "08:00",
  closing_time: "22:00",
  is_exceptional_closure: false,
  exceptional_closure_reason: "",
  delivery_charge_threshold: 999,
  standard_delivery_charge: 70,
  announcement_bar_hi: "🎉 सेठ सांवरिया कलेक्शन में आपका स्वागत है! दुकान सुबह 8:00 से रात 10:00 बजे तक सातों दिन खुली है। कॉल: +91 8529095431",
  about_text_hi: "सेठ सांवरिया कलेक्शन पारंपरिक एवं आधुनिक भारतीय परिधानों का एक प्रतिष्ठित प्रतिष्ठान है। हम पुरुषों, महिलाओं और बच्चों के लिए उच्च गुणवत्ता वाले कुर्ते, साड़ियां, सूट, शेरवानी और आधुनिक एथनिक कपड़े उपलब्ध कराते हैं। हमारी प्राथमिकता बेहतरीन फैब्रिक, सुरुचिपूर्ण सिलाई और ग्राहकों का अटूट विश्वास है।",
  return_policy_hi: "डिलीवरी के 7 दिनों के भीतर साइज न मिलने या खराबी होने पर आसान वापसी और बदलाव की सुविधा उपलब्ध है। कपड़े पर टैग और बिल होना अनिवार्य है।",
  shipping_policy_hi: "ऑर्डर की पुष्टि के 24-48 घंटों में पार्सल डिस्पैच कर दिया जाता है। सामान्यतः 3-5 कार्यदिवसों में डिलीवरी प्राप्त हो जाती है।",
  cancellation_policy_hi: "ऑर्डर डिस्पैच होने से पहले आप WhatsApp या फोन कॉल (+91 8529095431) के माध्यम से बिना किसी शुल्क के ऑर्डर रद्द कर सकते हैं।",
  facebook_url: "https://www.facebook.com/p/Seth-Sanwariya-61584605940951/",
  instagram_url: "https://www.instagram.com/seth_sanwariya_collection_/",
  youtube_url: "https://www.youtube.com/@seth_sanwariya_collection"
};

export const INITIAL_BANNERS: HomepageBanner[] = [
  {
    id: "banner-1",
    title_hi: "शाही विरासत एवं उत्सव कलेक्शन",
    subtitle_hi: "विवाह और त्योहारों के लिए विशेष शेरवानी, कुर्ते व सिल्क साड़ियों की नई श्रृंखला",
    badge_hi: "विशेष नया स्टॉक",
    image_url: "/src/assets/images/hero_festive_ethnic_1792914844440.jpg",
    button_text_hi: "अभी देखें और ऑर्डर करें",
    button_link: "/products",
    display_order: 1,
    is_active: true
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-mens",
    name_hi: "पुरुषों के कपड़े",
    name_en: "Men's Ethnic & Kurtas",
    slug: "mens-wear",
    image_url: "/src/assets/images/cat_mens_kurta_suit_1792914843627.jpg",
    description: "पारंपरिक कुर्ते, पायजामा, शेरवानी और उत्सव परिधान",
    display_order: 1,
    is_active: true
  },
  {
    id: "cat-sarees",
    name_hi: "साड़ी और लहंगा",
    name_en: "Sarees & Lehengas",
    slug: "sarees",
    image_url: "/src/assets/images/cat_womens_silk_saree_1792914844028.jpg",
    description: "बनारसी सिल्क, कांजीवरम और पार्टी वियर साड़ियां",
    display_order: 2,
    is_active: true
  },
  {
    id: "cat-kurtis",
    name_hi: "कुर्ती और सूट सेट",
    name_en: "Kurtis & Suits",
    slug: "kurtis-suits",
    image_url: "/src/assets/images/cat_kurti_suit_set_1792914845162.jpg",
    description: "अनारकली, स्ट्रेट कुर्ती, दुपट्टा और प्लाज़ो सेट",
    display_order: 3,
    is_active: true
  },
  {
    id: "cat-kids",
    name_hi: "बच्चों के कपड़े",
    name_en: "Kids Wear",
    slug: "kids-wear",
    image_url: "/src/assets/images/cat_kids_ethnic_wear_1792914844788.jpg",
    description: "लड़कों और लड़कियों के लिए आरामदायक और उत्सव वाले कपड़े",
    display_order: 4,
    is_active: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name_hi: "शाही जरी कढ़ाई सिल्क बनारसी साड़ी",
    name_en: "Royal Zari Woven Banarasi Silk Saree",
    slug: "royal-zari-banarasi-silk-saree",
    category_id: "cat-sarees",
    description_hi: "प्रामाणिक बनारसी सिल्क पर बारीक सुनहरी जरी का काम। मोर कंठी पीकॉक टील रंग में उत्कृष्ट पल्लू और अनस्टिच्ड ब्लाउज पीस के साथ। पूजा, विवाह और विशेष अवसरों के लिए श्रेष्ठ।",
    price: 3499,
    original_price: 4999,
    discount_percent: 30,
    sku: "SS-SAR-001",
    stock_quantity: 12,
    sizes: ["Free Size (6.3m)"],
    colors: [
      { name_hi: "पीकॉक टील", hex: "#0E5A59" },
      { name_hi: "शाही महरून", hex: "#7E1823" },
      { name_hi: "सुनहरी पीला", hex: "#D49E24" }
    ],
    images: [
      "/src/assets/images/cat_womens_silk_saree_1792914844028.jpg"
    ],
    main_image: "/src/assets/images/cat_womens_silk_saree_1792914844028.jpg",
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-2",
    name_hi: "हस्तनिर्मित कॉटन लिनन डिजाइनर कुर्ता",
    name_en: "Handcrafted Cotton Linen Designer Kurta",
    slug: "handcrafted-cotton-linen-kurta",
    category_id: "cat-mens",
    description_hi: "प्रीमियम शुद्ध कॉटन लिनन फैब्रिक से बना सुरुचिपूर्ण कॉलर कुर्ता। कॉलर और कफ पर नाजुक रेशमी कसीदाकारी। गर्मियों और त्योहारों में पूरे दिन आरामदायक अनुभव।",
    price: 1599,
    original_price: 2199,
    discount_percent: 27,
    sku: "SS-MEN-002",
    stock_quantity: 25,
    sizes: ["M (38)", "L (40)", "XL (42)", "XXL (44)"],
    colors: [
      { name_hi: "नेचुरल आइवरी", hex: "#E9E2D5" },
      { name_hi: "रॉयल नेवी", hex: "#1A2E40" },
      { name_hi: "बादामी बेज", hex: "#C7B299" }
    ],
    images: [
      "/src/assets/images/cat_mens_kurta_suit_1792914843627.jpg"
    ],
    main_image: "/src/assets/images/cat_mens_kurta_suit_1792914843627.jpg",
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-3",
    name_hi: "गुलाबी गोटा पट्टी अनारकली सूट सेट",
    name_en: "Blush Pink Gota Patti Anarkali Suit Set",
    slug: "blush-pink-gota-patti-anarkali-suit",
    category_id: "cat-kurtis",
    description_hi: "हल्के ब्लश पिंक शेड में जॉर्जेट अनारकली कुर्ती, पैंट और मैचिंग गोटा पट्टी वर्क दुपट्टा। शादी की संगीत सेरेमनी व पार्टी के लिए बेहद मनमोहक रूप।",
    price: 2899,
    original_price: 3999,
    discount_percent: 28,
    sku: "SS-KRT-003",
    stock_quantity: 18,
    sizes: ["S (36)", "M (38)", "L (40)", "XL (42)"],
    colors: [
      { name_hi: "हल्का गुलाबी", hex: "#E8B3BA" },
      { name_hi: "आकाशी नीला", hex: "#97C1DF" }
    ],
    images: [
      "/src/assets/images/cat_kurti_suit_set_1792914845162.jpg"
    ],
    main_image: "/src/assets/images/cat_kurti_suit_set_1792914845162.jpg",
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-4",
    name_hi: "बालक ब्रॉकेड शेरवानी व धोती कुर्ता सेट",
    name_en: "Kids Brocade Sherwani & Dhoti Kurta Set",
    slug: "kids-brocade-sherwani-dhoti-kurta",
    category_id: "cat-kids",
    description_hi: "बच्चों के लिए राजस्थानी ब्रॉकेड जैकेट, सिल्क कुर्ता और पहले से सिली हुई आरामदायक धोती। त्वचा के लिए अत्यंत मुलायम इनर कॉटन अस्तर।",
    price: 1899,
    original_price: 2499,
    discount_percent: 24,
    sku: "SS-KID-004",
    stock_quantity: 14,
    sizes: ["2-3 वर्ष", "4-5 वर्ष", "6-7 वर्ष", "8-9 वर्ष"],
    colors: [
      { name_hi: "आइवरी एवं गोल्ड", hex: "#EADDC6" },
      { name_hi: "लाल एवं गोल्ड", hex: "#B92837" }
    ],
    images: [
      "/src/assets/images/cat_kids_ethnic_wear_1792914844788.jpg"
    ],
    main_image: "/src/assets/images/cat_kids_ethnic_wear_1792914844788.jpg",
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-5",
    name_hi: "शाही वेलवेट शादी शेरवानी सेट",
    name_en: "Royal Velvet Wedding Sherwani Set",
    slug: "royal-velvet-wedding-sherwani-set",
    category_id: "cat-mens",
    description_hi: "गहरे मैरून वेलवेट पर पारंपरिक जरदोजी और हाथ की बारीक कढ़ाई। चूड़ीदार और दुपट्टे के साथ पूर्ण दूल्हा या बाराती परिधान।",
    price: 8999,
    original_price: 12999,
    discount_percent: 31,
    sku: "SS-MEN-005",
    stock_quantity: 6,
    sizes: ["M (38)", "L (40)", "XL (42)"],
    colors: [
      { name_hi: "रॉयल मैरून", hex: "#5C131E" },
      { name_hi: "आधी रात नीला", hex: "#151F33" }
    ],
    images: [
      "/src/assets/images/hero_festive_ethnic_1792914844440.jpg"
    ],
    main_image: "/src/assets/images/hero_festive_ethnic_1792914844440.jpg",
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "SS-ORD-1001",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer_name: "सुरेश कुमार जी",
    customer_phone: "9876543210",
    customer_address: "मकान नंबर 44, गांधी चौक, निकट शिव मंदिर",
    customer_city: "जयपुर",
    customer_pincode: "302001",
    payment_method: "whatsapp",
    order_status: "स्वीकृत (Confirmed)",
    total_amount: 3499,
    items: [
      {
        product_id: "prod-1",
        product_name_hi: "शाही जरी कढ़ाई सिल्क बनारसी साड़ी",
        size: "Free Size (6.3m)",
        color: "पीकॉक टील",
        price: 3499,
        quantity: 1,
        image_url: "/src/assets/images/cat_womens_silk_saree_1792914844028.jpg"
      }
    ],
    notes: "WhatsApp पर साइज और डिलीवरी समय की पुष्टि की गई।"
  }
];
