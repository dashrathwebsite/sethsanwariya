export interface Category {
  id: string;
  name_hi: string;
  name_en?: string;
  slug: string;
  image_url: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name_hi: string;
  name_en?: string;
  slug: string;
  category_id: string;
  description_hi: string;
  description_en?: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  sku: string;
  stock_quantity: number;
  sizes: string[];
  colors: { name_hi: string; name_en?: string; hex: string }[];
  images: string[];
  main_image: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name_hi: string; hex: string };
  quantity: number;
}

export interface HomepageBanner {
  id: string;
  title_hi: string;
  subtitle_hi: string;
  badge_hi?: string;
  image_url: string;
  button_text_hi: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
}

export interface StoreSettings {
  store_name: string;
  store_name_hi: string;
  tagline_hi: string;
  phone_number: string;
  whatsapp_number: string;
  address_hi: string;
  google_maps_url: string;
  business_hours_hi: string;
  opening_time: string; // "08:00"
  closing_time: string; // "22:00"
  is_exceptional_closure: boolean;
  exceptional_closure_reason?: string;
  delivery_charge_threshold: number;
  standard_delivery_charge: number;
  announcement_bar_hi: string;
  about_text_hi: string;
  return_policy_hi: string;
  shipping_policy_hi: string;
  cancellation_policy_hi: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  supabase_configured?: boolean;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_pincode: string;
  payment_method: 'whatsapp' | 'cod' | 'inquiry';
  order_status: 'नया (Pending)' | 'स्वीकृत (Confirmed)' | 'डिस्पैच (Dispatched)' | 'सफलतापूर्वक पूरा (Delivered)' | 'रद्द (Cancelled)';
  total_amount: number;
  items: {
    product_id: string;
    product_name_hi: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image_url: string;
  }[];
  notes?: string;
}
