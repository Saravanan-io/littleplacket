import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';
import { ref as rtdbRef, set as setRtdb, remove as removeRtdb, get as getRtdb } from 'firebase/database';
import { db, rtdb, storage } from '../config/firebase';
import { Product } from '../types';

/**
 * Upload compressed image directly to Firebase Storage bucket (little-placket.firebasestorage.app)
 */
export async function uploadToFirebaseStorage(
  file: File
): Promise<{ url: string; storagePath: string; publicId: string }> {
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileRef = storageRef(storage, `outfits/${filename}`);

  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    storagePath: snapshot.ref.fullPath,
    publicId: filename,
  };
}

/**
 * Delete individual image file directly from Firebase Storage bucket
 */
export async function deleteFromFirebaseStorage(
  imagePathOrUrl: string
): Promise<void> {
  if (!imagePathOrUrl) return;

  try {
    let targetPath = imagePathOrUrl;

    // Extract path if full Firebase Storage URL is provided
    if (imagePathOrUrl.includes('firebasestorage.googleapis.com')) {
      const decodedUrl = decodeURIComponent(imagePathOrUrl);
      const match = decodedUrl.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        targetPath = match[1];
      }
    }

    if (!targetPath.startsWith('outfits/') && !targetPath.includes('/')) {
      targetPath = `outfits/${targetPath}`;
    }

    const fileRef = storageRef(storage, targetPath);
    await deleteObject(fileRef);
    console.log(`✓ Image deleted from Firebase Storage: ${targetPath}`);
  } catch (err: any) {
    console.warn(`Firebase Storage delete warning (${imagePathOrUrl}):`, err.message || err);
  }
}

/**
 * Sync product to both Firestore and Realtime Database
 */
export async function syncProductToFirebase(product: Product): Promise<void> {
  const productId = product.id || `prod_${Date.now()}`;
  const cleanProduct: any = {
    ...product,
    id: productId,
    updatedAt: new Date().toISOString(),
  };

  // Remove unwanted fields: colors, featured, sizes
  delete cleanProduct.colors;
  delete cleanProduct.featured;
  delete cleanProduct.sizes;

  // 1. Sync to Firestore
  const docRef = doc(db, 'products', productId);
  await setDoc(docRef, cleanProduct);

  // 2. Sync to Realtime Database
  const dbRef = rtdbRef(rtdb, `products/${productId}`);
  await setRtdb(dbRef, cleanProduct);
}


/**
 * Delete product and all its images from Firebase Storage, Firestore, and Realtime Database
 */
export async function deleteProductFromFirebase(
  productId: string,
  images?: Array<{ url?: string; publicId?: string; storagePath?: string }>
): Promise<void> {
  // 1. Delete associated outfit images from Firebase Storage bucket
  try {
    let imgsToDelete = images || [];
    if (!imgsToDelete.length) {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        const pData = docSnap.data();
        imgsToDelete = pData.images || [];
      }
    }
    for (const img of imgsToDelete) {
      const pathOrUrl = (img as any).storagePath || img.url || img.publicId;
      if (pathOrUrl) {
        await deleteFromFirebaseStorage(pathOrUrl);
      }
    }
  } catch (imgErr) {
    console.warn('Firebase Storage product image deletion warning:', imgErr);
  }

  // 2. Delete from Firestore
  await deleteDoc(doc(db, 'products', productId));

  // 3. Delete from Realtime Database
  await removeRtdb(rtdbRef(rtdb, `products/${productId}`));
}

/**
 * Sync business settings to Firestore and Realtime Database
 */
export async function syncSettingsToFirebase(settingsData: any): Promise<void> {
  const cleanSettings = {
    ...settingsData,
    updatedAt: new Date().toISOString(),
  };

  // 1. Sync to Firestore settings/business
  const docRef = doc(db, 'settings', 'business');
  await setDoc(docRef, cleanSettings, { merge: true });

  // 2. Sync to Realtime Database settings/business
  const dbRef = rtdbRef(rtdb, 'settings/business');
  await setRtdb(dbRef, cleanSettings);
}

/**
 * Ensure Admin Credentials are stored on Firebase Firestore & Realtime Database
 */
export async function syncAdminToFirebase(): Promise<void> {
  const adminData = {
    id: 'admin_main',
    email: 'admin@littleplacket.com',
    password: 'Admin@123',
    name: 'Little Placket Admin',
    role: 'superadmin',
    updatedAt: new Date().toISOString(),
  };

  try {
    // 1. Sync to Firestore admins/admin_main
    const docRef = doc(db, 'admins', 'admin_main');
    await setDoc(docRef, adminData, { merge: true });

    // 2. Sync to Realtime Database admins/admin_main
    const dbRef = rtdbRef(rtdb, 'admins/admin_main');
    await setRtdb(dbRef, adminData);
  } catch (err) {
    console.warn('Firebase admin sync warning:', err);
  }
}

/**
 * Verify Admin Login credentials directly against Firebase Firestore & RTDB
 */
export async function verifyFirebaseAdmin(email: string, password: string): Promise<{ success: boolean; admin: any }> {
  // Ensure Firebase contains the admin record
  await syncAdminToFirebase();

  // 1. Try Firestore verification
  try {
    const docRef = doc(db, 'admins', 'admin_main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.email.toLowerCase() === email.toLowerCase() && data.password === password) {
        return {
          success: true,
          admin: {
            id: data.id || 'admin_main',
            email: data.email,
            name: data.name || 'Little Placket Admin',
            role: data.role || 'superadmin',
          },
        };
      }
    }
  } catch (fsErr) {
    console.warn('Firestore admin verification fallback:', fsErr);
  }

  // 2. Try Realtime Database verification
  try {
    const dbRef = rtdbRef(rtdb, 'admins/admin_main');
    const snapshot = await getRtdb(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.email.toLowerCase() === email.toLowerCase() && data.password === password) {
        return {
          success: true,
          admin: {
            id: data.id || 'admin_main',
            email: data.email,
            name: data.name || 'Little Placket Admin',
            role: data.role || 'superadmin',
          },
        };
      }
    }
  } catch (rtdbErr) {
    console.warn('RTDB admin verification fallback:', rtdbErr);
  }

  throw new Error('Invalid email or password');
}

// Automatically sync admin credentials to Firebase when service is loaded
syncAdminToFirebase().catch(() => {});

