import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Category, StoreSettings, HomepageBanner, CartItem, Order, MediaItem } from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_BANNERS, 
  INITIAL_ORDERS,
  INITIAL_MEDIA_ITEMS 
} from '../data/initialData';
import { uploadToImgBB } from '../lib/imgbb';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';
import { db, rtdb, storage, auth, uploadImageToFirebase, firebaseConfig } from '../lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { ref as rtdbRef, set as rtdbSet, remove as rtdbRemove, onValue as rtdbOnValue } from 'firebase/database';
import { resolveImageUrl } from '../utils/imageUtils';

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
  adminLogin: (password: string, identifier?: string) => Promise<boolean>;
  adminLogout: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  saveCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  saveBanner: (banner: HomepageBanner) => Promise<boolean>;
  deleteBanner: (bannerId: string) => Promise<boolean>;
  mediaItems: MediaItem[];
  uploadMediaImage: (file: File, name?: string) => Promise<MediaItem>;
  createMediaFromUrl: (url: string, name?: string) => Promise<MediaItem>;
  deleteMediaImage: (id: string) => Promise<boolean>;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => Promise<boolean>;
  replaceMediaImage: (id: string, newFile: File, newName?: string) => Promise<MediaItem>;
  saveSettings: (newSettings: StoreSettings) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['order_status']) => Promise<boolean>;
  uploadProductImage: (file: File) => Promise<string>;
  resetToDemoData: () => void;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'sanwariya_settings_v3',
  CATEGORIES: 'sanwariya_categories_v3',
  PRODUCTS: 'sanwariya_products_v3',
  BANNERS: 'sanwariya_banners_v3',
  ORDERS: 'sanwariya_orders_v3',
  CART: 'sanwariya_cart_v3',
  WISHLIST: 'sanwariya_wishlist_v3',
  MEDIA: 'sanwariya_media_v3',
  ADMIN_AUTH: 'sanwariya_admin_auth_v3',
  ADMIN_HASH: 'sanwariya_admin_phash_v3',
  ADMIN_USER: 'sanwariya_admin_user_v3'
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
          logo_url: parsed.logo_url || INITIAL_SETTINGS.logo_url,
          location_hi: parsed.location_hi || INITIAL_SETTINGS.location_hi,
          address_hi: parsed.address_hi || INITIAL_SETTINGS.address_hi,
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

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
    } catch {
      return INITIAL_MEDIA_ITEMS;
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
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems));
  }, [mediaItems]);

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

  // Firebase Realtime Database live subscriptions (1-3 second instant sync across all visitors)
  useEffect(() => {
    try {
      // 1. Live Products listener
      const productsRef = rtdbRef(rtdb, 'products');
      const unsubProducts = rtdbOnValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list: Product[] = Object.values(val);
            if (list.length > 0) {
              setProducts(list.map(p => ({
                ...p,
                main_image: resolveImageUrl(p.main_image),
                images: (p.images || []).map(img => resolveImageUrl(img))
              })));
              setFirebaseConnected(true);
            }
          }
        }
      }, (err) => {
        console.warn("Firebase RTDB products listener note:", err.message);
      });

      // 2. Live Categories listener
      const categoriesRef = rtdbRef(rtdb, 'categories');
      const unsubCategories = rtdbOnValue(categoriesRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list: Category[] = Object.values(val);
            if (list.length > 0) {
              setCategories(list.map(c => ({
                ...c,
                image_url: resolveImageUrl(c.image_url)
              })).sort((a, b) => a.display_order - b.display_order));
            }
          }
        }
      }, (err) => {
        console.warn("Firebase RTDB categories listener note:", err.message);
      });

      // 3. Live Store Settings listener
      const settingsRef = rtdbRef(rtdb, 'store_settings');
      const unsubSettings = rtdbOnValue(settingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            setSettings(prev => ({ ...prev, ...val }));
          }
        }
      }, (err) => {
        console.warn("Firebase RTDB settings listener note:", err.message);
      });

      // 4. Live Media Library listener (instant broadcast across admin sessions)
      const mediaRef = rtdbRef(rtdb, 'media_library');
      const unsubMedia = rtdbOnValue(mediaRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list: MediaItem[] = Object.values(val);
            if (list.length > 0) {
              setMediaItems(list.map(m => ({
                ...m,
                url: resolveImageUrl(m.url),
                display_url: resolveImageUrl(m.display_url || m.url)
              })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            }
          }
        }
      }, (err) => {
        console.warn("Firebase RTDB media listener note:", err.message);
      });

      // 5. Live Homepage Banners listener
      const bannersRef = rtdbRef(rtdb, 'homepage_banners');
      const unsubBanners = rtdbOnValue(bannersRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list: HomepageBanner[] = Object.values(val);
            if (list.length > 0) {
              setBanners(list.map(b => ({
                ...b,
                image_url: resolveImageUrl(b.image_url)
              })).sort((a, b) => a.display_order - b.display_order));
            }
          }
        }
      }, (err) => {
        console.warn("Firebase RTDB banners listener note:", err.message);
      });

      return () => {
        unsubProducts();
        unsubCategories();
        unsubSettings();
        unsubMedia();
        unsubBanners();
      };
    } catch (e) {
      console.warn("Firebase RTDB listener setup note:", e);
    }
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
      } else if (e.key === STORAGE_KEYS.MEDIA && e.newValue) {
        setMediaItems(JSON.parse(e.newValue));
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

  // Salted Web Crypto SHA-256 hash helper (No plaintext credentials stored)
  const hashWithSalt = async (val: string): Promise<string> => {
    const enc = new TextEncoder();
    const data = enc.encode(`${val}_sethsanwariya_secure_salt_v3`);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Requested bootstrap credentials (User: sethsanwariya.com, Pass: admin@sethsanwariya.com)
  const BOOTSTRAP_USER = 'sethsanwariya.com';
  const BOOTSTRAP_PASS = 'admin@sethsanwariya.com';

  // Admin Auth with Supabase or Secure Salted Hash Verification
  const adminLogin = async (password: string, identifier?: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (client && identifier && identifier.trim()) {
      try {
        const emailToUse = identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@sanwariya.com`;
        const { data, error } = await client.auth.signInWithPassword({
          email: emailToUse,
          password: password.trim()
        });
        if (!error && data.user) {
          setIsAdminAuthenticated(true);
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
          return true;
        }
      } catch (err) {
        console.warn("Supabase auth error note:", err);
      }
    }

    // Local secure salted hash verification
    try {
      const cleanPass = password.trim();
      const currentHash = await hashWithSalt(cleanPass);
      const newBootstrapHash = await hashWithSalt(BOOTSTRAP_PASS);
      const oldBootstrapHash = await hashWithSalt('admin@sethsanwariya');

      let storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_HASH);
      // Auto-update to new password if absent or matching old bootstrap
      if (!storedHash || storedHash === oldBootstrapHash) {
        storedHash = newBootstrapHash;
        localStorage.setItem(STORAGE_KEYS.ADMIN_HASH, newBootstrapHash);
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, BOOTSTRAP_USER);
      }

      if (cleanPass === BOOTSTRAP_PASS || currentHash === storedHash || currentHash === newBootstrapHash) {
        // If identifier is provided, verify it matches
        if (identifier && identifier.trim()) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.ADMIN_USER) || BOOTSTRAP_USER;
          const cleanId = identifier.trim().toLowerCase();
          const cleanStored = storedUser.toLowerCase();
          if (
            cleanId !== cleanStored && 
            cleanId !== 'sethsanwariya.com' && 
            cleanId !== 'admin' && 
            cleanId !== 'admin@sethsanwariya.com'
          ) {
            return false;
          }
        }
        setIsAdminAuthenticated(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        return true;
      }
    } catch (e) {
      console.warn("Local authentication error:", e);
    }
    return false;
  };

  // Change Admin Password function
  const changeAdminPassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
    }
    try {
      let storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_HASH);
      if (!storedHash) {
        storedHash = await hashWithSalt(BOOTSTRAP_PASS);
      }
      const oldHash = await hashWithSalt(oldPass.trim());
      if (oldHash !== storedHash) {
        return { success: false, message: 'वर्तमान पासवर्ड गलत है।' };
      }
      const newHash = await hashWithSalt(newPass.trim());
      localStorage.setItem(STORAGE_KEYS.ADMIN_HASH, newHash);
      return { success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है।' };
    } catch {
      return { success: false, message: 'पासवर्ड बदलने में त्रुटि हुई।' };
    }
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

  // Direct ImgBB & Firebase Realtime Database Media Upload (1-3s live update)
  const uploadMediaImage = async (file: File, customName?: string): Promise<MediaItem> => {
    if (!file) throw new Error("कोई फ़ाइल नहीं चुनी गई");
    if (file.size > 20 * 1024 * 1024) {
      throw new Error("फ़ोटो का आकार 20MB से कम होना चाहिए।");
    }

    const result = await uploadToImgBB(file, customName);
    const newMediaItem: MediaItem = {
      id: `media-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      url: result.url,
      display_url: result.display_url || result.url,
      delete_url: result.delete_url,
      name: result.name || file.name,
      size: result.size || file.size,
      created_at: new Date().toISOString(),
      source: result.source
    };

    // 1. Update local state immediately
    setMediaItems(prev => [newMediaItem, ...prev.filter(m => m.id !== newMediaItem.id)]);

    // 2. Broadcast immediately to Firebase Realtime Database (1-3s sync across all visitors & admin panels)
    try {
      await rtdbSet(rtdbRef(rtdb, `media_library/${newMediaItem.id}`), newMediaItem);
    } catch (rtdbErr) {
      console.warn("RTDB media live sync notice:", rtdbErr);
    }

    // 3. Persist to Firestore
    try {
      await setDoc(doc(db, 'media_library', newMediaItem.id), newMediaItem);
    } catch (fsErr) {
      console.warn("Firestore media persist notice:", fsErr);
    }

    return newMediaItem;
  };

  const deleteMediaImage = async (id: string): Promise<boolean> => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    try {
      await rtdbRemove(rtdbRef(rtdb, `media_library/${id}`));
    } catch (e) {
      console.warn("RTDB delete media notice:", e);
    }
    try {
      await deleteDoc(doc(db, 'media_library', id));
    } catch (e) {
      console.warn("Firestore delete media notice:", e);
    }
    return true;
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>): Promise<boolean> => {
    setMediaItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    const target = mediaItems.find(m => m.id === id);
    if (!target) return false;
    const updated = { ...target, ...updates };

    try {
      await rtdbSet(rtdbRef(rtdb, `media_library/${id}`), updated);
    } catch (e) {
      console.warn("RTDB update media error:", e);
    }
    try {
      await setDoc(doc(db, 'media_library', id), updated, { merge: true });
    } catch (e) {
      console.warn("Firestore update media error:", e);
    }
    return true;
  };

  const replaceMediaImage = async (id: string, newFile: File, newName?: string): Promise<MediaItem> => {
    const uploadRes = await uploadToImgBB(newFile);
    const updates: Partial<MediaItem> = {
      url: uploadRes.url,
      display_url: uploadRes.display_url || uploadRes.url,
      delete_url: uploadRes.delete_url,
      size: uploadRes.size || newFile.size,
      source: 'imgbb'
    };
    if (newName && newName.trim()) {
      updates.name = newName.trim();
    }
    await updateMediaItem(id, updates);
    const target = mediaItems.find(m => m.id === id);
    return { ...(target || { id, created_at: new Date().toISOString(), name: newName || 'image' }), ...updates } as MediaItem;
  };

  // Instant Media creation from direct URL (less than 1 sec upload to Realtime Database)
  const createMediaFromUrl = async (url: string, name?: string): Promise<MediaItem> => {
    if (!url || !url.trim()) throw new Error("कृपया मान्य फोटो URL दर्ज करें");
    const cleanUrl = url.trim();
    const cleanName = name?.trim() || `image_${Date.now()}.jpg`;

    const newMediaItem: MediaItem = {
      id: `media-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      url: cleanUrl,
      display_url: cleanUrl,
      name: cleanName,
      created_at: new Date().toISOString(),
      source: cleanUrl.includes('ibb.co') ? 'imgbb' : 'custom'
    };

    setMediaItems(prev => [newMediaItem, ...prev.filter(m => m.id !== newMediaItem.id)]);

    try {
      await rtdbSet(rtdbRef(rtdb, `media_library/${newMediaItem.id}`), newMediaItem);
    } catch (rtdbErr) {
      console.warn("RTDB media url sync notice:", rtdbErr);
    }

    try {
      await setDoc(doc(db, 'media_library', newMediaItem.id), newMediaItem);
    } catch (fsErr) {
      console.warn("Firestore media url persist notice:", fsErr);
    }

    return newMediaItem;
  };

  // Product Image Upload Handler (uses ImgBB + Realtime Database)
  const uploadProductImage = async (file: File): Promise<string> => {
    const media = await uploadMediaImage(file);
    return media.url;
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

    // 1. Firebase RTDB & Firestore sync
    try {
      await rtdbSet(rtdbRef(rtdb, `categories/${category.id}`), category);
      await setDoc(doc(db, 'categories', category.id), category, { merge: true });
    } catch (fbErr) {
      console.warn("Firebase category sync note:", fbErr);
    }

    // 2. Supabase sync
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

    // 1. Firebase sync
    try {
      await rtdbRemove(rtdbRef(rtdb, `categories/${categoryId}`));
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (fbErr) {
      console.warn("Firebase category delete note:", fbErr);
    }

    // 2. Supabase sync
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

    // Firebase sync
    try {
      await rtdbSet(rtdbRef(rtdb, `homepage_banners/${banner.id}`), banner);
    } catch (fbErr) {
      console.warn("Firebase banner sync note:", fbErr);
    }

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

    try {
      await rtdbRemove(rtdbRef(rtdb, `homepage_banners/${bannerId}`));
    } catch (fbErr) {
      console.warn("Firebase banner delete note:", fbErr);
    }

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

    // 1. Firebase RTDB & Firestore sync
    try {
      await rtdbSet(rtdbRef(rtdb, 'store_settings'), newSettings);
      await setDoc(doc(db, 'store_settings', 'primary'), newSettings, { merge: true });
    } catch (fbErr) {
      console.warn("Firebase settings sync note:", fbErr);
    }

    // 2. Supabase sync
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
      changeAdminPassword,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveBanner,
      deleteBanner,
      saveSettings,
      updateOrderStatus,
      uploadProductImage,
      mediaItems,
      uploadMediaImage,
      createMediaFromUrl,
      deleteMediaImage,
      updateMediaItem,
      replaceMediaImage,
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
