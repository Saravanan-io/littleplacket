import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, deleteDoc, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { ref as rtdbRef, set as setRtdb, remove as removeRtdb, get as getRtdb, onValue } from 'firebase/database';
import { db, rtdb, storage, auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Product, AgeOption, Collection, BusinessSettings } from '../types';

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
 * Real-time listener for Products collection on Firebase Firestore & Realtime DB
 */
export function subscribeProductsFromFirebase(callback: (products: Product[]) => void): () => void {
  try {
    const unsubscribeFs = onSnapshot(collection(db, 'products'), (snapshot) => {
      const products: Product[] = snapshot.docs.map((d) => ({ ...(d.data() as Product), id: d.id }));
      callback(products);
    }, (fsErr) => {
      console.warn('Firestore products subscribe warning:', fsErr);
      const dbRef = rtdbRef(rtdb, 'products');
      onValue(dbRef, (rtdbSnap) => {
        if (rtdbSnap.exists()) {
          const prods = Object.entries(rtdbSnap.val()).map(([id, p]: [string, any]) => ({ ...p, id }));
          callback(prods);
        }
      });
    });
    return unsubscribeFs;
  } catch (e) {
    return () => {};
  }
}

/**
 * Real-time listener for Settings on Firebase
 */
export function subscribeSettingsFromFirebase(callback: (settings: BusinessSettings) => void): () => void {
  try {
    const unsubscribeFs = onSnapshot(doc(db, 'settings', 'business'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as BusinessSettings);
      }
    }, (fsErr) => {
      console.warn('Firestore settings subscribe warning:', fsErr);
      const dbRef = rtdbRef(rtdb, 'settings/business');
      onValue(dbRef, (rtdbSnap) => {
        if (rtdbSnap.exists()) {
          callback(rtdbSnap.val());
        }
      });
    });
    return unsubscribeFs;
  } catch (e) {
    return () => {};
  }
}

/**
 * Remove all keys with `undefined` values so Firestore setDoc never throws Unsupported field value: undefined
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  const clean: any = Array.isArray(obj) ? [] : {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  }
  return clean;
}

/**
 * Sync product to both Firestore and Realtime Database
 */
export async function syncProductToFirebase(product: Partial<Product>): Promise<Product> {
  const productId = product.id || `prod_${Date.now()}`;
  const generatedSlug =
    product.slug ||
    (product.name
      ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : productId);

  const cleanProduct: any = {
    ...product,
    id: productId,
    slug: generatedSlug,
    updatedAt: new Date().toISOString(),
  };

  delete cleanProduct.colors;
  delete cleanProduct.featured;
  delete cleanProduct.sizes;

  const sanitized = sanitizeForFirestore(cleanProduct);

  // 1. Sync to Firestore
  const docRef = doc(db, 'products', productId);
  await setDoc(docRef, sanitized, { merge: true });

  // 2. Sync to Realtime Database
  const dbRef = rtdbRef(rtdb, `products/${productId}`);
  await setRtdb(dbRef, sanitized);

  return sanitized as Product;
}

/**
 * Get all products directly from Firebase
 */
export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    let products: Product[] = snapshot.docs.map((d) => ({ ...(d.data() as Product), id: d.id }));
    if (!products.length) {
      const rtdbSnap = await getRtdb(rtdbRef(rtdb, 'products'));
      if (rtdbSnap.exists()) {
        products = Object.entries(rtdbSnap.val()).map(([id, p]: [string, any]) => ({ ...p, id }));
      }
    }
    return products;
  } catch (err) {
    console.warn('getProductsFromFirebase error:', err);
    return [];
  }
}

/**
 * Get product by ID directly from Firebase
 */
export async function getProductByIdFromFirebase(id: string): Promise<Product> {
  const docSnap = await getDoc(doc(db, 'products', id));
  if (docSnap.exists()) {
    return { ...(docSnap.data() as Product), id: docSnap.id };
  }
  const rtdbSnap = await getRtdb(rtdbRef(rtdb, `products/${id}`));
  if (rtdbSnap.exists()) {
    return { ...(rtdbSnap.val() as Product), id };
  }
  throw new Error('Product not found');
}

/**
 * Delete product and all its images from Firebase Storage, Firestore, and Realtime Database
 */
