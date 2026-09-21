import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Business, Category, Product, Order, TemplateType } from '../types';
import { DataService } from '../firebase/service';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';

interface BusinessContextType {
  businesses: Business[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  selectedBusinessId: string;
  activeBusiness: Business | null;
  isLoading: boolean;
  activeView: 'landing' | 'admin' | 'public_store';
  currentPublicSlug: string | null;
  
  // Navigation & View switching
  goToLanding: () => void;
  goToAdmin: () => void;
  goToPublicStore: (slug: string) => void;
  setSelectedBusinessId: (id: string) => void;
  
  // Business CRUD
  createBusiness: (bizData: Partial<Business>) => Promise<Business>;
  updateBusiness: (biz: Business) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  toggleBusinessActive: (id: string) => Promise<void>;
  getBusinessBySlug: (slug: string) => Business | undefined;
  
  // Product CRUD
  createProduct: (prodData: Partial<Product>) => Promise<Product>;
  updateProduct: (prod: Product) => Promise<void>;
  deleteProduct: (id: string, businessId: string) => Promise<void>;
  toggleProductAvailable: (id: string) => Promise<void>;
  
  // Category CRUD
  createCategory: (catData: Partial<Category>) => Promise<Category>;
  updateCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string, businessId: string) => Promise<void>;
  
