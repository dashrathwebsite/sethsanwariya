# SETH SANWARIYA COLLECTION (सेठ सांवरिया कलेक्शन)
### Premium Hindi-First Indian Fashion E-Commerce Website + Live Supabase Database + Powerful Admin Panel

**SETH SANWARIYA COLLECTION** is a production-ready, mobile-first Indian clothing retail web application built for customers who prefer simple, natural Hindi. Features include live Asia/Kolkata store hours ("अभी दुकान खुली है / अभी दुकान बंद है"), 1-tap WhatsApp message review & ordering, full shopping cart with Cash on Delivery (COD) inquiry, official social media integrations, and a secure administrator dashboard with persistent image upload to Supabase Storage.

---

## 🏬 Official Store Details

- **Store Name:** SETH SANWARIYA COLLECTION (सेठ सांवरिया कलेक्शन)
- **Phone:** `+91 8529095431` (tel link: `tel:+918529095431`)
- **WhatsApp:** `+91 8529095431` (`https://wa.me/918529095431`)
- **Official Opening Hours:**  
  **दुकान खुलने का समय**  
  सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक  
  **सप्ताह के सभी 7 दिन खुली रहती है।**
- **Google Maps Location:** [https://maps.app.goo.gl/NQzTTJeZxeSj55bj8](https://maps.app.goo.gl/NQzTTJeZxeSj55bj8)
- **Facebook:** [https://www.facebook.com/p/Seth-Sanwariya-61584605940951/](https://www.facebook.com/p/Seth-Sanwariya-61584605940951/)
- **Instagram:** [https://www.instagram.com/seth_sanwariya_collection_/](https://www.instagram.com/seth_sanwariya_collection_/)
- **YouTube:** [https://www.youtube.com/@seth_sanwariya_collection](https://www.youtube.com/@seth_sanwariya_collection)

---

## 🌟 Key Features

1. **Automatic Live Shop Open/Closed Indicator (Asia/Kolkata)**:
   - Dynamic time-zone calculation without hardcoding.
   - Shows **"अभी दुकान खुली है"** from 8:00 AM until 10:00 PM IST.
   - Shows **"अभी दुकान बंद है"** outside these hours or when exceptional closure is configured.
   - Automatically recalculates in real-time every 30 seconds.

2. **WhatsApp Order & Message Review Flow (Section 6 Compliance)**:
   - Formatted Hindi message:
     ```
     नमस्ते, मुझे आपके इस प्रोडक्ट के बारे में जानकारी चाहिए।

     प्रोडक्ट: [Product Name]  
     कीमत: ₹[Actual Price]  
     साइज: [Selected Size]  
     रंग: [Selected Color]  
     मात्रा: [Selected Quantity]  
     प्रोडक्ट लिंक: [Product URL]

     कृपया उपलब्धता और ऑर्डर की जानकारी दें।
     ```
   - **Interactive Review Modal**: Allows customers to review and customize the message before opening WhatsApp.
   - Transparent disclaimer: Clearly states that final availability and confirmation occur directly through the shop.

3. **Storefront & Merchandising**:
   - Clean, high-contrast Devanagari typography (`Noto Sans Devanagari`, `Plus Jakarta Sans`, `Cinzel`).
   - Dynamic Categories: Men's ethnic wear (कुर्ता, शेरवानी), Sarees (बनारसी सिल्क), Suits & Kurtis, and Kids wear.
   - Multi-image gallery with size and color selectors.
   - Search by Hindi name, English name, and SKU.
   - Filters by category, price ranges, and size tags.
   - Sorting by newest, price low-to-high, price high-to-low, and maximum discount.

4. **Shopping Cart & COD Inquiry**:
   - Slide-over cart drawer with quantity adjustments and free shipping progress bar.
   - Order Inquiry Modal supporting Cash on Delivery (COD) and WhatsApp confirmation with unique Order IDs (`SS-ORD-XXXX`).

5. **Powerful Admin Panel (`#admin`)**:
   - Protected login with Supabase Auth or secure master key.
   - Dashboard with **real database metrics** (total products, categories, available products, unavailable products, low-stock warnings, and recent orders) — zero fake statistics.
   - **Persistent Image Upload**: Uploads images directly to Supabase Storage bucket `product-images` (with local fallback).
   - Product CRUD: Edit prices, discounts, stock, variants, sizes, colors, and publish/unpublish toggles.
   - Category CRUD: Add, edit, reorder, delete safely.
   - Store Settings: Real-time configuration of phone, WhatsApp, opening hours, exceptional closures, Google Maps link, and social channels.

6. **Database & Realtime Replication**:
   - PostgreSQL schema with Row Level Security (RLS) in `/supabase/schema.sql`.
   - Real-time updates push live catalog and inventory changes to storefront sessions without manual refresh.

---

## 🚀 Local Development

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Starts at `http://localhost:3000`.

### 3. Build & Typecheck
```bash
npm run build
npm run lint
```

---

## 🗄️ Supabase Setup & First Administrator

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**, open `/supabase/schema.sql`, paste its content, and click **Run**.
3. Create the first admin:
   - In Supabase Dashboard, go to **Authentication** $\to$ **Users** $\to$ **Add User**.
   - Create an admin user with your email and a strong password.
4. Copy your project credentials from **Project Settings $\to$ API**:
   - `Project URL`
   - `anon public key`
5. Configure them in `.env`:
   ```bash
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```
   *Alternatively, configure them dynamically inside the `/admin` $\to$ **"Supabase डेटाबेस"** tab.*

---

## 🌐 Deployment Instructions

### Deploy to Netlify
1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

### Deploy to Vercel
1. Import your Git repository into Vercel.
2. Framework Preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables under Project Settings $\to$ Environment Variables.
