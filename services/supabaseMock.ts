

// FIX: Added Plan and NewPlan to imports to resolve module errors.
import { SiteContent, Tool, Lead, SupabaseSession, NewTool, BioLink, Product, UserTier, PortfolioItem, Feedback, ShopeeProduct, Plan, NewPlan } from '../types';
import { 
  SITE_CONTENT_DATA_PT, 
  SITE_CONTENT_DATA_EN, 
} from '../data/siteContent';
import { LEADS_DATA } from '../data/leads';
import {
  FREEMIUM_TOOLS_PT,
  PREMIUM_TOOLS_PT,
  FREEMIUM_TOOLS_EN,
  PREMIUM_TOOLS_EN
} from '../data/tools';
import { MOCK_BIO_LINKS } from '../data/bioLinks';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_SHOPEE_PRODUCTS } from '../data/shopeeProducts';
// Fix: Changed import path to break circular dependency.
import { IAppSupabaseClient } from '../types';
import { INITIAL_PLANS } from '../data/plans';

// ==============================================================================
// --- Mock Database (Session Storage) ---
// ==============================================================================

const STORAGE_KEY = '__MOCK_ARSENAL_TOOLS_DATA__';

type MockData = {
    site_content: { id: number; key: string; content: SiteContent; updated_at: string }[];
    tools: Tool[];
    leads: Lead[];
    bio_links: BioLink[];
    products: Product[];
    // FIX: Added plans property to mock data structure.
    plans: Plan[];
    shopee_products: ShopeeProduct[];
    portfolio_items: PortfolioItem[];
    feedbacks: Feedback[];
    nextToolId: number;
    nextLeadId: number;
    nextBioLinkId: number;
    nextProductId: number;
    // FIX: Added nextPlanId for mock data generation.
    nextPlanId: number;
    nextShopeeProductId: number;
    nextPortfolioItemId: number;
    nextFeedbackId: number;
};