  // Order submission
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  
  // Reset demo
  resetData: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);
  const [activeView, setActiveView] = useState<'landing' | 'admin' | 'public_store'>('landing');
  const [currentPublicSlug, setCurrentPublicSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bizList, catList, prodList, ordList] = await Promise.all([
        DataService.getBusinesses(),
        DataService.getCategories(),
        DataService.getProducts(),
        DataService.getOrders(),
      ]);
      setBusinesses(bizList);
      setCategories(catList);
      setProducts(prodList);
      setOrders(ordList);
      if (bizList.length > 0 && !selectedBusinessId) {
        setSelectedBusinessId(bizList[0].id);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    loadAll();
  }, []);

  const activeBusiness = businesses.find((b) => b.id === selectedBusinessId) || businesses[0] || null;

  // View navigation helpers
  const goToLanding = () => {
    setActiveView('landing');
    setCurrentPublicSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAdmin = () => {
    setActiveView('admin');
    setCurrentPublicSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPublicStore = (slug: string) => {
    setCurrentPublicSlug(slug);
    const found = businesses.find((b) => b.slug === slug);
    if (found) {
      setSelectedBusinessId(found.id);
    }
    setActiveView('public_store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBusinessBySlug = (slug: string) => {
    return businesses.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  };

  // Business CRUD
  const createBusiness = async (bizData: Partial<Business>): Promise<Business> => {
    const rawSlug = (bizData.name || 'negocio')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newBiz: Business = {
      id: 'biz-' + Date.now(),
      slug: bizData.slug || rawSlug || 'mi-negocio',
      name: bizData.name || 'Nuevo Negocio',
      businessType: bizData.businessType || 'General',
      tagline: bizData.tagline || 'Calidad y servicio garantizado',
      description: bizData.description || 'Bienvenido a nuestro catálogo digital.',
      logoUrl: bizData.logoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
      coverUrl: bizData.coverUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      phone: bizData.phone || '+507 6000-0000',
      whatsapp: bizData.whatsapp || '50760000000',
      address: bizData.address || 'Ciudad de Panamá',
      schedule: bizData.schedule || 'Lunes a Sábado: 9:00 AM - 6:00 PM',
      instagram: bizData.instagram || '',
      facebook: bizData.facebook || '',
      tiktok: bizData.tiktok || '',
      primaryColor: bizData.primaryColor || '#253745',
      secondaryColor: bizData.secondaryColor || '#F8FAFC',
      template: (bizData.template as TemplateType) || 'general',
      isActive: bizData.isActive ?? true,
      currency: bizData.currency || '$',
      deliveryAvailable: bizData.deliveryAvailable ?? true,
      deliveryCost: bizData.deliveryCost ?? 3.0,
      featuredNotice: bizData.featuredNotice || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await DataService.saveBusiness(newBiz);
    setBusinesses((prev) => [newBiz, ...prev]);
    setSelectedBusinessId(newBiz.id);

    // Create default category
    const defaultCat: Category = {
      id: 'cat-' + Date.now(),
      businessId: newBiz.id,
      name: 'Destacados',
      description: 'Productos principales del catálogo',
      icon: 'Star',
      sortOrder: 1,
      isActive: true,
    };
    await DataService.saveCategory(defaultCat);
    setCategories((prev) => [...prev, defaultCat]);

    return newBiz;
  };

  const updateBusiness = async (biz: Business) => {
    const updatedBiz = { ...biz, updatedAt: new Date().toISOString() };
    await DataService.saveBusiness(updatedBiz);
    setBusinesses((prev) => prev.map((b) => (b.id === biz.id ? updatedBiz : b)));
  };

  const deleteBusiness = async (id: string) => {
    await DataService.deleteBusiness(id);
    const updated = businesses.filter((b) => b.id !== id);
    setBusinesses(updated);
    if (selectedBusinessId === id && updated.length > 0) {
      setSelectedBusinessId(updated[0].id);
    }
  };

  const toggleBusinessActive = async (id: string) => {
    const biz = businesses.find((b) => b.id === id);
    if (!biz) return;
    const updated = { ...biz, isActive: !biz.isActive, updatedAt: new Date().toISOString() };
    await updateBusiness(updated);
  };

  // Product CRUD
  const createProduct = async (prodData: Partial<Product>): Promise<Product> => {
    const targetBusinessId = prodData.businessId || selectedBusinessId;
    const newProd: Product = {
      id: 'prod-' + Date.now(),
      businessId: targetBusinessId,
      categoryId: prodData.categoryId || (categories.find(c => c.businessId === targetBusinessId)?.id || 'general'),
      name: prodData.name || 'Nuevo Producto',
      description: prodData.description || '',
      price: Number(prodData.price) || 0,
      comparePrice: prodData.comparePrice ? Number(prodData.comparePrice) : undefined,
      imageUrl: prodData.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      tags: prodData.tags || [],
      isFeatured: prodData.isFeatured ?? false,
      isAvailable: prodData.isAvailable ?? true,
      sku: prodData.sku || '',
      unit: prodData.unit || '',
      createdAt: new Date().toISOString(),
    };

    await DataService.saveProduct(newProd);
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = async (prod: Product) => {
    await DataService.saveProduct(prod);
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
  };

  const deleteProduct = async (id: string, businessId: string) => {
    await DataService.deleteProduct(id, businessId);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductAvailable = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    const updated = { ...p, isAvailable: !p.isAvailable };
    await updateProduct(updated);
  };

  // Category CRUD
  const createCategory = async (catData: Partial<Category>): Promise<Category> => {
    const targetBusinessId = catData.businessId || selectedBusinessId;
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      businessId: targetBusinessId,
      name: catData.name || 'Nueva Categoría',
      description: catData.description || '',
      icon: catData.icon || 'Tag',
      sortOrder: catData.sortOrder || categories.filter(c => c.businessId === targetBusinessId).length + 1,
      isActive: catData.isActive ?? true,
    };

    await DataService.saveCategory(newCat);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (cat: Category) => {
    await DataService.saveCategory(cat);
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
  };

  const deleteCategory = async (id: string, businessId: string) => {
    await DataService.deleteCategory(id, businessId);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Order creation
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    await DataService.saveOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const resetData = () => {
    DataService.resetDemoData();
    setBusinesses(INITIAL_BUSINESSES);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setSelectedBusinessId(INITIAL_BUSINESSES[0].id);
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        categories,
        products,
        orders,
        selectedBusinessId,
        activeBusiness,
        isLoading,
        activeView,
        currentPublicSlug,
        goToLanding,
        goToAdmin,
        goToPublicStore,
        setSelectedBusinessId,
        createBusiness,
        updateBusiness,
        deleteBusiness,
        toggleBusinessActive,
        getBusinessBySlug,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailable,
        createCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        resetData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
