import { db, storage, firebaseStatus } from './config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Business, Category, Product, Order } from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from '../data/initialData';

const LOCAL_STORAGE_KEYS = {
  BUSINESSES: 'deknovacore_businesses',
  CATEGORIES: 'deknovacore_categories',
  PRODUCTS: 'deknovacore_products',
  ORDERS: 'deknovacore_orders',
};

// Local storage helper
function getLocalData<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export const DataService = {
  // Businesses
  async getBusinesses(): Promise<Business[]> {
    if (firebaseStatus.isConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Business);
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using local storage fallback:', err);
      }
    }
    return getLocalData<Business>(LOCAL_STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  },

  async saveBusiness(business: Business): Promise<void> {
    const list = await this.getBusinesses();
    const idx = list.findIndex((b) => b.id === business.id);
    let updated: Business[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = business;
    } else {
      updated = [business, ...list];
    }
    setLocalData(LOCAL_STORAGE_KEYS.BUSINESSES, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await setDoc(doc(db, 'businesses', business.id), business);
      } catch (err) {
        console.warn('Could not sync business to Firestore:', err);
      }
    }
  },

  async deleteBusiness(businessId: string): Promise<void> {
    const list = await this.getBusinesses();
    const updated = list.filter((b) => b.id !== businessId);
    setLocalData(LOCAL_STORAGE_KEYS.BUSINESSES, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await deleteDoc(doc(db, 'businesses', businessId));
      } catch (err) {
        console.warn('Could not delete business in Firestore:', err);
      }
    }
  },

  // Categories
  async getCategories(businessId?: string): Promise<Category[]> {
    let all: Category[] = [];
    if (firebaseStatus.isConfigured && db && businessId) {
      try {
        const snap = await getDocs(
          query(collection(db, `businesses/${businessId}/categories`))
        );
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Category);
        }
      } catch (err) {
        console.warn('Firestore category fetch fallback:', err);
      }
    }

    all = getLocalData<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return businessId ? all.filter((c) => c.businessId === businessId) : all;
  },

  async saveCategory(category: Category): Promise<void> {
    const list = getLocalData<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const idx = list.findIndex((c) => c.id === category.id);
    let updated: Category[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = category;
    } else {
      updated = [...list, category];
    }
    setLocalData(LOCAL_STORAGE_KEYS.CATEGORIES, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await setDoc(
          doc(db, `businesses/${category.businessId}/categories`, category.id),
          category
        );
      } catch (err) {
        console.warn('Error syncing category to Firestore:', err);
      }
    }
  },

  async deleteCategory(categoryId: string, businessId: string): Promise<void> {
    const list = getLocalData<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = list.filter((c) => c.id !== categoryId);
    setLocalData(LOCAL_STORAGE_KEYS.CATEGORIES, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await deleteDoc(doc(db, `businesses/${businessId}/categories`, categoryId));
      } catch (err) {
        console.warn('Error deleting category from Firestore:', err);
      }
    }
  },

  // Products
  async getProducts(businessId?: string): Promise<Product[]> {
    let all: Product[] = [];
    if (firebaseStatus.isConfigured && db && businessId) {
      try {
        const snap = await getDocs(
          query(collection(db, `businesses/${businessId}/products`))
        );
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Product);
        }
      } catch (err) {
        console.warn('Firestore product fetch fallback:', err);
      }
    }

    all = getLocalData<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return businessId ? all.filter((p) => p.businessId === businessId) : all;
  },

  async saveProduct(product: Product): Promise<void> {
    const list = getLocalData<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const idx = list.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = product;
    } else {
      updated = [product, ...list];
    }
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await setDoc(
          doc(db, `businesses/${product.businessId}/products`, product.id),
          product
        );
      } catch (err) {
        console.warn('Error syncing product to Firestore:', err);
      }
    }
  },

  async deleteProduct(productId: string, businessId: string): Promise<void> {
    const list = getLocalData<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = list.filter((p) => p.id !== productId);
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await deleteDoc(doc(db, `businesses/${businessId}/products`, productId));
      } catch (err) {
        console.warn('Error deleting product in Firestore:', err);
      }
    }
  },

  // Orders
  async getOrders(businessId?: string): Promise<Order[]> {
    let all = getLocalData<Order>(LOCAL_STORAGE_KEYS.ORDERS, [
      {
        id: 'ord-101',
        businessId: 'biz-1',
        customerName: 'Carolina Mendoza',
        customerPhone: '+507 6899-4321',
        items: [
          { productId: 'prod-101', productName: 'Pastel Red Velvet Supreme', quantity: 1, unitPrice: 32.0, subtotal: 32.0 },
          { productId: 'prod-104', productName: 'Caja de 6 Cupcakes Gourmet', quantity: 1, unitPrice: 15.0, subtotal: 15.0 },
        ],
        totalAmount: 47.0,
        status: 'completed',
        channel: 'whatsapp',
        notes: 'Desea dedicatoria: "Feliz Cumpleaños Mamá"',
        createdAt: '2026-03-20T14:20:00Z',
      },
      {
        id: 'ord-102',
        businessId: 'biz-2',
        customerName: 'Ricardo Méndez',
        customerPhone: '+507 6712-3456',
        items: [
          { productId: 'prod-201', productName: 'Hamburguesa Nova Trufada', quantity: 2, unitPrice: 13.5, subtotal: 27.0 },
          { productId: 'prod-204', productName: 'Limonada de Hierbabuena', quantity: 2, unitPrice: 4.5, subtotal: 9.0 },
        ],
        totalAmount: 36.0,
        status: 'pending',
        channel: 'whatsapp',
        notes: 'Papas con extra queso, por favor',
        createdAt: '2026-03-21T08:15:00Z',
      }
    ]);
    return businessId ? all.filter((o) => o.businessId === businessId) : all;
  },

  async saveOrder(order: Order): Promise<void> {
    const list = await this.getOrders();
    const updated = [order, ...list];
    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, updated);

    if (firebaseStatus.isConfigured && db) {
      try {
        await setDoc(doc(db, `businesses/${order.businessId}/orders`, order.id), order);
      } catch (err) {
        console.warn('Error saving order to Firestore:', err);
      }
    }
  },

  // Image Upload helper (Firebase Storage with base64 Data URL fallback)
  async uploadImage(file: File, path: string): Promise<string> {
    if (firebaseStatus.isConfigured && storage) {
      try {
        const fileRef = ref(storage, path);
        const snapshot = await uploadBytes(fileRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Firebase Storage upload failed, fallback to local URL:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Reset to initial demo data
  resetDemoData(): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
};
