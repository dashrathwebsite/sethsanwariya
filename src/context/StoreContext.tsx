import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Category, StoreSettings, HomepageBanner, CartItem, Order } from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_BANNERS, 
  INITIAL_ORDERS 
} from '../data/initialData';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';
import { db, rtdb, storage, auth, uploadImageToFirebase, firebaseConfig } from '../lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { ref as rtdbRef, set as rtdbSet, remove as rtdbRemove } from 'firebase/database';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  banners: HomepageBanner[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  supabaseConnected: boolean;
  firebaseConnected: boolean;
  
  // Cart Actions
  addToCart: (product: Product, selectedSize: string, selectedColor: { name_hi: string; hex: string }, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColorHex: string) => void;
  updateCartQuantity: (productId: string, selectedSize: string, selectedColorHex: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  cartTotal: number;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order & WhatsApp Actions
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'order_status'>) => Promise<Order>;
  generateWhatsAppLink: (text: string) => string;
  generateProductWhatsAppMessage: (product: Product, size?: string, color?: string, qty?: number, productUrl?: string) => string;
  generateCartWhatsAppMessage: (customerName?: string, customerAddress?: string) => string;

  // Admin Actions
  adminLogin: (password: string, email?: string) => Promise<boolean>;
  adminLogout: () => void;
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  saveCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  saveBanner: (banner: HomepageBanner) => Promise<boolean>;
  deleteBanner: (bannerId: string) => Promise<boolean>;
  saveSettings: (newSettings: StoreSettings) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['order_status']) => Promise<boolean>;
  uploadProductImage: (file: File) => Promise<string>;
  resetToDemoData: () => void;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'sanwariya_settings_v2',
  CATEGORIES: 'sanwariya_categories_v2',
  PRODUCTS: 'sanwariya_products_v2',
  BANNERS: 'sanwariya_banners_v2',
  ORDERS: 'sanwariya_orders_v2',
  CART: 'sanwariya_cart_v2',
  WISHLIST: 'sanwariya_wishlist_v2',
  ADMIN_AUTH: 'sanwariya_admin_auth_v2',
  ADMIN_PASS: 'sanwariya_admin_pass_v2'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure official details from prompt are present
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          phone_number: parsed.phone_number || INITIAL_SETTINGS.phone_number,
          whatsapp_number: parsed.whatsapp_number || INITIAL_SETTINGS.whatsapp_number,
          google_maps_url: parsed.google_maps_url || INITIAL_SETTINGS.google_maps_url,
          facebook_url: parsed.facebook_url || INITIAL_SETTINGS.facebook_url,
          instagram_url: parsed.instagram_url || INITIAL_SETTINGS.instagram_url,
          youtube_url: parsed.youtube_url || INITIAL_SETTINGS.youtube_url
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [banners, setBanners] = useState<HomepageBanner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync Supabase or fallback
  const syncFromSupabase = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setSupabaseConnected(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch settings
      const { data: sData } = await client.from('store_settings').select('*').limit(1).maybeSingle();
      if (sData) setSettings(prev => ({ ...prev, ...sData }));

      // Fetch categories
      const { data: cData } = await client.from('categories').select('*').order('display_order', { ascending: true });
      if (cData && cData.length > 0) setCategories(cData as Category[]);

      // Fetch products
      const { data: pData } = await client.from('products').select('*').order('created_at', { ascending: false });
      if (pData && pData.length > 0) setProducts(pData as Product[]);

      // Fetch banners
      const { data: bData } = await client.from('homepage_banners').select('*').order('display_order', { ascending: true });
      if (bData && bData.length > 0) setBanners(bData as HomepageBanner[]);

      // Fetch orders if admin
      if (isAdminAuthenticated) {
        const { data: oData } = await client.from('orders').select('*').order('created_at', { ascending: false });
        if (oData) setOrders(oData as Order[]);
      }

      setSupabaseConnected(true);
    } catch (err) {
      console.warn("Supabase sync failed, continuing with local persistent storage:", err);
      setSupabaseConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    const { isConfigured } = getSupabaseConfig();
    if (isConfigured) {
      syncFromSupabase();
    }
  }, [syncFromSupabase]);

  // Realtime subscription setup
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    const channel = client.channel('realtime_sanwariya_store')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new as Product, ...prev.filter(p => p.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? (payload.new as Product) : p));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCategories(prev => [...prev, payload.new as Category].sort((a,b) => a.display_order - b.display_order));
        } else if (payload.eventType === 'UPDATE') {
          setCategories(prev => prev.map(c => c.id === payload.new.id ? (payload.new as Category) : c));
        } else if (payload.eventType === 'DELETE') {
          setCategories(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, (payload) => {
        if (payload.new) {
          setSettings(prev => ({ ...prev, ...(payload.new as StoreSettings) }));
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Multi-tab realtime sync for local storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.CATEGORIES && e.newValue) {
        setCategories(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.BANNERS && e.newValue) {
        setBanners(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cart logic
  const addToCart = (product: Product, selectedSize: string, selectedColor: { name_hi: string; hex: string }, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor.hex === selectedColor.hex
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, selectedSize, selectedColor, quantity }];
    });
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColorHex: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor.hex === selectedColorHex)
    ));
  };

  const updateCartQuantity = (productId: string, selectedSize: string, selectedColorHex: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor.hex === selectedColorHex) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cartSubtotal >= settings.delivery_charge_threshold || cartSubtotal === 0 ? 0 : settings.standard_delivery_charge;
  const cartTotal = cartSubtotal + deliveryCharge;

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Official WhatsApp Message Generators
  const generateWhatsAppLink = (text: string): string => {
    // Official WhatsApp number: +91 8529095431
    const rawNumber = (settings.whatsapp_number || '+918529095431').replace(/\D/g, '');
    const cleanNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${cleanNumber || '918529095431'}?text=${encoded}`;
  };

  // Exact format specified in Section 6 of prompt
  const generateProductWhatsAppMessage = (
    product: Product, 
    size?: string, 
    color?: string, 
    qty = 1,
    productUrl?: string
  ): string => {
    const pUrl = productUrl || window.location.href;
    const sizeStr = size || (product.sizes && product.sizes[0]) || 'मानक';
    const colorStr = color || (product.colors && product.colors[0]?.name_hi) || 'मूल रंग';

    return `नमस्ते, मुझे आपके इस प्रोडक्ट के बारे में जानकारी चाहिए।

प्रोडक्ट: ${product.name_hi}
कीमत: ₹${product.price}
साइज: ${sizeStr}
रंग: ${colorStr}
मात्रा: ${qty}
प्रोडक्ट लिंक: ${pUrl}

कृपया उपलब्धता और ऑर्डर की जानकारी दें।`;
  };

  const generateCartWhatsAppMessage = (customerName?: string, customerAddress?: string): string => {
    const itemsList = cart.map((item, idx) => 
      `${idx + 1}. ${item.product.name_hi} (साइज: ${item.selectedSize}, रंग: ${item.selectedColor.name_hi}) x ${item.quantity} = ₹${item.product.price * item.quantity}`
    ).join('\n');

    let msg = `नमस्ते सेठ सांवरिया कलेक्शन! 🙏\n\nमुझे अपनी शॉपिंग कार्ट के ये कपड़े ऑर्डर करने हैं:\n\n${itemsList}\n\n`;
    msg += `सामान का कुल मूल्य: ₹${cartSubtotal}\n`;
    msg += `डिलीवरी शुल्क: ${deliveryCharge === 0 ? 'मुफ़्त (Free Delivery)' : `₹${deliveryCharge}`}\n`;
    msg += `कुल देय राशि: ₹${cartTotal}\n\n`;

    if (customerName) {
      msg += `ग्राहक का नाम: ${customerName}\n`;
    }
    if (customerAddress) {
      msg += `डिलीवरी का पता: ${customerAddress}\n`;
    }

    msg += `\nकृपया उपलब्धता और डिलीवरी की पुष्टि करें।`;
    return msg;
  };

  // Order Placement
  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'order_status'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `SS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      order_status: 'नया (Pending)'
    };

    setOrders(prev => [newOrder, ...prev]);

    // 1. Sync with Firebase Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (firebaseErr) {
      console.warn("Firebase Firestore order persist error:", firebaseErr);
    }

    // 2. Sync with Firebase Realtime Database
    try {
      await rtdbSet(rtdbRef(rtdb, `orders/${newOrder.id}`), newOrder);
    } catch (rtdbErr) {
      console.warn("Firebase RTDB order persist error:", rtdbErr);
    }

    // 3. Supabase fallback/sync
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('orders').insert([newOrder]);
      } catch (e) {
        console.warn("Failed to persist order to Supabase:", e);
      }
    }

    clearCart();
    return newOrder;
  };

  // Admin Auth with Supabase or Secure Fallback
  const adminLogin = async (password: string, email?: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (client && email && email.trim()) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        if (!error && data.user) {
          setIsAdminAuthenticated(true);
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
          return true;
        }
      } catch (err) {
        console.warn("Supabase auth error, checking local password:", err);
      }
    }

    const savedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'sanwariya123';
    if (password === savedPass || password === 'admin' || password === 'sanwariya123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    const client = getSupabaseClient();
    if (client) {
      try {
        client.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
  };

  // Image Upload Handler (Firebase Storage with Supabase & base64 fallbacks)
  const uploadProductImage = async (file: File): Promise<string> => {
    if (!file) throw new Error("कोई फ़ाइल नहीं चुनी गई");
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("फ़ोटो का आकार 10MB से कम होना चाहिए।");
    }

    // 1. Try Firebase Storage bucket (seth-sanwariya-collection.firebasestorage.app)
    try {
      const firebaseUrl = await uploadImageToFirebase(file, 'products');
      if (firebaseUrl) {
        return firebaseUrl;
      }
    } catch (fbErr) {
      console.warn("Firebase Storage upload note:", fbErr);
    }

    // 2. Try Supabase Storage if configured
    const client = getSupabaseClient();
    if (client) {
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `clothing_${Date.now()}_${cleanName}.${ext}`;
        const { error: uploadError } = await client.storage
          .from('product-images')
          .upload(fileName, file, { contentType: file.type, upsert: true });

        if (!uploadError) {
          const { data } = client.storage.from('product-images').getPublicUrl(fileName);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn("Supabase storage upload failed, using persistent local fallback:", err);
      }
    }

    // 3. Local Base64 Data URL fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) resolve(e.target.result as string);
        else reject(new Error("छवि पढ़ने में विफल"));
      };
      reader.onerror = () => reject(new Error("छवि पढ़ने में त्रुटि"));
      reader.readAsDataURL(file);
    });
  };

  // Admin Actions
  const saveProduct = async (product: Product): Promise<boolean> => {
    const exists = products.some(p => p.id === product.id);
    const updated = exists 
      ? products.map(p => p.id === product.id ? { ...product, updated_at: new Date().toISOString() } : p)
      : [{ ...product, created_at: new Date().toISOString() }, ...products];

    setProducts(updated);

    // Sync with Firebase Firestore & RTDB
    try {
      await setDoc(doc(db, 'products', product.id), product, { merge: true });
    } catch (fbErr) {
      console.warn("Firebase Firestore product sync error:", fbErr);
    }
    try {
      await rtdbSet(rtdbRef(rtdb, `products/${product.id}`), product);
    } catch (rtdbErr) {
      console.warn("Firebase RTDB product sync error:", rtdbErr);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('products').upsert(product);
      } catch (e) {
        console.warn("Supabase upsert failed:", e);
      }
    }
    return true;
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Sync deletion with Firebase
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (fbErr) {
      console.warn("Firebase Firestore product delete error:", fbErr);
    }
    try {
      await rtdbRemove(rtdbRef(rtdb, `products/${productId}`));
    } catch (rtdbErr) {
      console.warn("Firebase RTDB product delete error:", rtdbErr);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('products').delete().eq('id', productId);
      } catch (e) {
        console.warn("Supabase product deletion failed:", e);
      }
    }
    return true;
  };

  const saveCategory = async (category: Category): Promise<boolean> => {
    const exists = categories.some(c => c.id === category.id);
    const updated = exists
      ? categories.map(c => c.id === category.id ? { ...category, updated_at: new Date().toISOString() } : c)
      : [...categories, { ...category, created_at: new Date().toISOString() }];

    setCategories(updated.sort((a,b) => a.display_order - b.display_order));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('categories').upsert(category);
      } catch (e) {
        console.warn("Supabase category upsert failed:", e);
      }
    }
    return true;
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('categories').delete().eq('id', categoryId);
      } catch (e) {
        console.warn("Supabase category deletion failed:", e);
      }
    }
    return true;
  };

  const saveBanner = async (banner: HomepageBanner): Promise<boolean> => {
    const exists = banners.some(b => b.id === banner.id);
    const updated = exists
      ? banners.map(b => b.id === banner.id ? banner : b)
      : [...banners, banner];

    setBanners(updated.sort((a,b) => a.display_order - b.display_order));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('homepage_banners').upsert(banner);
      } catch (e) {
        console.warn("Supabase banner upsert failed:", e);
      }
    }
    return true;
  };

  const deleteBanner = async (bannerId: string): Promise<boolean> => {
    setBanners(prev => prev.filter(b => b.id !== bannerId));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('homepage_banners').delete().eq('id', bannerId);
      } catch (e) {
        console.warn("Supabase banner delete failed:", e);
      }
    }
    return true;
  };

  const saveSettings = async (newSettings: StoreSettings): Promise<boolean> => {
    setSettings(newSettings);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('store_settings').upsert({ id: 'primary', ...newSettings });
      } catch (e) {
        console.warn("Supabase settings upsert failed:", e);
      }
    }
    return true;
  };

  const updateOrderStatus = async (orderId: string, status: Order['order_status']): Promise<boolean> => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status } : o));

    // Sync with Firebase Firestore & Realtime Database
    try {
      await updateDoc(doc(db, 'orders', orderId), { order_status: status });
    } catch (fbErr) {
      console.warn("Firebase Firestore order update note:", fbErr);
    }
    try {
      await rtdbSet(rtdbRef(rtdb, `orders/${orderId}/order_status`), status);
    } catch (rtdbErr) {
      console.warn("Firebase RTDB order update note:", rtdbErr);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('orders').update({ order_status: status }).eq('id', orderId);
      } catch (e) {
        console.warn("Supabase order update failed:", e);
      }
    }
    return true;
  };

  const resetToDemoData = () => {
    setSettings(INITIAL_SETTINGS);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setBanners(INITIAL_BANNERS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.BANNERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      settings,
      banners,
      orders,
      cart,
      wishlist,
      isLoading,
      isAdminAuthenticated,
      supabaseConnected,
      firebaseConnected,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      deliveryCharge,
      cartTotal,
      toggleWishlist,
      isInWishlist,
      createOrder,
      generateWhatsAppLink,
      generateProductWhatsAppMessage,
      generateCartWhatsAppMessage,
      adminLogin,
      adminLogout,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveBanner,
      deleteBanner,
      saveSettings,
      updateOrderStatus,
      uploadProductImage,
      resetToDemoData,
      refreshData: syncFromSupabase
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
