

import { supabasePromise } from '../supabaseClient';
import { handleError } from '../utils/errorHandler';
// FIX: Added Plan and NewPlan to imports
import { Lead, NewTool, Tool, LeadStatus, SiteContent, BioLink, NewBioLink, Product, NewProduct, NewFeedback, Feedback, ShopeeProduct, NewShopeeProduct, Plan, NewPlan } from '../types';
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
import { INITIAL_PLANS } from '../data/plans';

// --- Tipos de dados do Banco (snake_case) ---
interface DbTool {
  id: number;
  lang?: string;
  name: string;
  icon: string;
  type: 'freemium' | 'premium';
  learn_more_url?: string;
  description?: string;
  benefits?: string;
  category?: string;
}

interface DbLead {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  tool_of_interest: string;
  date: string;
  status: LeadStatus;
  notes?: string;
  source_plan?: 'freemium' | 'premium';
}

// FIX: Add DbPlan interface and mapper for plan management.
interface DbPlan {
  id: number;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly' | 'lifetime';
  description: string;
  features: string[];
  active: boolean;
  is_popular: boolean;
  tool_id?: number;
}

// --- Funções de Mapeamento ---
const mapDbToolToTool = (dbTool: DbTool): Tool => ({
  id: dbTool.id,
  lang: dbTool.lang,
  name: dbTool.name,
  icon: dbTool.icon,
  type: dbTool.type,
  learnMoreUrl: dbTool.learn_more_url,
  description: dbTool.description,
  benefits: dbTool.benefits,
  category: dbTool.category,
});

const mapDbLeadToLead = (dbLead: DbLead): Lead => ({
  id: dbLead.id,
  name: dbLead.name,
  email: dbLead.email,
  whatsapp: dbLead.whatsapp,
  toolOfInterest: dbLead.tool_of_interest,
  date: dbLead.date,
  status: dbLead.status,
  notes: dbLead.notes,
  sourcePlan: dbLead.source_plan,
});

const mapDbPlanToPlan = (dbPlan: DbPlan): Plan => ({
    id: dbPlan.id,
    name: dbPlan.name,
    price: dbPlan.price,
    interval: dbPlan.interval,
    description: dbPlan.description,
    features: dbPlan.features,
    active: dbPlan.active,
    isPopular: dbPlan.is_popular,
    toolId: dbPlan.tool_id,
});


