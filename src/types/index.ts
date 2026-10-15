export type ClothingSize = 'PP' | 'P' | 'M' | 'G' | 'GG';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  sizes: ClothingSize[];
  stockBySize: Record<ClothingSize, number>;
  badge?: string;
  isPreOrder?: boolean;
  estimatedDelivery?: string;
  features?: string[];
  fabric?: string;
}

export interface CartItem {
  id: string; // unique item id `${productId}-${size}`
  productId: string;
  product: Product;
  size: ClothingSize;
  quantity: number;
}

export type OrderStatus = 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: ClothingSize;
  unitPrice: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address?: string;
  cpf?: string;
  notes?: string;
}

export interface Order {
  id: string;
  code: string; // e.g. AMAR-9842
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryMethod: 'retirada' | 'envio';
  pixPayload: string;
  pixTxid: string;
  pixKey: string;
  paymentConfirmedAt?: string;
  trackingCode?: string;
  adminNotes?: string;
}

export type ClassifiedCondition = 'novo' | 'seminovo' | 'usado';
export type ClassifiedStatus = 'ativo' | 'pausado' | 'vendido' | 'moderacao';

export interface ClassifiedItem {
  id: string;
  title: string;
  categoryId: string;
  price: number;
  condition: ClassifiedCondition;
  description: string;
  images: string[]; // up to 4 images
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerCity: string;
  status: ClassifiedStatus;
  createdAt: string;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'loja' | 'classificados' | 'ambos';
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'cliente' | 'admin';
  createdAt: string;
  avatarUrl?: string;
}

export interface RideSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  meetingPoint: string;
  distanceKm: number;
  elevationM: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Bruto / Avançado';
  gpxOrMapsLink: string;
  description: string;
  leader: string;
}

export interface PixConfig {
  keyType: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  key: string;
  merchantName: string;
  merchantCity: string;
  txidPrefix: string;
}

export interface GroupConfig {
  name: string;
  badge: string;
  tagline: string;
  aboutText: string;
  historyText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappGroupUrl: string;
  instagramUrl: string;
  stravaUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  pixConfig: PixConfig;
  bannerNotice?: string;
}
