import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Category,
  ClassifiedItem,
  ClassifiedStatus,
  ClothingSize,
  CustomerInfo,
  GroupConfig,
  Order,
  OrderStatus,
  Product,
  RideSchedule,
  User,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_CLASSIFIEDS,
  INITIAL_GROUP_CONFIG,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_RIDES,
  INITIAL_USERS,
} from '../data/initialData';
import { generatePixPayload } from '../utils/pix';

export type AppTab = 'inicio' | 'loja' | 'classificados' | 'carrinho' | 'admin' | 'perfil';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & UI
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedClassifiedId: string | null;
  setSelectedClassifiedId: (id: string | null) => void;
  
  // Data State
  products: Product[];
  categories: Category[];
  classifieds: ClassifiedItem[];
  orders: Order[];
  cart: CartItem[];
  rides: RideSchedule[];
  groupConfig: GroupConfig;
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;

  // Cart
  addToCart: (product: Product, size: ClothingSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  createOrder: (customer: CustomerInfo, deliveryMethod: 'retirada' | 'envio') => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (orderId: string, trackingCode: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Products CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Classifieds CRUD
  addClassified: (classified: Omit<ClassifiedItem, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerPhone' | 'sellerCity'>) => string;
  updateClassified: (id: string, data: Partial<ClassifiedItem>) => void;
  deleteClassified: (id: string) => void;
  updateClassifiedStatus: (id: string, status: ClassifiedStatus) => void;

  // Categories CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Rides CRUD
  addRide: (ride: Omit<RideSchedule, 'id'>) => void;
  updateRide: (id: string, ride: Partial<RideSchedule>) => void;
  deleteRide: (id: string) => void;

  // Group config
  updateGroupConfig: (config: Partial<GroupConfig>) => void;

  // Auth
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, city: string, pass: string) => { success: boolean; message: string };
  logout: () => void;

  // System & Reset
  resetToDefaultData: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'amarelinhos_products_v2',
  CATEGORIES: 'amarelinhos_categories_v2',
  CLASSIFIEDS: 'amarelinhos_classifieds_v2',
  ORDERS: 'amarelinhos_orders_v2',
  CART: 'amarelinhos_cart_v2',
  RIDES: 'amarelinhos_rides_v2',
  GROUP_CONFIG: 'amarelinhos_group_config_v2',
  USERS: 'amarelinhos_users_v2',
  CURRENT_USER: 'amarelinhos_current_user_v2',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}`, err);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing localStorage for key ${key}`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedClassifiedId, setSelectedClassifiedId] = useState<string | null>(null);

  // States with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => loadStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>(() => loadStorage(STORAGE_KEYS.CLASSIFIEDS, INITIAL_CLASSIFIEDS));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage(STORAGE_KEYS.CART, []));
  const [rides, setRides] = useState<RideSchedule[]>(() => loadStorage(STORAGE_KEYS.RIDES, INITIAL_RIDES));
  const [groupConfig, setGroupConfig] = useState<GroupConfig>(() => loadStorage(STORAGE_KEYS.GROUP_CONFIG, INITIAL_GROUP_CONFIG));
  const [users, setUsers] = useState<User[]>(() => loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0])); // Starts as admin for seamless prototype evaluation
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-sync states to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveStorage(STORAGE_KEYS.CLASSIFIEDS, classifieds), [classifieds]);
  useEffect(() => saveStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => saveStorage(STORAGE_KEYS.RIDES, rides), [rides]);
  useEffect(() => saveStorage(STORAGE_KEYS.GROUP_CONFIG, groupConfig), [groupConfig]);
  useEffect(() => saveStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_USER, currentUser), [currentUser]);

  // Toast notifier
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isAdmin = currentUser?.role === 'admin';

  // Cart operations
  const addToCart = (product: Product, size: ClothingSize, quantity = 1) => {
    const cartItemId = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        showToast(`Adicionado mais +${quantity}x no carrinho!`, 'success');
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      showToast(`"${product.name}" (Tam. ${size}) adicionado ao carrinho!`, 'success');
      return [...prev, { id: cartItemId, productId: product.id, product, size, quantity }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removido do carrinho.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Order creation with BACEN EMV PIX payload
  const createOrder = async (customer: CustomerInfo, deliveryMethod: 'retirada' | 'envio'): Promise<Order> => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `${groupConfig.pixConfig.txidPrefix || 'AMAR'}-${orderNumber}`;
    const txid = `${groupConfig.pixConfig.txidPrefix || 'AMAR'}${orderNumber}`;
    const orderId = `ord-${Date.now()}`;

    const items = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      size: item.size,
      unitPrice: item.product.price,
      quantity: item.quantity,
    }));

    // Official BACEN PIX BR Code EMV Payload
    const pixPayload = generatePixPayload({
      pixKey: groupConfig.pixConfig.key,
      merchantName: groupConfig.pixConfig.merchantName,
      merchantCity: groupConfig.pixConfig.merchantCity,
      amount: cartTotal,
      txid: txid,
      description: `Pedido ${orderCode}`,
    });

    const newOrder: Order = {
      id: orderId,
      code: orderCode,
      createdAt: new Date().toISOString(),
      customer,
      items,
      totalAmount: cartTotal,
      status: 'pendente',
      deliveryMethod,
      pixPayload,
      pixTxid: txid,
      pixKey: groupConfig.pixConfig.key,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Encomenda ${orderCode} gerada com sucesso! Efetue o PIX para confirmação.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated: Order = { ...order, status };
          if (status === 'pago' && !order.paymentConfirmedAt) {
            updated.paymentConfirmedAt = new Date().toISOString();
          }
          return updated;
        }
        return order;
      })
    );
    showToast(`Status do pedido atualizado para: ${status.toUpperCase()}`, 'info');
  };

  const updateOrderTracking = (orderId: string, trackingCode: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingCode, status: 'enviado' } : o))
    );
    showToast('Código de rastreio salvo e status alterado para Enviado!', 'success');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produto "${newProduct.name}" cadastrado com sucesso!`, 'success');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    showToast('Produto atualizado!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produto removido da loja.', 'info');
  };

  // Classifieds CRUD
  const addClassified = (
    data: Omit<ClassifiedItem, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerPhone' | 'sellerCity'>
  ): string => {
    if (!currentUser) {
      showToast('Você precisa estar logado para publicar um anúncio.', 'error');
      return '';
    }

    const id = `class-${Date.now()}`;
    const newItem: ClassifiedItem = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.phone,
      sellerCity: currentUser.city,
      status: 'ativo',
      views: 1,
    };

    setClassifieds((prev) => [newItem, ...prev]);
    showToast('Seu anúncio foi publicado com sucesso nos Classificados!', 'success');
    return id;
  };

  const updateClassified = (id: string, data: Partial<ClassifiedItem>) => {
    setClassifieds((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    showToast('Anúncio atualizado.', 'success');
  };

  const deleteClassified = (id: string) => {
    setClassifieds((prev) => prev.filter((c) => c.id !== id));
    showToast('Anúncio excluído.', 'info');
  };

  const updateClassifiedStatus = (id: string, status: ClassifiedStatus) => {
    setClassifieds((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    showToast(`Status do anúncio alterado para: ${status}`, 'info');
  };

  // Categories CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...category, id }]);
    showToast(`Categoria "${category.name}" adicionada.`, 'success');
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...category } : c))
    );
    showToast('Categoria atualizada.', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Categoria removida.', 'info');
  };

  // Rides CRUD
  const addRide = (ride: Omit<RideSchedule, 'id'>) => {
    const id = `ride-${Date.now()}`;
    setRides((prev) => [...prev, { ...ride, id }]);
    showToast('Novo pedal programado adicionado!', 'success');
  };

  const updateRide = (id: string, ride: Partial<RideSchedule>) => {
    setRides((prev) => prev.map((r) => (r.id === id ? { ...r, ...ride } : r)));
    showToast('Informações do pedal atualizadas!', 'success');
  };

  const deleteRide = (id: string) => {
    setRides((prev) => prev.filter((r) => r.id !== id));
    showToast('Pedal removido da programação.', 'info');
  };

  const updateGroupConfig = (config: Partial<GroupConfig>) => {
    setGroupConfig((prev) => ({ ...prev, ...config }));
    showToast('Configurações do grupo atualizadas!', 'success');
  };

  // Auth
  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check Admin access
    if (cleanEmail === 'admin@amarelinhos.com.br' || cleanEmail === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      showToast('Bem-vindo, Administrador Amarelinhos!', 'success');
      return { success: true, message: 'Login de administrador realizado com sucesso!' };
    }

    // Check user by email
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      showToast(`Bem-vindo de volta, ${existing.name}!`, 'success');
      return { success: true, message: 'Login realizado com sucesso!' };
    }

    return { success: false, message: 'Usuário não encontrado. Cadastre-se gratuitamente!' };
  };

  const register = (name: string, email: string, phone: string, city: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Já existe um cadastro com este e-mail.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.replace(/\D/g, ''),
      city: city.trim() || 'São Paulo - SP',
      role: 'cliente',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Conta criada com sucesso! Olá, ${newUser.name}!`, 'success');
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Você desconectou da sua conta.', 'info');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setClassifieds(INITIAL_CLASSIFIEDS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setRides(INITIAL_RIDES);
    setGroupConfig(INITIAL_GROUP_CONFIG);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    showToast('Dados restaurados com sucesso para os padrões de demonstração!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        selectedClassifiedId,
        setSelectedClassifiedId,
        products,
        categories,
        classifieds,
        orders,
        cart,
        rides,
        groupConfig,
        users,
        currentUser,
        isAdmin,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        getOrderById,
        addProduct,
        updateProduct,
        deleteProduct,
        addClassified,
        updateClassified,
        deleteClassified,
        updateClassifiedStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addRide,
        updateRide,
        deleteRide,
        updateGroupConfig,
        login,
        register,
        logout,
        resetToDefaultData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