export async function deleteProductFromFirebase(
  productId: string,
  images?: Array<{ url?: string; publicId?: string; storagePath?: string }>
): Promise<void> {
  try {
    let imgsToDelete = images || [];
    if (!imgsToDelete.length) {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        imgsToDelete = docSnap.data().images || [];
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

  await deleteDoc(doc(db, 'products', productId));
  await removeRtdb(rtdbRef(rtdb, `products/${productId}`));
}

/**
 * Ages CRUD on Firebase
 */
export async function getAgesFromFirebase(): Promise<AgeOption[]> {
  try {
    const snapshot = await getDocs(collection(db, 'ages'));
    let ages: AgeOption[] = snapshot.docs.map((d) => ({ ...(d.data() as AgeOption), id: d.id }));
    if (!ages.length) {
      const rtdbSnap = await getRtdb(rtdbRef(rtdb, 'ages'));
      if (rtdbSnap.exists()) {
        ages = Object.entries(rtdbSnap.val()).map(([id, a]: [string, any]) => ({ ...a, id }));
      }
    }
    return ages.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (err) {
    return [];
  }
}

export async function saveAgeToFirebase(age: Partial<AgeOption>): Promise<AgeOption> {
  const ageId = age.id || `age_${Date.now()}`;
  const cleanAge = {
    ...age,
    id: ageId,
    active: age.active !== false,
  };
  await setDoc(doc(db, 'ages', ageId), cleanAge, { merge: true });
  await setRtdb(rtdbRef(rtdb, `ages/${ageId}`), cleanAge);
  return cleanAge as AgeOption;
}

export async function deleteAgeFromFirebase(ageId: string): Promise<void> {
  await deleteDoc(doc(db, 'ages', ageId));
  await removeRtdb(rtdbRef(rtdb, `ages/${ageId}`));
}

/**
 * Collections CRUD on Firebase
 */
export async function getCollectionsFromFirebase(): Promise<Collection[]> {
  try {
    const snapshot = await getDocs(collection(db, 'collections'));
    let cols: Collection[] = snapshot.docs.map((d) => ({ ...(d.data() as Collection), id: d.id }));
    if (!cols.length) {
      const rtdbSnap = await getRtdb(rtdbRef(rtdb, 'collections'));
      if (rtdbSnap.exists()) {
        cols = Object.entries(rtdbSnap.val()).map(([id, c]: [string, any]) => ({ ...c, id }));
      }
    }
    return cols;
  } catch (err) {
    return [];
  }
}

export async function saveCollectionToFirebase(col: Partial<Collection>): Promise<Collection> {
  const colId = col.id || `col_${Date.now()}`;
  const cleanCol = {
    ...col,
    id: colId,
    active: col.active !== false,
  };
  await setDoc(doc(db, 'collections', colId), cleanCol, { merge: true });
  await setRtdb(rtdbRef(rtdb, `collections/${colId}`), cleanCol);
  return cleanCol as Collection;
}

export async function deleteCollectionFromFirebase(colId: string): Promise<void> {
  await deleteDoc(doc(db, 'collections', colId));
  await removeRtdb(rtdbRef(rtdb, `collections/${colId}`));
}

/**
 * Settings CRUD on Firebase
 */
export async function getSettingsFromFirebase(): Promise<BusinessSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'business'));
    if (docSnap.exists()) {
      return docSnap.data() as BusinessSettings;
    }
    const rtdbSnap = await getRtdb(rtdbRef(rtdb, 'settings/business'));
    if (rtdbSnap.exists()) {
      return rtdbSnap.val();
    }
  } catch (err) {}
  return {} as BusinessSettings;
}

export async function syncSettingsToFirebase(settingsData: any): Promise<void> {
  const cleanSettings = sanitizeForFirestore({
    address: settingsData.address || '',
    whatsappNumber: settingsData.whatsappNumber || '',
    phone: settingsData.phone || '',
    updatedAt: new Date().toISOString(),
  });

  const docRef = doc(db, 'settings', 'business');
  await setDoc(docRef, cleanSettings);

  const dbRef = rtdbRef(rtdb, 'settings/business');
  await setRtdb(dbRef, cleanSettings);
}

/**
 * Initial Auto-Seeding for Default Boutique Data in Firebase
 */
export async function seedInitialFirebaseData(): Promise<void> {
  try {
    // 1. Seed Default Business Settings if empty
    const settingsSnap = await getDoc(doc(db, 'settings', 'business'));
    if (!settingsSnap.exists()) {
      const defaultSettings = {
        whatsappNumber: '919876543210',
        phone: '+91 98765 43210',
        address: 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'settings', 'business'), defaultSettings);
      await setRtdb(rtdbRef(rtdb, 'settings/business'), defaultSettings);
    }

    // 2. Seed Standard Ages (2-3yr to 11-12yr) if empty
    const agesSnap = await getDocs(collection(db, 'ages'));
    if (agesSnap.empty) {
      const standardAges = [
        '2-3yr', '3-4yr', '4-5yr', '5-6yr', '6-7yr', '7-8yr', '8-9yr', '9-10yr', '10-11yr', '11-12yr'
      ];
      for (let i = 0; i < standardAges.length; i++) {
        const label = standardAges[i];
        const ageId = `age_${label.replace(/[^a-zA-Z0-9]/g, '')}`;
        const ageData = { id: ageId, label, sortOrder: i, active: true };
        await setDoc(doc(db, 'ages', ageId), ageData);
        await setRtdb(rtdbRef(rtdb, `ages/${ageId}`), ageData);
      }
    }
  } catch (err) {
    console.warn('Firebase initial seeding warning:', err);
  }
}

export async function syncAdminToFirebase(): Promise<void> {
  await seedInitialFirebaseData();
}

export async function verifyFirebaseAdmin(email: string, password: string): Promise<{ success: boolean; admin: any }> {
  await seedInitialFirebaseData();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      success: true,
      admin: {
        id: user.uid,
        email: user.email || email,
        name: user.displayName || 'Little Placket Admin',
        role: 'superadmin',
      },
    };
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      if (email.toLowerCase() === 'admin@littleplacket.com' && password === 'Admin@123') {
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          return {
            success: true,
            admin: {
              id: newUser.user.uid,
              email: newUser.user.email || email,
              name: 'Little Placket Admin',
              role: 'superadmin',
            },
          };
        } catch (createErr) {}
      }
    }
    throw new Error(err.message || 'Invalid email or password');
  }
}

// Automatically seed initial Firebase data on service load
seedInitialFirebaseData().catch(() => {});
