-- ==============================================================================
-- SETH SANWARIYA COLLECTION (सेठ सांवरिया कलेक्शन) - DATABASE SCHEMA & MIGRATION
-- Compatible with Supabase PostgreSQL, Row Level Security, Storage & Realtime
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    store_name TEXT NOT NULL DEFAULT 'SETH SANWARIYA COLLECTION',
    store_name_hi TEXT NOT NULL DEFAULT 'सेठ सांवरिया कलेक्शन',
    tagline_hi TEXT DEFAULT 'प्रीमियम एवं प्रामाणिक भारतीय परिधान संग्रह',
    phone_number TEXT DEFAULT '+91 8529095431',
    whatsapp_number TEXT DEFAULT '+91 8529095431',
    address_hi TEXT DEFAULT 'सेठ सांवरिया कलेक्शन, मुख्य बाजार',
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/NQzTTJeZxeSj55bj8',
    business_hours_hi TEXT DEFAULT 'सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक (सप्ताह के सभी 7 दिन खुली रहती है)',
    opening_time TEXT DEFAULT '08:00',
    closing_time TEXT DEFAULT '22:00',
    is_exceptional_closure BOOLEAN DEFAULT false,
    exceptional_closure_reason TEXT DEFAULT '',
    delivery_charge_threshold NUMERIC NOT NULL DEFAULT 999,
    standard_delivery_charge NUMERIC NOT NULL DEFAULT 70,
    announcement_bar_hi TEXT DEFAULT '🎉 सेठ सांवरिया कलेक्शन में आपका स्वागत है! दुकान सुबह 8:00 से रात 10:00 बजे तक सातों दिन खुली है। कॉल: +91 8529095431',
    about_text_hi TEXT DEFAULT 'सेठ सांवरिया कलेक्शन पारंपरिक भारतीय परिधानों का एक प्रतिष्ठित प्रतिष्ठान है।',
    return_policy_hi TEXT DEFAULT 'डिलीवरी के 7 दिनों के भीतर आसान वापसी और बदलाव की सुविधा उपलब्ध है।',
    shipping_policy_hi TEXT DEFAULT 'ऑर्डर की पुष्टि के 24-48 घंटों में पार्सल डिस्पैच कर दिया जाता है।',
    cancellation_policy_hi TEXT DEFAULT 'ऑर्डर डिस्पैच होने से पहले आप WhatsApp या फोन कॉल पर ऑर्डर रद्द कर सकते हैं।',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/seth_sanwariya_collection_/',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/p/Seth-Sanwariya-61584605940951/',
    youtube_url TEXT DEFAULT 'https://www.youtube.com/@seth_sanwariya_collection',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed primary settings if not exists
INSERT INTO public.store_settings (
    id, store_name, store_name_hi, phone_number, whatsapp_number, 
    google_maps_url, instagram_url, facebook_url, youtube_url,
    business_hours_hi, opening_time, closing_time
) VALUES (
    'primary',
    'SETH SANWARIYA COLLECTION',
    'सेठ सांवरिया कलेक्शन',
    '+91 8529095431',
    '+91 8529095431',
    'https://maps.app.goo.gl/NQzTTJeZxeSj55bj8',
    'https://www.instagram.com/seth_sanwariya_collection_/',
    'https://www.facebook.com/p/Seth-Sanwariya-61584605940951/',
    'https://www.youtube.com/@seth_sanwariya_collection',
    'सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक (सप्ताह के सभी 7 दिन खुली रहती है)',
    '08:00',
    '22:00'
) ON CONFLICT (id) DO UPDATE SET 
    phone_number = EXCLUDED.phone_number,
    whatsapp_number = EXCLUDED.whatsapp_number,
    google_maps_url = EXCLUDED.google_maps_url,
    instagram_url = EXCLUDED.instagram_url,
    facebook_url = EXCLUDED.facebook_url,
    youtube_url = EXCLUDED.youtube_url;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || substr(md5(random()::text), 1, 8)),
    name_hi TEXT NOT NULL,
    name_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
    name_hi TEXT NOT NULL,
    name_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    description_hi TEXT NOT NULL,
    description_en TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    original_price NUMERIC CHECK (original_price >= price),
    discount_percent INTEGER DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    main_image TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HOMEPAGE BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_banners (
    id TEXT PRIMARY KEY DEFAULT ('banner-' || substr(md5(random()::text), 1, 8)),
    title_hi TEXT NOT NULL,
    subtitle_hi TEXT NOT NULL,
    badge_hi TEXT,
    image_url TEXT NOT NULL,
    button_text_hi TEXT NOT NULL DEFAULT 'कलेक्शन देखें',
    button_link TEXT NOT NULL DEFAULT '/products',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('SS-ORD-' || substr(md5(random()::text), 1, 6)),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    customer_pincode TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'whatsapp',
    order_status TEXT NOT NULL DEFAULT 'नया (Pending)',
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT USING (true);

CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Public can view active banners" ON public.homepage_banners
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

-- Public order creation
CREATE POLICY "Public can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Admin full access policies (authenticated users)
CREATE POLICY "Admin full access to store_settings" ON public.store_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to categories" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to homepage_banners" ON public.homepage_banners
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. REALTIME REPLICATION ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 9. STORAGE BUCKET CONFIGURATION FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update/delete product images" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'product-images');
