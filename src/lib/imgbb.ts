import { uploadImageToFirebase } from "./firebase";

// Official ImgBB API Configuration provided for SETH SANWARIYA COLLECTION
export const IMGBB_CONFIG = {
  apiKey: "e59a26a8f78e44890f1889f172a629e3",
  uploadUrl: "https://api.imgbb.com/1/upload"
};

export interface ImgBBUploadResult {
  url: string;
  display_url: string;
  delete_url?: string;
  thumb_url?: string;
  name: string;
  size?: number;
  source: 'imgbb' | 'firebase' | 'local';
}

/**
 * Upload an image file or base64 to ImgBB with automatic fallback to Firebase Storage.
 */
export async function uploadToImgBB(file: File | Blob, customName?: string): Promise<ImgBBUploadResult> {
  const fileName = customName || (file instanceof File ? file.name : `sanwariya_image_${Date.now()}.jpg`);
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  // 1. Attempt upload to ImgBB API
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", cleanName);

    const endpoint = `${IMGBB_CONFIG.uploadUrl}?key=${IMGBB_CONFIG.apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return {
          url: data.data.url,
          display_url: data.data.display_url || data.data.url,
          delete_url: data.data.delete_url,
          thumb_url: data.data.thumb?.url,
          name: cleanName,
          size: data.data.size ? Number(data.data.size) : (file.size || undefined),
          source: 'imgbb'
        };
      }
    } else {
      const errorText = await response.text();
      console.warn("ImgBB API returned non-OK status, falling back to Firebase Storage:", response.status, errorText);
    }
  } catch (imgbbErr) {
    console.warn("ImgBB API request failed, falling back to Firebase Storage:", imgbbErr);
  }

  // 2. Fallback to Firebase Storage bucket (seth-sanwariya-collection.firebasestorage.app)
  try {
    if (file instanceof File) {
      const firebaseUrl = await uploadImageToFirebase(file, "uploads");
      if (firebaseUrl) {
        return {
          url: firebaseUrl,
          display_url: firebaseUrl,
          name: cleanName,
          size: file.size,
          source: 'firebase'
        };
      }
    }
  } catch (fbErr) {
    console.warn("Firebase Storage fallback also failed, using base64 data URL:", fbErr);
  }

  // 3. Fallback to Base64 Data URL (zero network failure mode)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        resolve({
          url: base64Url,
          display_url: base64Url,
          name: cleanName,
          size: file.size,
          source: 'local'
        });
      } else {
        reject(new Error("छवि पढ़ने में विफल"));
      }
    };
    reader.onerror = () => reject(new Error("छवि लोड करने में त्रुटि"));
    reader.readAsDataURL(file);
  });
}