// Initial Portfolio Data
const INITIAL_PORTFOLIO: PortfolioItem[] = [
    { id: 1, title: 'Êxodo 13', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Feed-Biblia-Livro-Exodo-13.jpg?raw=true', category: 'Social Media', order: 1 },
    { id: 2, title: 'Êxodo 14', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Feed-Biblia-Livro-Exodo-14.jpg?raw=true', category: 'Social Media', order: 2 },
    { id: 3, title: 'Carrossel Dia das Mães', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Carrossel-Vertical-Dia-das-M%C3%A3es-_3.jpg?raw=true', category: 'Carrossel', order: 3 },
    { id: 4, title: 'Êxodo 7', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Feed-Biblia-Livro-Exodo-7.jpg?raw=true', category: 'Social Media', order: 4 },
    { id: 5, title: 'Story Natal 1', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-4.jpg?raw=true', category: 'Social Media', order: 5 },
    { id: 6, title: 'Carrossel Dia do Consumidor', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/CARROSSEL-VERT-dia-do-consumidor-01.jpg?raw=true', category: 'Carrossel', order: 6 },
    { id: 7, title: 'Story Natal 2', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-5.jpg?raw=true', category: 'Social Media', order: 7 },
    { id: 8, title: 'Story Natal 3', imageUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-6.jpg?raw=true', category: 'Social Media', order: 8 },
];

function getMockData(): MockData {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initializeMockData();
  } catch (e) {
    return initializeMockData();
  }
}

function setMockData(data: MockData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Silently fail in production, or use a more robust logger
  }
}

function initializeMockData(): MockData {
  const initialToolsPtFreemium = FREEMIUM_TOOLS_PT.map((tool, index) => ({ ...tool, lang: 'pt', id: index + 1, type: 'freemium' }));
  const initialToolsPtPremium = PREMIUM_TOOLS_PT.map((tool, index) => ({ ...tool, lang: 'pt', id: initialToolsPtFreemium.length + index + 1, type: 'premium' }));
  const initialToolsEnFreemium = FREEMIUM_TOOLS_EN.map((tool, index) => ({ ...tool, lang: 'en', id: initialToolsPtFreemium.length + initialToolsPtPremium.length + index + 1, type: 'freemium' }));
  const initialToolsEnPremium = PREMIUM_TOOLS_EN.map((tool, index) => ({ ...tool, lang: 'en', id: initialToolsPtFreemium.length + initialToolsPtPremium.length + initialToolsEnFreemium.length + index + 1, type: 'premium' }));
  
  const allInitialTools = [...initialToolsPtFreemium, ...initialToolsPtPremium, ...initialToolsEnFreemium, ...initialToolsEnPremium];

  const initialData: MockData = {
    site_content: [
      { id: 1, key: 'site_content_pt', content: SITE_CONTENT_DATA_PT, updated_at: new Date().toISOString() },
      { id: 2, key: 'site_content_en', content: SITE_CONTENT_DATA_EN, updated_at: new Date().toISOString() },
    ],
    tools: allInitialTools as Tool[],
    leads: LEADS_DATA,
    bio_links: MOCK_BIO_LINKS,
    products: INITIAL_PRODUCTS,
    // FIX: Initialize plans with data from `data/plans.ts`.
    plans: INITIAL_PLANS,
    shopee_products: INITIAL_SHOPEE_PRODUCTS,
    portfolio_items: INITIAL_PORTFOLIO,
    feedbacks: [],
    nextToolId: allInitialTools.length + 1,
    nextLeadId: LEADS_DATA.length + 1,
    nextBioLinkId: MOCK_BIO_LINKS.length + 1,
    nextProductId: INITIAL_PRODUCTS.length + 1,
    // FIX: Initialize nextPlanId.
    nextPlanId: INITIAL_PLANS.length + 1,
    nextShopeeProductId: INITIAL_SHOPEE_PRODUCTS.length + 1,
    nextPortfolioItemId: INITIAL_PORTFOLIO.length + 1,
    nextFeedbackId: 1,
  };
  setMockData(initialData);
  return initialData;
}

// ... rest of the file (Auth Mock, Query Builder Mock) remains the same but handles shopee_products via generic query builder logic ...
// ==============================================================================
// --- API Helpers ---
// ==============================================================================

const MOCK_DELAY = 150; // ms
const delay = () => new Promise(res => setTimeout(res, MOCK_DELAY));


// ==============================================================================
// --- Auth Mock ---
// ==============================================================================
let authStateChangeListener: ((event: string, session: SupabaseSession | null) => void) | null = null;
const AUTH_SESSION_KEY = '__MOCK_AUTH_SESSION__';

// Credenciais Mock
const MOCK_ADMIN_EMAIL = 'admin@arsenal.com';
const MOCK_ADMIN_PASSWORD = '123';
const MOCK_PRO_EMAIL = 'pro@arsenal.com';
const MOCK_PRO_PASSWORD = '123';
const MOCK_FREE_EMAIL = 'free@arsenal.com'; // Opcional, para testes explícitos
const MOCK_FREE_PASSWORD = '123';

const authMock = {
  async getSession() {
    await delay();
    const sessionJson = sessionStorage.getItem(AUTH_SESSION_KEY);
    const session = sessionJson ? JSON.parse(sessionJson) : null;
    return { data: { session }, error: null };
  },
  async signInWithPassword({ email, password }: any) {
    await delay();
    
    let tier: UserTier = 'free';
    let userId = 'mock-user-id';

    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        tier = 'admin';
        userId = 'mock-admin-id';
    } else if (email === MOCK_PRO_EMAIL && password === MOCK_PRO_PASSWORD) {
        tier = 'pro';
        userId = 'mock-pro-id';
    } else if (email === MOCK_FREE_EMAIL && password === MOCK_FREE_PASSWORD) {
        tier = 'free';
        userId = 'mock-free-id';
    } else {
        return { data: { session: null, user: null }, error: { message: 'Credenciais Inválidas (Mock)' } };
    }

    const mockSession: SupabaseSession = { 
        user: { 
            id: userId, 
            email,
            user_metadata: { tier } // Armazena o nível no metadata
        } 
    };
    
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(mockSession));
    authStateChangeListener?.('SIGNED_IN', mockSession);
    return { data: { session: mockSession, user: mockSession.user }, error: null };
  },
  async signOut() {
    await delay();
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    authStateChangeListener?.('SIGNED_OUT', null);
    return { error: null };
  },
  onAuthStateChange(callback: (event: string, session: SupabaseSession | null) => void) {
    authStateChangeListener = callback;
    return { data: { subscription: { unsubscribe: () => { authStateChangeListener = null; } } } };
  }
};


// ==============================================================================
// --- Query Builder Mock ---
// ==============================================================================

type Filter = { column: string; operator: 'eq' | 'neq'; value: any };

class MockQueryBuilder {
  private tableName: string;
  private filters: Filter[] = [];
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private shouldBeSingle = false;
  private selectedColumns: string[] | null = null;
  private operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert' | null = null;
  private payload: any | any[] | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  select(columns = '*') {
    if (!this.operation) {
        this.operation = 'select';
    }
    this.selectedColumns = columns.split(',').map(c => c.trim());
    return this;
  }
  
  insert(records: any[]) {
    this.operation = 'insert';
    this.payload = records;
    return this;
  }
  
  update(updates: any) {
    this.operation = 'update';
    this.payload = updates;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  // FIX: Add upsert method to mock query builder.
  upsert(payload: any) {
    this.operation = 'upsert';
    this.payload = Array.isArray(payload) ? payload : [payload];
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }
  
  neq(column: string, value: any) {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }
  
  order(column: string, { ascending } = { ascending: true }) {
    this.orderConfig = { column, ascending };
    return this;
  }
  
  single() {
    this.shouldBeSingle = true;
    return this;
  }

  then(resolve: any, reject: any) {
    this.execute().then(resolve, reject);
  }
  
  private async execute() {
    await delay();
    switch (this.operation) {
      case 'select': return this.executeQuery();
      case 'insert': return this.executeInsert();
      case 'update': return this.executeUpdate();
      case 'delete': return this.executeDelete();
      // FIX: Add upsert case to execute method.
      case 'upsert': return this.executeUpsert();
      default: return Promise.resolve({ data: null, error: { message: "No operation specified" } });
    }
  }

  private executeQuery() {
    const data = getMockData();
    let table = (data as any)[this.tableName] || [];
    
    let results = table.filter((item: any) => 
        this.filters.every(f => item[f.column] === f.value)
    );

    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      results.sort((a: any, b: any) => {
        if (typeof a[column] === 'boolean' && typeof b[column] === 'boolean') {
             return ascending ? (a[column] === b[column] ? 0 : a[column] ? 1 : -1) : (a[column] === b[column] ? 0 : a[column] ? -1 : 1);
        }
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }
    
    if (this.selectedColumns && this.selectedColumns[0] !== '*') {
      results = results.map((item: any) => {
        const newItem: any = {};
        this.selectedColumns!.forEach(col => { newItem[col] = item[col]; });
        return newItem;
      });
    }
    
    if (this.shouldBeSingle) {
      if (results.length === 0) return { data: null, error: { message: 'No rows found', code: 'PGRST116' } };
      return { data: results[0], error: null };
    }
    
    return { data: results, error: null };
  }
  
  private executeInsert() {
      const records = this.payload as any[];
      if (!records) return { data: null, error: { message: "Insert call without payload" } };
      
      const data = getMockData();
      const table = (data as any)[this.tableName] || [];
      // Dynamic ID key generation logic
      let idKey = `next${this.tableName.charAt(0).toUpperCase() + this.tableName.slice(1, -1)}Id`;
      // Special cases
      if (this.tableName === 'bio_links') idKey = 'nextBioLinkId';
      if (this.tableName === 'products') idKey = 'nextProductId';
      // FIX: Add 'plans' case for mock ID generation.
      if (this.tableName === 'plans') idKey = 'nextPlanId';
      if (this.tableName === 'shopee_products') idKey = 'nextShopeeProductId';
      if (this.tableName === 'portfolio_items') idKey = 'nextPortfolioItemId';
      if (this.tableName === 'feedbacks') idKey = 'nextFeedbackId';

      const newRecords = records.map(r => {
        const newId = (data as any)[idKey]++;
        const finalRecord: any = { ...r, id: newId, created_at: new Date().toISOString() };
        if (!finalRecord.date) finalRecord.date = new Date().toISOString();
        if (!finalRecord.status && this.tableName === 'leads') finalRecord.status = 'Novo';
        return finalRecord;
      });

      (data as any)[this.tableName] = [...table, ...newRecords];
      setMockData(data);
      
      let results = newRecords;
      if (this.selectedColumns) {
          if (this.shouldBeSingle) return { data: results[0], error: null };
          return { data: results, error: null };
      }
      return { data: newRecords, error: null };
  }

  private executeUpdate() {
      const updates = this.payload;
      if (!updates) return { data: null, error: { message: "Update call without payload" } };

      const data = getMockData();
      let table: any[] = (data as any)[this.tableName] || [];
      let updatedRecords: any[] = [];

      (data as any)[this.tableName] = table.map((item: any) => {
          if(this.filters.every(f => item[f.column] === f.value)) {
              const updatedItem = { ...item, ...updates, updated_at: new Date().toISOString() };
              updatedRecords.push(updatedItem);
              return updatedItem;
          }
          return item;
      });
      setMockData(data);

      if (this.selectedColumns) {
        if (this.shouldBeSingle) {
          if (updatedRecords.length === 0) return { data: null, error: { message: 'No rows found to update', code: 'PGRST116' } };
          return { data: updatedRecords[0], error: null };
        }
        return { data: updatedRecords, error: null };
      }
      return { data: updatedRecords, error: null };
  }
  
  private executeDelete() {
      const data = getMockData();
      const table = (data as any)[this.tableName] || [];

      const newTable = table.filter((item: any) => 
        !this.filters.every(f => {
            if (f.operator === 'eq') return item[f.column] === f.value;
            if (f.operator === 'neq') return item[f.column] !== f.value;
            return false;
        })
      );

      (data as any)[this.tableName] = newTable;
      setMockData(data);
      return { data: [], error: null };
  }

  // FIX: Added executeUpsert to handle both inserts and updates for mock data.
  private executeUpsert() {
      const records = this.payload as any[];
      if (!records) return { data: null, error: { message: "Upsert call without payload" } };
      
      const data = getMockData();
      let table: any[] = (data as any)[this.tableName] || [];
      const returnedRecords: any[] = [];
      
      const getIdKey = (tableName: string) => {
        switch (tableName) {
            case 'tools': return 'nextToolId';
            case 'leads': return 'nextLeadId';
            case 'bio_links': return 'nextBioLinkId';
            case 'products': return 'nextProductId';
            case 'plans': return 'nextPlanId';
            case 'shopee_products': return 'nextShopeeProductId';
            case 'portfolio_items': return 'nextPortfolioItemId';
            case 'feedbacks': return 'nextFeedbackId';
            default: return `next${tableName.charAt(0).toUpperCase() + tableName.slice(1, -1)}Id`;
        }
      }
      const idKey = getIdKey(this.tableName);

      records.forEach(record => {
          const recordId = record.id;
          const existingIndex = recordId !== undefined && recordId !== null ? table.findIndex(item => item.id === recordId) : -1;

          if (existingIndex > -1) {
              // Update
              table[existingIndex] = { ...table[existingIndex], ...record, updated_at: new Date().toISOString() };
              returnedRecords.push(table[existingIndex]);
          } else {
              // Insert
              const newId = (data as any)[idKey]++;
              const newRecord = { ...record, id: newId, created_at: new Date().toISOString() };
              table.push(newRecord);
              returnedRecords.push(newRecord);
          }
      });

      (data as any)[this.tableName] = table;
      setMockData(data);
      
      let results = returnedRecords;
      if (this.selectedColumns && this.selectedColumns[0] !== '*') {
          results = results.map((item: any) => {
              const newItem: any = {};
              this.selectedColumns!.forEach(col => { newItem[col] = item[col]; });
              return newItem;
          });
      }

      if (this.shouldBeSingle) {
          return { data: results[0], error: null };
      }
      return { data: results, error: null };
  }
}

export const supabaseMockClient: IAppSupabaseClient = {
  isStub: true,
  auth: authMock,
  from: (tableName: string) => new MockQueryBuilder(tableName),
} as any;