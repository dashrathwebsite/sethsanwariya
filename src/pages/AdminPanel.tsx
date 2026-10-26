import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, StoreSettings, HomepageBanner, Order, MediaItem } from '../types';
import { getSupabaseConfig, resetSupabaseClient } from '../lib/supabase';
import { resolveImageUrl } from '../utils/imageUtils';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Sliders, 
  Settings, 
  ClipboardList, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle, 
  Upload, 
  Phone, 
  MessageCircle, 
  Database,
  ExternalLink,
  Search,
  Sparkles,
  Lock,
  RefreshCw,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Loader2,
  Image as ImageIcon,
  Copy,
  CheckCheck,
  Zap,
  Link2
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    banners, 
    orders,
    mediaItems,
    uploadMediaImage,
    createMediaFromUrl,
    deleteMediaImage,
    isAdminAuthenticated, 
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
    resetToDemoData,
    refreshData,
    supabaseConnected,
    firebaseConnected 
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [oldPassInput, setOldPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'media' | 'products' | 'categories' | 'banners' | 'orders' | 'settings' | 'supabase'>('dashboard');

  // Media Management states (<1 sec realtime upload)
  const [mediaUploadTitle, setMediaUploadTitle] = useState('');
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [directMediaUrl, setDirectMediaUrl] = useState('');
  const [directMediaTitle, setDirectMediaTitle] = useState('');
  const [isAddingDirectUrl, setIsAddingDirectUrl] = useState(false);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'product_main' | 'category' | 'banner' | null>(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [editingBanner, setEditingBanner] = useState<HomepageBanner | null>(null);
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);

  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Admin Catalog Search
  const [productSearch, setProductSearch] = useState('');

  // Supabase connection keys state
  const [customSupabaseUrl, setCustomSupabaseUrl] = useState(() => localStorage.getItem('sanwariya_supabase_url') || '');
  const [customSupabaseAnonKey, setCustomSupabaseAnonKey] = useState(() => localStorage.getItem('sanwariya_supabase_anon_key') || '');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Sync tempSettings if settings change from outside
  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // 1. Authentication View
  if (!isAdminAuthenticated) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      setAuthError('');
      try {
        const success = await adminLogin(passwordInput, emailInput);
        if (!success) {
          setAuthError('गलत यूज़रनेम या पासवर्ड। कृपया पुनः प्रयास करें।');
        }
      } catch (err: any) {
        setAuthError(err.message || 'लॉगिन में त्रुटि हुई।');
      } finally {
        setIsLoggingIn(false);
      }
    };

    const logoUrl = settings.logo_url || "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xl text-center space-y-6">
          {/* Official circular logo in gold frame */}
          <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-b from-[#E2B158] via-[#B8860B] to-[#5C4033] shadow-md flex items-center justify-center mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/50">
              <img
                src={logoUrl}
                alt="SETH SANWARIYA COLLECTION Logo"
                className="w-full h-full object-contain rounded-full p-0.5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold font-hindi text-[#1C1917]">
              दुकानदार एडमिन लॉगिन
            </h1>
            <p className="text-xs text-[#786C5E] font-hindi mt-1">
              सेठ सांवरिया कलेक्शन — सुरक्षित प्रशासनिक नियंत्रण
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-hindi">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                यूज़रनेम या ईमेल (Username / Email) *
              </label>
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="यूज़रनेम या ईमेल दर्ज करें"
                className="w-full px-3.5 py-2.5 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                एडमिन पासवर्ड (Password) *
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="गोपनीय पासवर्ड दर्ज करें"
                className="w-full px-3.5 py-2.5 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#1C1917] hover:bg-[#2E2824] disabled:opacity-50 text-white rounded-xl font-bold font-hindi text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin text-[#E2B158]" /> : null}
              <span>{isLoggingIn ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Secure Login)'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Real database metrics (Section 7 Dashboard)
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const availableProducts = products.filter(p => p.is_active && p.stock_quantity > 0).length;
  const unavailableProducts = products.filter(p => !p.is_active || p.stock_quantity === 0).length;
  const lowStockCount = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded text-[11px] font-bold text-[#9A6B1F]">
              ADMIN DASHBOARD
            </span>
            {firebaseConnected && (
              <span className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                🔥 Firebase: seth-sanwariya-collection
              </span>
            )}
            {supabaseConnected ? (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                ✓ Supabase Live Database
              </span>
            ) : (
              <span className="text-[11px] text-[#786C5E] bg-[#FAF8F5] border border-[#E8DFD5] px-2 py-0.5 rounded font-semibold">
                स्थानीय संग्रहण (Offline Local Sync)
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-hindi text-[#1C1917] mt-1">
            {settings.store_name_hi} - एडमिनिस्ट्रेटर कंट्रोल
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setShowPasswordChangeModal(true);
              setPassChangeStatus(null);
              setOldPassInput('');
              setNewPassInput('');
            }}
            className="p-2 text-[#44403C] hover:bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs flex items-center gap-1.5 font-hindi cursor-pointer"
            title="पासवर्ड बदलें"
          >
            <Lock className="w-3.5 h-3.5 text-[#9A6B1F]" />
            <span className="hidden sm:inline">पासवर्ड बदलें</span>
          </button>

          <button
            onClick={() => refreshData()}
            className="p-2 text-[#44403C] hover:bg-[#FAF8F5] border border-[#E8DFD5] rounded-lg text-xs flex items-center gap-1.5 font-hindi cursor-pointer"
            title="डेटा रीफ्रेश करें"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">रीफ्रेश</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold font-hindi transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD5]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#9A6B1F]" />
                <h3 className="font-bold font-hindi text-sm text-[#1C1917]">
                  व्यवस्थापक पासवर्ड बदलें
                </h3>
              </div>
              <button
                onClick={() => setShowPasswordChangeModal(false)}
                className="text-[#786C5E] hover:text-[#1C1917] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passChangeStatus && (
              <div className={`p-2.5 rounded-lg text-xs font-hindi ${passChangeStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {passChangeStatus.message}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await changeAdminPassword(oldPassInput, newPassInput);
                setPassChangeStatus(res);
                if (res.success) {
                  setTimeout(() => setShowPasswordChangeModal(false), 2000);
                }
              }}
              className="space-y-3 text-left font-hindi text-xs"
            >
              <div>
                <label className="block font-semibold mb-1 text-[#1C1917]">वर्तमान पासवर्ड (Current Password) *</label>
                <input
                  type="password"
                  required
                  value={oldPassInput}
                  onChange={(e) => setOldPassInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#9A6B1F]"
                  placeholder="वर्तमान पासवर्ड दर्ज करें"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#1C1917]">नया पासवर्ड (New Password) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#9A6B1F]"
                  placeholder="नया पासवर्ड (कम से कम 6 अक्षर)"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                नया पासवर्ड सुरक्षित करें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold font-hindi flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8DFD5] scrollbar-none">
        {[
          { id: 'dashboard', label: 'डैशबोर्ड (Overview)', icon: LayoutDashboard },
          { id: 'media', label: `मीडिया गैलरी (${mediaItems.length})`, icon: ImageIcon },
          { id: 'products', label: `कपड़े (${products.length})`, icon: Package },
          { id: 'categories', label: `श्रेणियां (${categories.length})`, icon: FolderTree },
          { id: 'orders', label: `ऑर्डर्स (${orders.length})`, icon: ClipboardList },
          { id: 'banners', label: 'होमपेज बैनर', icon: Sliders },
          { id: 'settings', label: 'स्टोर सेटिंग्स', icon: Settings },
          { id: 'supabase', label: 'Supabase डेटाबेस', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#E2B158]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: REAL DATABASE DASHBOARD
         ========================================================================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Actual Database Metrics (No fake stats per Section 7) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
              <span className="text-xs text-[#786C5E] font-hindi">कुल कपड़े (Total Products)</span>
              <p className="text-2xl font-bold font-mono text-[#1C1917] mt-1 tabular-nums">{totalProducts}</p>
              <span className="text-[11px] text-[#786C5E] font-hindi mt-1 block">
                डेटाबेस में कुल रिकॉर्ड्स
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
              <span className="text-xs text-[#786C5E] font-hindi">उपलब्ध कपड़े (Available)</span>
              <p className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">{availableProducts}</p>
              <span className="text-[11px] text-emerald-700 font-hindi mt-1 block">स्टॉक में उपलब्ध एवं सक्रिय</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
              <span className="text-xs text-[#786C5E] font-hindi">अनुपलब्ध (Unavailable / Out)</span>
              <p className="text-2xl font-bold font-mono text-red-700 mt-1 tabular-nums">{unavailableProducts}</p>
              <span className="text-[11px] text-red-700 font-hindi mt-1 block">स्टॉक समाप्त या अप्रकाशित</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
              <span className="text-xs text-[#786C5E] font-hindi">श्रेणियां (Categories)</span>
              <p className="text-2xl font-bold font-mono text-[#1C1917] mt-1 tabular-nums">{totalCategories}</p>
              <span className="text-[11px] text-[#786C5E] font-hindi mt-1 block">सक्रिय श्रेणियां</span>
            </div>
          </div>

          {/* Quick Realtime Image Uploader (<1s ImgBB + RTDB sync) */}
          <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EFEB] rounded-2xl border-2 border-[#E2B158]/40 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD5]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9A6B1F] to-[#E2B158] flex items-center justify-center text-white shadow-xs">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base font-hindi text-[#1C1917] flex items-center gap-2">
                    <span>सरल इमेज अपलोड व रियलटाइम लाइव सिंक (&lt; 1 सेकंड)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Live RTDB
                    </span>
                  </h3>
                  <p className="text-xs text-[#786C5E] font-hindi">
                    फ़ोटो चुनें या URL डालें — ImgBB व Firebase Realtime Database से 1 सेकंड से कम में पूरे स्टोर पर लाइव!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('media')}
                className="self-start sm:self-auto text-xs text-[#9A6B1F] font-bold font-hindi hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>पूरी मीडिया गैलरी खोलें ({mediaItems.length})</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {/* Option A: Direct File Upload */}
              <div className="bg-white rounded-xl border border-[#E8DFD5] p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-hindi text-[#1C1917]">
                    <Upload className="w-4 h-4 text-[#9A6B1F]" />
                    <span>विकल्प 1: मोबाइल / कंप्यूटर से डायरेक्ट फोटो अपलोड</span>
                  </div>
                  <input
                    type="text"
                    placeholder="फ़ोटो का नाम या विवरण (उदा. जोधपुरी शेरवानी)"
                    value={mediaUploadTitle}
                    onChange={(e) => setMediaUploadTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs font-hindi"
                  />
                </div>

                <div>
                  <label className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-bold font-hindi flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                    {isMediaUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#E2B158]" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#E2B158]" />
                    )}
                    <span>{isMediaUploading ? 'अपलोड व RTDB लाइव हो रहा है...' : 'फ़ाइल चुनें व तुरंत लाइव करें (< 1s)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isMediaUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsMediaUploading(true);
                          try {
                            const item = await uploadMediaImage(file, mediaUploadTitle.trim() || undefined);
                            setMediaUploadTitle('');
                            showToast(`फोटो "${item.name}" सफलतापूर्वक अपलोड होकर लाइव हो गई!`);
                          } catch (err: any) {
                            alert(err.message || "इमेज अपलोड में समस्या आई।");
                          } finally {
                            setIsMediaUploading(false);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </label>
                  <span className="text-[10px] text-[#786C5E] text-center block mt-1.5 font-hindi">
                    ⚡ ImgBB API + Firebase Realtime Database
                  </span>
                </div>
              </div>

              {/* Option B: Direct Image URL Paste */}
              <div className="bg-white rounded-xl border border-[#E8DFD5] p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-hindi text-[#1C1917]">
                    <Link2 className="w-4 h-4 text-[#9A6B1F]" />
                    <span>विकल्प 2: वेब इमेज URL से तुरंत जोड़ें</span>
                  </div>
                  <input
                    type="url"
                    placeholder="इमेज लिंक डालें (https://...)"
                    value={directMediaUrl}
                    onChange={(e) => setDirectMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="फ़ोटो का नाम (वैकल्पिक)"
                    value={directMediaTitle}
                    onChange={(e) => setDirectMediaTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs font-hindi"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    disabled={isAddingDirectUrl || !directMediaUrl.trim()}
                    onClick={async () => {
                      if (!directMediaUrl.trim()) return;
                      setIsAddingDirectUrl(true);
                      try {
                        const item = await createMediaFromUrl(directMediaUrl.trim(), directMediaTitle.trim() || undefined);
                        setDirectMediaUrl('');
                        setDirectMediaTitle('');
                        showToast(`URL से फोटो "${item.name}" लाइव हो गई!`);
                      } catch (err: any) {
                        alert(err.message || "इमेज जोड़ने में समस्या आई।");
                      } finally {
                        setIsAddingDirectUrl(false);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#9A6B1F] hover:bg-[#784E10] disabled:opacity-50 text-white rounded-lg text-xs font-bold font-hindi flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    {isAddingDirectUrl ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>{isAddingDirectUrl ? 'सहेज रहे हैं...' : 'URL से जोड़ें व लाइव करें (< 1s)'}</span>
                  </button>
                  <span className="text-[10px] text-[#786C5E] text-center block mt-1.5 font-hindi">
                    ⚡ तुरंत RTDB सिंक होकर सभी ग्राहकों को दिखाई देगी
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert if any */}
          {lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-start gap-3 text-xs font-hindi text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold block mb-1">कम स्टॉक चेतावनी (Low Stock Alert):</strong>
                <p>
                  कुल {lowStockCount} कपड़ों में 5 या उससे कम पीस शेष हैं। कृपया उत्पाद सूची में जाकर स्टॉक की समीक्षा करें।
                </p>
              </div>
            </div>
          )}

          {/* Recent Products Update list */}
          <div className="bg-white rounded-xl border border-[#E8DFD5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-hindi text-[#1C1917]">हालिया उत्पाद अपडेट (Recent Product Updates)</h3>
              <button
                onClick={() => setCurrentTab('products')}
                className="text-xs text-[#9A6B1F] font-semibold hover:underline"
              >
                सभी कपड़े देखें →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-hindi text-left">
                <thead className="bg-[#FAF8F5] text-[#786C5E] border-b border-[#E8DFD5]">
                  <tr>
                    <th className="py-2.5 px-3">फोटो</th>
                    <th className="py-2.5 px-3">नाम</th>
                    <th className="py-2.5 px-3">SKU कोड</th>
                    <th className="py-2.5 px-3">मूल्य</th>
                    <th className="py-2.5 px-3">स्टॉक स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD5]">
                  {products.slice(0, 5).map(prod => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-2 px-3">
                        <img src={prod.main_image} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF8F5]" />
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#1C1917]">{prod.name_hi}</td>
                      <td className="py-2 px-3 font-mono">{prod.sku}</td>
                      <td className="py-2 px-3 font-bold tabular-nums">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3">
                        {prod.stock_quantity > 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                            {prod.stock_quantity} पीस उपलब्ध
                          </span>
                        ) : (
                          <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
                            स्टॉक समाप्त
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: MEDIA GALLERY & INSTANT UPLOADER (< 1s SYNC)
         ========================================================================= */}
      {currentTab === 'media' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-bold">
                  🔥 REALTIME MEDIA STORAGE
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-bold">
                  ImgBB Cloud Connected
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-hindi text-[#1C1917] mt-1">
                मीडिया एवं फोटो गैलरी ({mediaItems.length} तस्वीरें)
              </h2>
              <p className="text-xs text-[#786C5E] font-hindi">
                यहाँ से कोई भी फ़ोटो सीधे अपलोड करें या लिंक जोड़ें। 1 सेकंड से कम में यह फ़ोटो Firebase Realtime Database से लाइव हो जाती है।
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#8C7A68] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="फ़ोटो नाम से खोजें..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F]"
              />
            </div>
          </div>

          {/* Dual Upload Widget */}
          <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-xs">
            <h3 className="font-bold text-sm font-hindi text-[#1C1917] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#9A6B1F]" />
              <span>नयी फ़ोटो जोड़ें (Upload or Add URL)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct File Upload */}
              <div className="border-2 border-dashed border-[#D5C7B8] hover:border-[#9A6B1F] rounded-xl p-4 text-center bg-[#FAF8F5]/60 flex flex-col items-center justify-center space-y-2">
                <input
                  type="text"
                  placeholder="फ़ोटो का नाम (उदा. सिल्क बनारसी साड़ी)"
                  value={mediaUploadTitle}
                  onChange={(e) => setMediaUploadTitle(e.target.value)}
                  className="w-full max-w-sm px-3 py-1.5 border border-[#D5C7B8] rounded-lg text-xs bg-white font-hindi"
                />

                <label className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-bold font-hindi flex items-center gap-2 cursor-pointer transition-colors shadow-xs">
                  {isMediaUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E2B158]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#E2B158]" />
                  )}
                  <span>{isMediaUploading ? 'ImgBB व RTDB पर अपलोड हो रहा है...' : 'फ़ाइल अपलोड करें (< 1s)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isMediaUploading}
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIsMediaUploading(true);
                        try {
                          const item = await uploadMediaImage(file, mediaUploadTitle.trim() || undefined);
                          setMediaUploadTitle('');
                          showToast(`फ़ोटो "${item.name}" लाइव अपलोड हो गई!`);
                        } catch (err: any) {
                          alert(err.message || "इमेज अपलोड विफल रहा");
                        } finally {
                          setIsMediaUploading(false);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-[#786C5E] font-hindi">
                  JPG, PNG, WEBP समर्थित (ImgBB API key: e59a26a8f78e44890f1889f172a629e3)
                </p>
              </div>

              {/* Direct URL Adder */}
              <div className="border border-[#E8DFD5] rounded-xl p-4 bg-[#FAF8F5]/60 flex flex-col justify-between space-y-2">
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="इमेज का वेब लिंक (URL) डालें"
                    value={directMediaUrl}
                    onChange={(e) => setDirectMediaUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5C7B8] rounded-lg text-xs bg-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="फ़ोटो का नाम (वैकल्पिक)"
                    value={directMediaTitle}
                    onChange={(e) => setDirectMediaTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5C7B8] rounded-lg text-xs bg-white font-hindi"
                  />
                </div>

                <button
                  type="button"
                  disabled={isAddingDirectUrl || !directMediaUrl.trim()}
                  onClick={async () => {
                    if (!directMediaUrl.trim()) return;
                    setIsAddingDirectUrl(true);
                    try {
                      const item = await createMediaFromUrl(directMediaUrl.trim(), directMediaTitle.trim() || undefined);
                      setDirectMediaUrl('');
                      setDirectMediaTitle('');
                      showToast(`फ़ोटो "${item.name}" डेटाबेस से लाइव हो गई!`);
                    } catch (err: any) {
                      alert(err.message || "इमेज जोड़ने में समस्या आई");
                    } finally {
                      setIsAddingDirectUrl(false);
                    }
                  }}
                  className="w-full py-2.5 bg-[#9A6B1F] hover:bg-[#784E10] disabled:opacity-50 text-white rounded-lg text-xs font-bold font-hindi flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  {isAddingDirectUrl ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Link2 className="w-4 h-4" />}
                  <span>{isAddingDirectUrl ? 'सहेज रहे हैं...' : 'URL से मीडिया में जोड़ें (< 1s)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems
              .filter(item => !mediaSearch.trim() || item.name.toLowerCase().includes(mediaSearch.toLowerCase()))
              .map((item) => {
                const isCopied = copiedMediaId === item.id;
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-[#FAF8F5] relative overflow-hidden">
                      <img
                        src={resolveImageUrl(item.url)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {item.source === 'imgbb' ? 'ImgBB' : item.source === 'firebase' ? 'Firebase' : 'Local'}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-xs font-hindi text-[#1C1917] line-clamp-1" title={item.name}>
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-[#786C5E] block font-mono">
                          {new Date(item.created_at).toLocaleDateString('hi-IN')}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-[#E8DFD5]">
                        {/* Copy Link Button */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            setCopiedMediaId(item.id);
                            setTimeout(() => setCopiedMediaId(null), 2000);
                            showToast("इमेज लिंक क्लिपबोर्ड में कॉपी हो गया!");
                          }}
                          className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold font-hindi flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                            isCopied ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#1C1917] border border-[#D5C7B8]'
                          }`}
                        >
                          {isCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#9A6B1F]" />}
                          <span>{isCopied ? 'URL कॉपी हुआ!' : 'URL कॉपी करें'}</span>
                        </button>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTab('products');
                              setIsCreatingProduct(true);
                              setEditingProduct({
                                id: `prod-${Date.now()}`,
                                name_hi: item.name,
                                name_en: '',
                                slug: `cloth-${Date.now()}`,
                                category_id: categories[0]?.id || '',
                                description_hi: `${item.name} - उच्च गुणवत्ता व राजस्थानी शिल्पकारी।`,
                                price: 999,
                                original_price: 1499,
                                discount_percent: 33,
                                sku: `SS-${Math.floor(100 + Math.random() * 900)}`,
                                stock_quantity: 10,
                                sizes: ['M', 'L', 'XL'],
                                colors: [{ name_hi: 'क्रीम', hex: '#EADDC6' }],
                                images: [item.url],
                                main_image: item.url,
                                is_featured: false,
                                is_new_arrival: true,
                                is_active: true,
                                created_at: new Date().toISOString()
                              });
                            }}
                            className="flex-1 py-1 px-1.5 bg-[#FAF8F5] hover:bg-[#EAE0D3] text-[#784E10] border border-[#D5C7B8] rounded text-[11px] font-hindi font-semibold text-center cursor-pointer"
                            title="इस फोटो से नया उत्पाद बनाएं"
                          >
                            + नया कपड़ा
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`क्या आप फ़ोटो "${item.name}" को हटाना चाहते हैं?`)) {
                                await deleteMediaImage(item.id);
                                showToast("फ़ोटो सफलतापूर्वक हटा दी गई");
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded cursor-pointer"
                            title="फ़ोटो हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRODUCT MANAGEMENT (WITH PERSISTENT IMAGE UPLOAD)
         ========================================================================= */}
      {currentTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8C7A68] absolute left-3 top-2.5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="नाम या SKU से खोजें..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F]"
              />
            </div>

            <button
              onClick={() => {
                setIsCreatingProduct(true);
                setEditingProduct({
                  id: `prod-${Date.now()}`,
                  name_hi: '',
                  name_en: '',
                  slug: `cloth-${Date.now()}`,
                  category_id: categories[0]?.id || '',
                  description_hi: '',
                  price: 999,
                  original_price: 1499,
                  discount_percent: 33,
                  sku: `SS-NEW-${Math.floor(100 + Math.random() * 900)}`,
                  stock_quantity: 10,
                  sizes: ['M', 'L', 'XL'],
                  colors: [{ name_hi: 'क्रीम', hex: '#EADDC6' }],
                  images: [],
                  main_image: '',
                  is_featured: false,
                  is_new_arrival: true,
                  is_active: true,
                  created_at: new Date().toISOString()
                });
              }}
              className="px-4 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-bold font-hindi flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E2B158]" />
              <span>नया कपड़ा जोड़ें</span>
            </button>
          </div>

          {/* Product Edit / Create Modal */}
          {(isCreatingProduct || editingProduct) && editingProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 overflow-y-auto max-h-[92vh] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
                  <h3 className="text-base font-bold font-hindi text-[#1C1917]">
                    {isCreatingProduct ? 'नया कपड़ा जोड़ें' : 'कपड़े का विवरण संपादित करें'}
                  </h3>
                  <button
                    onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                    className="p-1 text-[#44403C] hover:bg-[#FAF8F5] rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingProduct.name_hi.trim() || !editingProduct.main_image) {
                      alert("कृपया कपड़े का नाम और मुख्य फोटो अवश्य प्रदान करें।");
                      return;
                    }
                    await saveProduct(editingProduct);
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                    showToast("कपड़ा सफलतापूर्वक सहेज लिया गया!");
                  }}
                  className="space-y-4 text-xs font-hindi"
                >
                  {/* Name Hindi */}
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      कपड़े का नाम (हिंदी में) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name_hi}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name_hi: e.target.value })}
                      placeholder="उदा. शाही जरी बनारसी सिल्क साड़ी"
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg text-sm font-hindi"
                    />
                  </div>

                  {/* Name English & SKU */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        अंग्रेजी नाम (वैकल्पिक)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name_en || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                        placeholder="Banarasi Silk Saree"
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        उत्पाद कोड (SKU) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        श्रेणी (Category) *
                      </label>
                      <select
                        value={editingProduct.category_id}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_hi} ({c.name_en || ''})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        स्टॉक संख्या (Stock Quantity) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.stock_quantity}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Pricing and Discount */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        वास्तविक विक्रय मूल्य (Selling Price ₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editingProduct.price}
                        onChange={(e) => {
                          const p = parseInt(e.target.value) || 0;
                          const orig = editingProduct.original_price || p;
                          const disc = orig > p ? Math.round(((orig - p) / orig) * 100) : 0;
                          setEditingProduct({ ...editingProduct, price: p, discount_percent: disc });
                        }}
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        मूल मूल्य (Original Price ₹)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.original_price || ''}
                        onChange={(e) => {
                          const orig = parseInt(e.target.value) || 0;
                          const p = editingProduct.price;
                          const disc = orig > p ? Math.round(((orig - p) / orig) * 100) : 0;
                          setEditingProduct({ ...editingProduct, original_price: orig, discount_percent: disc });
                        }}
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        छूट (Discount %)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.discount_percent || 0}
                        readOnly
                        className="w-full px-3 py-2 border border-[#D5C7B8] bg-gray-50 rounded-lg text-emerald-700 font-bold"
                      />
                    </div>
                  </div>

                  {/* Persistent Image Upload to ImgBB & RTDB */}
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      मुख्य फोटो (Image URL, डायरेक्ट अपलोड या गैलरी से चुनें) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        required
                        value={editingProduct.main_image}
                        onChange={(e) => setEditingProduct({ 
                          ...editingProduct, 
                          main_image: e.target.value,
                          images: [e.target.value, ...(editingProduct.images.filter(x => x !== e.target.value))]
                        })}
                        placeholder="छवि URL दर्ज करें या फ़ाइल अपलोड करें"
                        className="flex-1 min-w-[200px] px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs"
                      />
                      <label className="px-3.5 py-2 bg-[#FAF8F5] border border-[#D5C7B8] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                        {isUploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9A6B1F]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-[#9A6B1F]" />
                        )}
                        <span>{isUploadingImage ? 'अपलोड हो रहा है...' : 'डायरेक्ट फोटो अपलोड'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIsUploadingImage(true);
                              try {
                                const url = await uploadProductImage(file);
                                setEditingProduct(prev => prev ? {
                                  ...prev,
                                  main_image: url,
                                  images: [url, ...prev.images]
                                } : null);
                                showToast("फोटो सफलतापूर्वक अपलोड होकर रियलटाइम लाइव हो गई!");
                              } catch (err: any) {
                                alert(err.message || "फोटो अपलोड में समस्या आई।");
                              } finally {
                                setIsUploadingImage(false);
                              }
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('product_main')}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#9A6B1F]" />
                        <span>📸 गैलरी से चुनें</span>
                      </button>
                    </div>

                    {editingProduct.main_image && (
                      <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-[#D5C7B8] bg-[#F5EFEB]">
                        <img 
                          src={resolveImageUrl(editingProduct.main_image)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      उपलब्ध साइज़ (कॉमा से अलग करें, उदा. M, L, XL, XXL)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sizes.join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setEditingProduct({ ...editingProduct, sizes: arr });
                      }}
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      कपड़े का विवरण (हिंदी में) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editingProduct.description_hi}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description_hi: e.target.value })}
                      placeholder="फैब्रिक, कढ़ाई, धुलाई निर्देश व विशेषताएं..."
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                      />
                      <span>स्टोर पर सक्रिय रखें (Publish)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_featured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                      />
                      <span>लोकप्रिय दिखाएं (Featured)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_new_arrival}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_new_arrival: e.target.checked })}
                      />
                      <span>नया आगमन (New Arrival)</span>
                    </label>
                  </div>

                  {/* Form Submit */}
                  <div className="pt-4 flex justify-end gap-2 border-t border-[#E8DFD5]">
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                      className="px-4 py-2 border border-[#D5C7B8] rounded-lg font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg font-bold"
                    >
                      सहेजें (Save Product)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Catalog Table */}
          <div className="bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-hindi text-left">
                <thead className="bg-[#FAF8F5] text-[#786C5E] border-b border-[#E8DFD5]">
                  <tr>
                    <th className="py-3 px-3">फोटो</th>
                    <th className="py-3 px-3">नाम व कोड</th>
                    <th className="py-3 px-3">श्रेणी</th>
                    <th className="py-3 px-3">कीमत</th>
                    <th className="py-3 px-3">स्टॉक</th>
                    <th className="py-3 px-3">स्थिति</th>
                    <th className="py-3 px-3 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD5]">
                  {products
                    .filter(p => !productSearch.trim() || p.name_hi.includes(productSearch) || p.sku.includes(productSearch))
                    .map((product) => (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/60">
                        <td className="py-2.5 px-3">
                          <img
                            src={product.main_image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-md bg-[#F5EFEB] border border-[#E8DFD5]"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <strong className="block text-[#1C1917] text-sm">{product.name_hi}</strong>
                          <span className="font-mono text-[11px] text-[#786C5E]">SKU: {product.sku}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {categories.find(c => c.id === product.category_id)?.name_hi || '-'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#1C1917] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          <span className={`font-semibold ${product.stock_quantity <= 5 ? 'text-[#B91C1C]' : 'text-emerald-700'}`}>
                            {product.stock_quantity} पीस
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={async () => {
                              await saveProduct({ ...product, is_active: !product.is_active });
                              showToast(product.is_active ? "उत्पाद अप्रकाशित किया गया" : "उत्पाद प्रकाशित किया गया");
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                              product.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{product.is_active ? 'सक्रिय' : 'छिपा हुआ'}</span>
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setEditingProduct(product); setIsCreatingProduct(false); }}
                              className="p-1.5 text-[#44403C] hover:bg-[#EAE0D3] rounded cursor-pointer"
                              title="संपादित करें"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`क्या आप "${product.name_hi}" को हटाना चाहते हैं?`)) {
                                  await deleteProduct(product.id);
                                  showToast("उत्पाद हटा दिया गया");
                                }
                              }}
                              className="p-1.5 text-[#B91C1C] hover:bg-red-50 rounded cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CATEGORY MANAGEMENT
         ========================================================================= */}
      {currentTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold font-hindi text-[#1C1917]">
              श्रेणियों की सूची ({categories.length})
            </h3>
            <button
              onClick={() => {
                setIsCreatingCategory(true);
                setEditingCategory({
                  id: `cat-${Date.now()}`,
                  name_hi: '',
                  name_en: '',
                  slug: `category-${Date.now()}`,
                  image_url: '',
                  description: '',
                  display_order: categories.length + 1,
                  is_active: true
                });
              }}
              className="px-4 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-bold font-hindi flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E2B158]" />
              <span>नई श्रेणी जोड़ें</span>
            </button>
          </div>

          {/* Category Edit / Create Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
                  <h3 className="text-base font-bold font-hindi text-[#1C1917]">
                    {isCreatingCategory ? 'नई श्रेणी जोड़ें' : 'श्रेणी संपादित करें'}
                  </h3>
                  <button
                    onClick={() => { setEditingCategory(null); setIsCreatingCategory(false); }}
                    className="p-1 text-[#44403C] hover:bg-[#FAF8F5] rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingCategory.name_hi.trim() || !editingCategory.image_url) {
                      alert("कृपया श्रेणी का नाम और फोटो अवश्य प्रदान करें।");
                      return;
                    }
                    await saveCategory(editingCategory);
                    setEditingCategory(null);
                    setIsCreatingCategory(false);
                    showToast("श्रेणी सफलतापूर्वक सहेज ली गई!");
                  }}
                  className="space-y-4 text-xs font-hindi"
                >
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      श्रेणी का नाम (हिंदी में) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name_hi}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name_hi: e.target.value })}
                      placeholder="उदा. महिलाओं के परिधान"
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      अंग्रेजी नाम (English Name - Optional)
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name_en || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                      placeholder="Women Ethnic Wear"
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      श्रेणी फोटो (URL, डायरेक्ट अपलोड या गैलरी से चुनें) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        required
                        value={editingCategory.image_url}
                        onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                        placeholder="छवि URL दर्ज करें"
                        className="flex-1 min-w-[200px] px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs"
                      />
                      <label className="px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B8] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                        {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#9A6B1F]" />}
                        <span>फोटो अपलोड</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIsUploadingImage(true);
                              try {
                                const url = await uploadProductImage(file);
                                setEditingCategory(prev => prev ? { ...prev, image_url: url } : null);
                                showToast("श्रेणी फोटो अपलोड हो गई!");
                              } catch (err: any) {
                                alert(err.message || "अपलोड विफल");
                              } finally {
                                setIsUploadingImage(false);
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('category')}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#9A6B1F]" />
                        <span>📸 गैलरी से चुनें</span>
                      </button>
                    </div>

                    {editingCategory.image_url && (
                      <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-[#D5C7B8] bg-[#F5EFEB]">
                        <img 
                          src={resolveImageUrl(editingCategory.image_url)} 
                          alt="Category preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="cat_active"
                      checked={editingCategory.is_active}
                      onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                    />
                    <label htmlFor="cat_active" className="cursor-pointer font-semibold">
                      श्रेणी को स्टोर पर सक्रिय रखें (Visible)
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-[#E8DFD5]">
                    <button
                      type="button"
                      onClick={() => { setEditingCategory(null); setIsCreatingCategory(false); }}
                      className="px-4 py-2 border border-[#D5C7B8] rounded-lg font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg font-bold"
                    >
                      सहेजें
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl border border-[#E8DFD5] p-3 shadow-xs space-y-2">
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#FAF8F5] relative">
                  <img 
                    src={resolveImageUrl(cat.image_url)} 
                    alt={cat.name_hi} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => { setEditingCategory(cat); setIsCreatingCategory(false); }}
                      className="p-1.5 bg-white/90 hover:bg-white text-[#1C1917] rounded shadow-xs cursor-pointer"
                      title="संपादित करें"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`क्या आप श्रेणी "${cat.name_hi}" हटाना चाहते हैं?`)) {
                          await deleteCategory(cat.id);
                          showToast("श्रेणी हटाई गई");
                        }
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-[#B91C1C] rounded shadow-xs cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm font-hindi text-[#1C1917]">{cat.name_hi}</h4>
                  {cat.name_en && <p className="text-[11px] text-[#786C5E]">{cat.name_en}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ORDERS & INQUIRIES MANAGEMENT
         ========================================================================= */}
      {currentTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold font-hindi text-[#1C1917]">
            ग्राहक ऑर्डर्स व पूछताछ सूची ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-[#E8DFD5] text-center text-xs text-[#786C5E] font-hindi">
              अभी कोई ऑर्डर दर्ज नहीं हुआ है। ग्राहक जब WhatsApp या चेकआउट फॉर्म भरेंगे, तो वे यहाँ दिखाई देंगे।
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DFD5]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1C1917]">{order.id}</span>
                        <span className="text-[11px] text-[#786C5E]">· {new Date(order.created_at).toLocaleDateString('hi-IN')}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1C1917] mt-0.5 font-hindi">
                        {order.customer_name} ({order.customer_phone})
                      </p>
                    </div>

                    {/* Order Status Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#786C5E] font-hindi">स्थिति:</span>
                      <select
                        value={order.order_status}
                        onChange={async (e) => {
                          await updateOrderStatus(order.id, e.target.value as any);
                          showToast("ऑर्डर स्थिति अद्यतन की गई!");
                        }}
                        className="px-2.5 py-1 text-xs font-hindi border border-[#D5C7B8] rounded-lg bg-white"
                      >
                        <option value="नया (Pending)">नया (Pending)</option>
                        <option value="स्वीकृत (Confirmed)">स्वीकृत (Confirmed)</option>
                        <option value="डिस्पैच (Dispatched)">डिस्पैच (Dispatched)</option>
                        <option value="सफलतापूर्वक पूरा (Delivered)">सफलतापूर्वक पूरा (Delivered)</option>
                        <option value="रद्द (Cancelled)">रद्द (Cancelled)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-hindi">
                    <div>
                      <strong className="text-[#786C5E] block mb-1">डिलीवरी पता:</strong>
                      <p className="text-[#1C1917] leading-relaxed">
                        {order.customer_address}, {order.customer_city} ({order.customer_pincode})
                      </p>
                    </div>

                    <div>
                      <strong className="text-[#786C5E] block mb-1">सामान सूची:</strong>
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-[#1C1917]">
                            <span>{item.product_name_hi} ({item.size}, {item.color}) x {item.quantity}</span>
                            <span className="font-bold tabular-nums">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-[#E8DFD5] pt-1.5 mt-2 flex justify-between font-bold text-sm text-[#9A6B1F]">
                        <span>कुल राशि:</span>
                        <span className="tabular-nums">₹{order.total_amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="pt-2 flex items-center gap-2 border-t border-[#E8DFD5]">
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#D5C7B8] text-[#1C1917] rounded-lg text-xs font-semibold font-hindi flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#9A6B1F]" />
                      <span>कॉल करें</span>
                    </a>

                    <a
                      href={`https://wa.me/91${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`नमस्ते ${order.customer_name} जी! सेठ सांवरिया कलेक्शन से आपके ऑर्डर #${order.id} के संदर्भ में संपर्क कर रहे हैं।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-lg text-xs font-bold font-hindi flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp पर ग्राहक को मैसेज भेजें</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: HOMEPAGE BANNERS
         ========================================================================= */}
      {currentTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold font-hindi text-[#1C1917]">
              मुख्य होमपेज बैनर ({banners.length})
            </h3>
            <button
              onClick={() => {
                setIsCreatingBanner(true);
                setEditingBanner({
                  id: `banner-${Date.now()}`,
                  title_hi: 'शाही विरासत एवं उत्सव कलेक्शन',
                  subtitle_hi: 'विवाह और त्योहारों के लिए विशेष शेरवानी, कुर्ते व सिल्क साड़ियों की नई श्रृंखला',
                  badge_hi: 'विशेष नया स्टॉक',
                  image_url: '/images/hero_festive_ethnic_1792914844440.jpg',
                  button_text_hi: 'कलेक्शन देखें',
                  button_link: '/products',
                  display_order: banners.length + 1,
                  is_active: true
                });
              }}
              className="px-4 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-bold font-hindi flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E2B158]" />
              <span>नया बैनर जोड़ें</span>
            </button>
          </div>

          {/* Banner Edit / Create Modal */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
                  <h3 className="text-base font-bold font-hindi text-[#1C1917]">
                    {isCreatingBanner ? 'नया बैनर जोड़ें' : 'बैनर संपादित करें'}
                  </h3>
                  <button
                    onClick={() => { setEditingBanner(null); setIsCreatingBanner(false); }}
                    className="p-1 text-[#44403C] hover:bg-[#FAF8F5] rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingBanner.title_hi.trim() || !editingBanner.image_url) {
                      alert("कृपया बैनर का शीर्षक और फोटो अवश्य प्रदान करें।");
                      return;
                    }
                    await saveBanner(editingBanner);
                    setEditingBanner(null);
                    setIsCreatingBanner(false);
                    showToast("बैनर सफलतापूर्वक सहेज लिया गया!");
                  }}
                  className="space-y-4 text-xs font-hindi"
                >
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      बैनर शीर्षक (हिंदी में) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title_hi}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title_hi: e.target.value })}
                      placeholder="उदा. शाही विरासत एवं उत्सव कलेक्शन"
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      उपशीर्षक (हिंदी में)
                    </label>
                    <input
                      type="text"
                      value={editingBanner.subtitle_hi}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle_hi: e.target.value })}
                      placeholder="विवाह और त्योहारों के लिए विशेष श्रृंखला"
                      className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        बैज टेक्स्ट
                      </label>
                      <input
                        type="text"
                        value={editingBanner.badge_hi || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, badge_hi: e.target.value })}
                        placeholder="विशेष नया स्टॉक"
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        बटन टेक्स्ट
                      </label>
                      <input
                        type="text"
                        value={editingBanner.button_text_hi}
                        onChange={(e) => setEditingBanner({ ...editingBanner, button_text_hi: e.target.value })}
                        placeholder="कलेक्शन देखें"
                        className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      बैनर फोटो (URL, डायरेक्ट अपलोड या गैलरी से चुनें) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        required
                        value={editingBanner.image_url}
                        onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                        placeholder="छवि URL दर्ज करें"
                        className="flex-1 min-w-[200px] px-3 py-2 border border-[#D5C7B8] rounded-lg text-xs"
                      />
                      <label className="px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B8] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                        {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#9A6B1F]" />}
                        <span>फोटो अपलोड</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIsUploadingImage(true);
                              try {
                                const url = await uploadProductImage(file);
                                setEditingBanner(prev => prev ? { ...prev, image_url: url } : null);
                                showToast("बैनर फोटो अपलोड हो गई!");
                              } catch (err: any) {
                                alert(err.message || "अपलोड विफल");
                              } finally {
                                setIsUploadingImage(false);
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('banner')}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#9A6B1F]" />
                        <span>📸 गैलरी से चुनें</span>
                      </button>
                    </div>

                    {editingBanner.image_url && (
                      <div className="mt-2 w-full max-w-xs aspect-16/9 rounded-lg overflow-hidden border border-[#D5C7B8] bg-[#F5EFEB]">
                        <img 
                          src={resolveImageUrl(editingBanner.image_url)} 
                          alt="Banner preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="banner_active"
                      checked={editingBanner.is_active}
                      onChange={(e) => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                    />
                    <label htmlFor="banner_active" className="cursor-pointer font-semibold">
                      बैनर को होमपेज पर सक्रिय रखें (Visible)
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-[#E8DFD5]">
                    <button
                      type="button"
                      onClick={() => { setEditingBanner(null); setIsCreatingBanner(false); }}
                      className="px-4 py-2 border border-[#D5C7B8] rounded-lg font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg font-bold"
                    >
                      सहेजें
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-[#E8DFD5] p-4 flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={resolveImageUrl(b.image_url)} 
                  alt={b.title_hi} 
                  className="w-full sm:w-44 aspect-16/9 object-cover rounded-lg bg-[#FAF8F5]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                  }}
                />
                <div className="flex-1 space-y-1 text-xs font-hindi">
                  <span className="text-[11px] font-bold text-[#E2B158]">{b.badge_hi}</span>
                  <h4 className="text-base font-bold text-[#1C1917]">{b.title_hi}</h4>
                  <p className="text-[#786C5E]">{b.subtitle_hi}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingBanner(b); setIsCreatingBanner(false); }}
                    className="p-2 border rounded-lg text-xs hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("क्या आप यह बैनर हटाना चाहते हैं?")) {
                        await deleteBanner(b.id);
                        showToast("बैनर हटाया गया");
                      }
                    }}
                    className="p-2 border border-red-200 text-red-600 rounded-lg text-xs hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: STORE SETTINGS (OFFICIAL DETAILS & OPENING HOURS)
         ========================================================================= */}
      {currentTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-hindi text-[#1C1917]">
              आधिकारिक स्टोर सेटिंग्स (Official Store Configuration)
            </h3>
            <p className="text-xs text-[#786C5E] font-hindi mt-0.5">
              यहाँ से दुकान का नाम, फ़ोन, WhatsApp, समय, गूगल मैप्स और सोशल मीडिया लिंक्स प्रबंधित करें।
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await saveSettings(tempSettings);
              showToast("स्टोर सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गईं!");
            }}
            className="space-y-4 text-xs font-hindi"
          >
            {/* Store Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  दुकान का नाम (हिंदी) *
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.store_name_hi}
                  onChange={(e) => setTempSettings({ ...tempSettings, store_name_hi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  दुकान का नाम (English) *
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.store_name}
                  onChange={(e) => setTempSettings({ ...tempSettings, store_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-sans"
                />
              </div>
            </div>

            {/* Official Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5]">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#9A6B1F]" />
                  <span>आधिकारिक कॉलिंग नंबर (+91 8529095431) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={tempSettings.phone_number}
                  onChange={(e) => setTempSettings({ ...tempSettings, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>आधिकारिक WhatsApp नंबर (+91 8529095431) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={tempSettings.whatsapp_number}
                  onChange={(e) => setTempSettings({ ...tempSettings, whatsapp_number: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5C7B8] rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Opening Hours & Automatic Status Setting (Section 5) */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9A6B1F]" />
                <strong className="text-sm text-[#1C1917]">दुकान खुलने का समय एवं स्थिति नियंत्रण</strong>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">खुलने का समय (IST, 24 घंटे प्रारूप)</label>
                  <input
                    type="time"
                    value={tempSettings.opening_time || "08:00"}
                    onChange={(e) => setTempSettings({ ...tempSettings, opening_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-[#786C5E] mt-0.5 block">सुबह 8:00 AM (08:00)</span>
                </div>

                <div>
                  <label className="block font-semibold mb-1">बंद होने का समय (IST, 24 घंटे प्रारूप)</label>
                  <input
                    type="time"
                    value={tempSettings.closing_time || "22:00"}
                    onChange={(e) => setTempSettings({ ...tempSettings, closing_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-[#786C5E] mt-0.5 block">रात 10:00 PM (22:00)</span>
                </div>

                <div>
                  <label className="block font-semibold mb-1">विशेष अवकाश पर बंद रखें?</label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSettings.is_exceptional_closure || false}
                        onChange={(e) => setTempSettings({ ...tempSettings, is_exceptional_closure: e.target.checked })}
                      />
                      <span className="font-semibold text-red-700">आज विशेष रूप से बंद</span>
                    </label>
                  </div>
                </div>
              </div>

              {tempSettings.is_exceptional_closure && (
                <div>
                  <label className="block font-semibold mb-1 text-red-700">बंद रखने का कारण (ग्राहकों को दिखेगा)</label>
                  <input
                    type="text"
                    value={tempSettings.exceptional_closure_reason || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, exceptional_closure_reason: e.target.value })}
                    placeholder="उदा. दीवाली विशेष अवकाश के कारण आज दुकान बंद है"
                    className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white"
                  />
                </div>
              )}
            </div>

            {/* Google Maps and Social Links (Section 1 of prompt) */}
            <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5]">
              <strong className="text-sm text-[#1C1917] block">आधिकारिक मैप एवं सोशल मीडिया लिंक्स</strong>

              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1.5">
                  <span>गूगल मैप्स लिंक (Google Maps Location)</span>
                </label>
                <input
                  type="url"
                  value={tempSettings.google_maps_url}
                  onChange={(e) => setTempSettings({ ...tempSettings, google_maps_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1 text-[#E1306C]">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type="url"
                    value={tempSettings.instagram_url || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, instagram_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1 text-[#1877F2]">
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="url"
                    value={tempSettings.facebook_url || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, facebook_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1 text-[#FF0000]">
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube URL</span>
                  </label>
                  <input
                    type="url"
                    value={tempSettings.youtube_url || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, youtube_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">दुकान का पता *</label>
              <textarea
                rows={2}
                required
                value={tempSettings.address_hi}
                onChange={(e) => setTempSettings({ ...tempSettings, address_hi: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold font-hindi text-sm shadow-xs cursor-pointer"
              >
                सेटिंग्स सुरक्षित करें (Save Store Settings)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 7: SUPABASE DATABASE & REALTIME
         ========================================================================= */}
      {currentTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] flex items-center justify-center text-[#9A6B1F]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-hindi text-[#1C1917]">
                Supabase PostgreSQL, Storage एवं Realtime
              </h3>
              <p className="text-xs text-[#786C5E] font-hindi">
                लाइव डेटाबेस, क्लाउड स्टोरेज बकेट और ऑटो-रिएक्टिव रियल-टाइम सिंक।
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] flex items-center justify-between text-xs font-hindi">
            <div>
              <span className="text-[#786C5E] block">वर्तमान डेटाबेस स्थिति:</span>
              <span className={`font-bold text-sm ${supabaseConnected ? 'text-emerald-700' : 'text-amber-800'}`}>
                {supabaseConnected 
                  ? '✓ Supabase PostgreSQL से सीधे कनेक्टेड है (Realtime Active)' 
                  : 'स्थानीय ब्राउज़र स्टोरेज मोड (Local Persistent Storage Mode)'}
              </span>
            </div>

            <button
              onClick={() => {
                const config = getSupabaseConfig();
                if (config.isConfigured) {
                  refreshData();
                  setTestResult("कनेक्शन जाँचा गया! यदि क्रेडेंशियल सही हैं तो डेटा लोड हो गया।");
                } else {
                  setTestResult("Supabase URL और Anon Key दर्ज नहीं हैं। स्थानीय मोड सक्रिय है।");
                }
              }}
              className="px-3.5 py-2 bg-white border border-[#D5C7B8] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg font-semibold cursor-pointer"
            >
              कनेक्शन टेस्ट करें
            </button>
          </div>

          {testResult && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-xs font-hindi">
              {testResult}
            </div>
          )}

          <div className="space-y-4 text-xs font-hindi">
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={customSupabaseUrl}
                onChange={(e) => setCustomSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={customSupabaseAnonKey}
                onChange={(e) => setCustomSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('sanwariya_supabase_url', customSupabaseUrl.trim());
                  localStorage.setItem('sanwariya_supabase_anon_key', customSupabaseAnonKey.trim());
                  resetSupabaseClient();
                  refreshData();
                  showToast("Supabase क्रेडेंशियल सुरक्षित कर दिए गए!");
                }}
                className="px-5 py-2.5 bg-[#1C1917] text-white rounded-lg font-bold cursor-pointer"
              >
                क्रेडेंशियल सेव करें व कनेक्ट करें
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('sanwariya_supabase_url');
                  localStorage.removeItem('sanwariya_supabase_anon_key');
                  setCustomSupabaseUrl('');
                  setCustomSupabaseAnonKey('');
                  resetSupabaseClient();
                  showToast("Supabase क्रेडेंशियल रीसेट किए गए!");
                }}
                className="px-4 py-2.5 border border-[#D5C7B8] rounded-lg font-semibold cursor-pointer"
              >
                क्रेडेंशियल हटाएं
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8DFD5] space-y-3 text-xs font-hindi">
            <h4 className="font-bold text-sm text-[#1C1917]">Supabase SQL माइग्रेशन स्क्रिप्ट:</h4>
            <p className="text-[#57534E] leading-relaxed">
              प्रोजेक्ट में <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">/supabase/schema.sql</code> तैयार है। इसमें <code className="font-mono">product-images</code> स्टोरेज बकेट, सभी टेबल्स, फॉरेन कीज और RLS सिक्योरिटी नीतियां उपलब्ध हैं।
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm("क्या आप प्रारंभिक डेमो कैटलॉग डेटा पर रीसेट करना चाहते हैं?")) {
                    resetToDemoData();
                    showToast("डेमो डेटा सफलतापूर्वक रीस्टोर कर दिया गया!");
                  }
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold font-hindi cursor-pointer"
              >
                प्रारंभिक डेमो डेटा पर रीसेट करें (Reset to Initial Seed)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GLOBAL MODAL: SELECT IMAGE FROM MEDIA GALLERY
         ========================================================================= */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#9A6B1F]" />
                <h3 className="text-base font-bold font-hindi text-[#1C1917]">
                  मीडिया गैलरी से फोटो चुनें (1-क्लिक चयन)
                </h3>
              </div>
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="p-1 text-[#44403C] hover:bg-[#FAF8F5] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#786C5E] font-hindi">
              किसी भी फ़ोटो पर क्लिक करें, वह तुरंत आपके चुने हुए {mediaPickerTarget === 'product_main' ? 'कपड़े' : mediaPickerTarget === 'category' ? 'श्रेणी' : 'बैनर'} में सेट हो जाएगी।
            </p>

            {mediaItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#786C5E] font-hindi border border-dashed border-[#D5C7B8] rounded-xl">
                अभी कोई मीडिया फ़ोटो उपलब्ध नहीं है। कृपया पहले मीडिया टैब से फ़ोटो अपलोड करें।
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
                {mediaItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (mediaPickerTarget === 'product_main') {
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          main_image: item.url,
                          images: [item.url, ...(prev.images || []).filter(x => x !== item.url)]
                        } : null);
                      } else if (mediaPickerTarget === 'category') {
                        setEditingCategory(prev => prev ? { ...prev, image_url: item.url } : null);
                      } else if (mediaPickerTarget === 'banner') {
                        setEditingBanner(prev => prev ? { ...prev, image_url: item.url } : null);
                      }
                      setMediaPickerTarget(null);
                      showToast("फोटो चुन ली गई!");
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#9A6B1F] focus:border-[#9A6B1F] bg-[#FAF8F5] transition-all cursor-pointer text-left shadow-xs"
                  >
                    <img
                      src={resolveImageUrl(item.url)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                      <p className="text-[11px] font-hindi font-bold truncate">{item.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#E8DFD5] flex justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-2 border border-[#D5C7B8] rounded-lg text-xs font-semibold font-hindi cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
