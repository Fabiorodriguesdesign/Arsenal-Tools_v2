

// Fix: Import SupabaseClient to define IAppSupabaseClient.
import type { SupabaseClient } from '@supabase/supabase-js';
import { IconName } from './components/icons';

// ==========================================
// 1. CMS & SITE CONTENT
// ==========================================

export interface SiteContent {
  logo_svg: string;
  main_title: string;
  main_subtitle: string;
  freemium_title: string;
  freemium_subtitle: string;
  premium_title: string;
  premium_subtitle: string;
  contact_title: string;
  contact_subtitle: string;
}

export interface FAQItem {
  id?: number | string;
  question: string;
  answer: string;
}

// ==========================================
// 2. TOOLS & CATALOG
// ==========================================

export interface Tool {
  /** Database ID (number) or Internal ID (string slug) */
  id: string | number;
  lang?: string;
  name: string;
  /** Matches keys in iconPaths or an SVG string */
  icon: IconName | string; 
  type: 'freemium' | 'premium';
  learnMoreUrl?: string;
  internalRoute?: string;
  description?: string;
  benefits?: string;
  category?: string;
}

export type NewTool = Omit<Tool, 'id'>;

// ==========================================
// 3. CRM (LEADS & FEEDBACK)
// ==========================================

export const LEAD_STATUS_OPTIONS = ['Novo', 'Em contato', 'Assinante'] as const;
export type LeadStatus = typeof LEAD_STATUS_OPTIONS[number];

export interface Lead {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  toolOfInterest: string;
  date: string;
  status: LeadStatus;
  notes?: string;
  sourcePlan?: 'freemium' | 'premium';
}

export type FeedbackType = 'bug' | 'suggestion' | 'other';

export interface Feedback {
    id: number;
    type: FeedbackType;
    message: string;
    page_url?: string;
    created_at: string;
    status: 'pending' | 'reviewed';
}

export type NewFeedback = Omit<Feedback, 'id' | 'created_at' | 'status'>;

// ==========================================
// 4. MONETIZATION (STORE & SHOPEE)
// ==========================================

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    oldPrice?: number; // Para mostrar "De: X Por: Y"
    coverUrl: string;
    purchaseUrl: string; // Link externo (Hotmart, Kiwify, etc)
    category: string;
    isFeatured?: boolean;
    badge?: string; // Ex: "Mais Vendido", "Novo"
    active: boolean;
}

export type NewProduct = Omit<Product, 'id'>;

// FIX: Add Plan and NewPlan types for monetization, which were missing.
export interface Plan {
    id: number;
    name: string;
    price: number;
    interval: 'monthly' | 'yearly' | 'lifetime';
    description: string;
    features: string[];
    active: boolean;
    isPopular: boolean;
    toolId?: number;
}

export type NewPlan = Omit<Plan, 'id'>;

export interface ShopeeProduct {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating: number; // 0 to 5
    soldCount: number;
    affiliateLink: string;
    discount?: number;
    category: string;
}

export type NewShopeeProduct = Omit<ShopeeProduct, 'id'>;

// ==========================================
// 5. AUTHENTICATION & SYSTEM
// ==========================================

export type UserTier = 'free' | 'pro' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    tier: UserTier;
    name?: string;
    avatar_url?: string;
}

// Centralized session type for Supabase authentication
export interface SupabaseSession {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
        tier?: UserTier;
        full_name?: string;
    };
  };
}

// Fix: Moved IAppSupabaseClient here to break a circular dependency
// between supabaseClient.ts and services/supabaseMock.ts.
export type IAppSupabaseClient = SupabaseClient & {
  isStub?: boolean;
};

// ==========================================
// 6. PORTFOLIO & BIO HUB
// ==========================================

export type BioLinkCategory = 'design' | 'marketing' | 'social';

export interface BioLink {
  id: number;
  title: string;
  titleKey?: string; // Para tradução (i18n)
  image_url: string;
  destination_url: string;
  category: BioLinkCategory;
  order: number;
  active: boolean;
  description?: string;
  descriptionKey?: string; // Para tradução (i18n)
}

export type NewBioLink = Omit<BioLink, 'id'>;

export interface PortfolioItem {
    id: number;
    title: string;
    imageUrl: string;
    category: string; // Ex: 'Social Media', 'Identity', 'Web'
    order: number;
}

export type NewPortfolioItem = Omit<PortfolioItem, 'id'>;