export const SupabaseService = {
  async getTools(): Promise<Tool[] | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase.from('tools').select('*').order('id', { ascending: true });
      if (error) {
        if (error.code === 'PGRST116') return null; // "Not found"
        throw error;
      }
      return (data as DbTool[]).map(mapDbToolToTool);
    } catch (error) {
      handleError(error, 'Get Tools');
      throw error;
    }
  },
  
  async addTool(toolData: NewTool): Promise<Tool | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase
        .from('tools')
        .insert([ 
          {
            lang: toolData.lang || 'pt',
            name: toolData.name,
            icon: toolData.icon,
            type: toolData.type,
            learn_more_url: toolData.learnMoreUrl || null,
            description: toolData.description || null,
            benefits: toolData.benefits || null,
            category: toolData.category || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return mapDbToolToTool(data as DbTool);

    } catch (error) {
      handleError(error, 'Add Tool');
      throw error;
    }
  },

  async updateTool(toolData: Tool): Promise<Tool | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase
        .from('tools')
        .update({
          lang: toolData.lang,
          name: toolData.name,
          icon: toolData.icon,
          type: toolData.type,
          learn_more_url: toolData.learnMoreUrl || null,
          description: toolData.description || null,
          benefits: toolData.benefits || null,
          category: toolData.category || null,
        })
        .eq('id', toolData.id)
        .select()
        .single();

      if (error) throw error;
      return mapDbToolToTool(data as DbTool);

    } catch (error) {
      handleError(error, 'Update Tool');
      throw error;
    }
  },

  async deleteTool(toolId: number): Promise<void> {
    try {
      const supabase = await supabasePromise;
      const { error } = await supabase.from('tools').delete().eq('id', toolId);
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Delete Tool');
      throw error;
    }
  },

  async getLeads(): Promise<Lead[] | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase.from('leads').select('*').order('date', { ascending: false });
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return (data as DbLead[]).map(mapDbLeadToLead);
    } catch (error) {
      handleError(error, 'Get Leads');
      throw error;
    }
  },
  
  async addLead(leadData: {
      name: string;
      email: string;
      whatsapp?: string;
      toolOfInterest: string;
      sourcePlan?: 'freemium' | 'premium';
  }): Promise<Lead | null> {
      try {
          const supabase = await supabasePromise;
          const { data, error } = await supabase
              .from('leads')
              .insert([ 
                  {
                      name: leadData.name,
                      email: leadData.email,
                      whatsapp: leadData.whatsapp || null,
                      tool_of_interest: leadData.toolOfInterest,
                      source_plan: leadData.sourcePlan || null,
                      status: 'Novo', 
                      date: new Date().toISOString(),
                  },
              ])
              .select()
              .single();

          if (error) throw error;
          return mapDbLeadToLead(data as DbLead);

      } catch (error) {
          handleError(error, 'Add Lead');
          throw error;
      }
  },
  
  async updateLeadStatus(leadId: number, newStatus: LeadStatus): Promise<void> {
    try {
      const supabase = await supabasePromise;
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Update Lead Status');
      throw error;
    }
  },
  
  async updateLeadNotes(leadId: number, notes: string): Promise<void> {
    try {
      const supabase = await supabasePromise;
      const { error } = await supabase
        .from('leads')
        .update({ notes: notes })
        .eq('id', leadId);
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Update Lead Notes');
      throw error;
    }
  },

  async getSiteContent(lang: 'pt' | 'en'): Promise<SiteContent | null> {
    try {
        const supabase = await supabasePromise;
        const key = `site_content_${lang}`;
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data?.content as SiteContent || null;

    } catch (error) {
        handleError(error, `Get Site Content (${lang})`);
        throw error; 
    }
  },
  
  async updateSiteContent(lang: 'pt' | 'en', newContent: SiteContent): Promise<void> {
    try {
        const supabase = await supabasePromise;
        const key = `site_content_${lang}`;
        const { error } = await supabase
            .from('site_content')
            .update({ content: newContent, updated_at: new Date().toISOString() })
            .eq('key', key);
        
        if (error) throw error;
    } catch (error) {
        handleError(error, `Update Site Content (${lang})`);
        throw error;
    }
  },

  async getBioLinks(): Promise<BioLink[]> {
    try {
        const supabase = await supabasePromise;
        const { data, error } = await supabase.from('bio_links').select('*').order('order', { ascending: true });
        
        if (error) {
             if (error.code === 'PGRST116') return MOCK_BIO_LINKS;
             return MOCK_BIO_LINKS;
        }
        return data as BioLink[] || MOCK_BIO_LINKS;
    } catch (error) {
        handleError(error, 'Get Bio Links');
        return MOCK_BIO_LINKS;
    }
  },

  async addBioLink(linkData: NewBioLink): Promise<BioLink | null> {
    try {
        const supabase = await supabasePromise;
        const { data, error } = await supabase
            .from('bio_links')
            .insert([linkData])
            .select()
            .single();

        if (error) throw error;
        return data as BioLink;
    } catch (error) {
        handleError(error, 'Add Bio Link');
        throw error;
    }
  },

  async updateBioLink(linkData: BioLink): Promise<BioLink | null> {
    try {
        const supabase = await supabasePromise;
        const { data, error } = await supabase
            .from('bio_links')
            .update({
                title: linkData.title,
                image_url: linkData.image_url,
                destination_url: linkData.destination_url,
                category: linkData.category,
                order: linkData.order,
                active: linkData.active,
                description: linkData.description
            })
            .eq('id', linkData.id)
            .select()
            .single();

        if (error) throw error;
        return data as BioLink;
    } catch (error) {
        handleError(error, 'Update Bio Link');
        throw error;
    }
  },

  async deleteBioLink(linkId: number): Promise<void> {
    try {
        const supabase = await supabasePromise;
        const { error } = await supabase.from('bio_links').delete().eq('id', linkId);
        if (error) throw error;
    } catch (error) {
        handleError(error, 'Delete Bio Link');
        throw error;
    }
  },

  // --- PRODUCTS (STORE) MANAGEMENT ---

  async getProducts(): Promise<Product[]> {
      try {
          const supabase = await supabasePromise;
          const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
          
          if (error) return INITIAL_PRODUCTS;
          return (data as Product[]) || INITIAL_PRODUCTS;
      } catch (error) {
          handleError(error, 'Get Products');
          return INITIAL_PRODUCTS;
      }
  },

  async addProduct(productData: NewProduct): Promise<Product | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      handleError(error, 'Add Product');
      throw error;
    }
  },

  async updateProduct(productData: Product): Promise<Product | null> {
    try {
      const supabase = await supabasePromise;
      const { id, ...updates } = productData;
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error) {
      handleError(error, 'Update Product');
      throw error;
    }
  },

  async deleteProduct(productId: number): Promise<void> {
    try {
      const supabase = await supabasePromise;
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Delete Product');
      throw error;
    }
  },

  // FIX: Implement getPlans, savePlan, and deletePlan for plan management.
  // --- PLANS MANAGEMENT (for specific tools) ---
  async getPlans(toolId: number): Promise<Plan[]> {
    try {
        const supabase = await supabasePromise;
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('tool_id', toolId)
            .order('price', { ascending: true });

        if (error) {
            if (error.code === 'PGRST116') return []; // Not found is ok, returns empty array
            throw error;
        }
        return (data as DbPlan[]).map(mapDbPlanToPlan);
    } catch (error) {
        handleError(error, 'Get Plans');
        throw error;
    }
  },

  async savePlan(planData: Plan | NewPlan): Promise<Plan | null> {
    try {
        const supabase = await supabasePromise;
        const { id, isPopular, toolId, ...updates } = planData as Plan;
        
        const payload: any = {
            ...updates,
            is_popular: isPopular,
            tool_id: toolId
        };
        
        if (id) {
            payload.id = id;
        }
        
        const { data, error } = await supabase
            .from('plans')
            .upsert(payload)
            .select()
            .single();

        if (error) throw error;
        return mapDbPlanToPlan(data as DbPlan);
    } catch (error) {
        handleError(error, 'Save Plan');
        throw error;
    }
  },

  async deletePlan(planId: number): Promise<void> {
    try {
        const supabase = await supabasePromise;
        const { error } = await supabase.from('plans').delete().eq('id', planId);
        if (error) throw error;
    } catch (error) {
        handleError(error, 'Delete Plan');
        throw error;
    }
  },

  // --- SHOPEE FINDER MANAGEMENT ---

  async getShopeeProducts(): Promise<ShopeeProduct[]> {
    try {
        const supabase = await supabasePromise;
        const { data, error } = await supabase.from('shopee_products').select('*').order('id', { ascending: false });
        
        if (error) return INITIAL_SHOPEE_PRODUCTS;
        return (data as ShopeeProduct[]) || INITIAL_SHOPEE_PRODUCTS;
    } catch (error) {
        handleError(error, 'Get Shopee Products');
        return INITIAL_SHOPEE_PRODUCTS;
    }
  },

  async addShopeeProduct(productData: NewShopeeProduct): Promise<ShopeeProduct | null> {
    try {
      const supabase = await supabasePromise;
      const { data, error } = await supabase
        .from('shopee_products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      return data as ShopeeProduct;
    } catch (error) {
      handleError(error, 'Add Shopee Product');
      throw error;
    }
  },

  async updateShopeeProduct(productData: ShopeeProduct): Promise<ShopeeProduct | null> {
    try {
      const supabase = await supabasePromise;
      const { id, ...updates } = productData;
      const { data, error } = await supabase
        .from('shopee_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopeeProduct;
    } catch (error) {
      handleError(error, 'Update Shopee Product');
      throw error;
    }
  },

  async deleteShopeeProduct(productId: number): Promise<void> {
    try {
      const supabase = await supabasePromise;
      const { error } = await supabase.from('shopee_products').delete().eq('id', productId);
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Delete Shopee Product');
      throw error;
    }
  },


  // --- FEEDBACKS ---
  async addFeedback(feedback: NewFeedback): Promise<Feedback | null> {
      try {
          const supabase = await supabasePromise;
          const { data, error } = await supabase
              .from('feedbacks')
              .insert([{ ...feedback, created_at: new Date().toISOString(), status: 'pending' }])
              .select()
              .single();

          if (error) throw error;
          return data as Feedback;
      } catch (error) {
          handleError(error, 'Add Feedback');
          throw error;
      }
  },

  async seedDatabase(): Promise<void> {
    try {
      const supabase = await supabasePromise;
      console.log("[Seed DB]: Deletando dados existentes...");
      const results = await Promise.all([
        supabase.from('tools').delete().neq('id', -1),
        supabase.from('leads').delete().neq('id', -1),
        supabase.from('site_content').delete().neq('id', -1),
        supabase.from('bio_links').delete().neq('id', -1),
        supabase.from('products').delete().neq('id', -1),
        // FIX: Add 'plans' to the list of tables to clear during seeding.
        supabase.from('plans').delete().neq('id', -1),
        supabase.from('shopee_products').delete().neq('id', -1),
        supabase.from('feedbacks').delete().neq('id', -1),
      ]);
      const deleteError = results.map(r => r.error).find(Boolean);
      if (deleteError) throw deleteError;
      console.log("[Seed DB]: Dados existentes deletados.");

      // Insere Conteúdo do Site
      await supabase.from('site_content').insert([
        { id: 1, key: 'site_content_pt', content: SITE_CONTENT_DATA_PT },
        { id: 2, key: 'site_content_en', content: SITE_CONTENT_DATA_EN },
      ]);

      // Insere Ferramentas
      const allToolsForInsert = [
        ...FREEMIUM_TOOLS_PT.map(t => ({...t, lang: 'pt', type: 'freemium'})),
        ...PREMIUM_TOOLS_PT.map(t => ({...t, lang: 'pt', type: 'premium'})),
        ...FREEMIUM_TOOLS_EN.map(t => ({...t, lang: 'en', type: 'freemium'})),
        ...PREMIUM_TOOLS_EN.map(t => ({...t, lang: 'en', type: 'premium'})),
      ].map(tool => ({
          lang: tool.lang, 
          name: tool.name, 
          icon: tool.icon, 
          type: tool.type, 
          learn_more_url: tool.learnMoreUrl || null, 
          description: tool.description || null, 
          benefits: tool.benefits || null,
          category: tool.category || null,
      }));
      await supabase.from('tools').insert(allToolsForInsert);

      // Insere Leads
      const leadsForInsert = LEADS_DATA.map(lead => ({
        name: lead.name,
        email: lead.email,
        whatsapp: lead.whatsapp || null,
        tool_of_interest: lead.toolOfInterest,
        status: lead.status,
        notes: lead.notes || null,
        source_plan: lead.sourcePlan || null,
        date: new Date(lead.date).toISOString(),
      }));
      await supabase.from('leads').insert(leadsForInsert);

       // Insere Bio Links
       const bioLinksInsert = MOCK_BIO_LINKS.map(link => ({
         title: link.title,
         image_url: link.image_url,
         destination_url: link.destination_url,
         category: link.category,
         order: link.order,
         active: link.active,
         description: link.description,
       }));
       await supabase.from('bio_links').insert(bioLinksInsert);
       
       // Insere Produtos
       const productsInsert = INITIAL_PRODUCTS.map(({ id, ...rest }) => rest);
       await supabase.from('products').insert(productsInsert);
       
       // Insere Produtos Shopee
       const shopeeInsert = INITIAL_SHOPEE_PRODUCTS.map(({ id, ...rest }) => rest);
       await supabase.from('shopee_products').insert(shopeeInsert);

       // Insere Planos (vazio por padrão)
       if (INITIAL_PLANS.length > 0) {
           const plansInsert = INITIAL_PLANS.map(({ id, ...rest }) => ({...rest, is_popular: rest.isPopular, tool_id: rest.toolId}));
           await supabase.from('plans').insert(plansInsert);
       }

      console.log("✅ [Seed DB]: Migração de dados concluída!");
    } catch (error) {
      handleError(error, 'Seed Database');
      throw new Error('Falha ao migrar banco de dados.');
    }
  },
};