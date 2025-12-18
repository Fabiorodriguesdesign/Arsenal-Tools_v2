import { IAppSupabaseClient } from '../types';

/**
 * Cria o cliente do Supabase dinamicamente.
 * Prioriza o cliente real se as chaves estiverem presentes no ambiente.
 */
const createDynamicClient = async (): Promise<IAppSupabaseClient> => {
    // Detecta o ambiente (Vite utiliza import.meta.env, Node/outros utilizam process.env)
    // @ts-ignore
    const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env);

    // Tenta capturar as chaves com e sem o prefixo VITE_ para máxima compatibilidade
    const supabaseUrl = env?.VITE_SUPABASE_URL || env?.SUPABASE_URL;
    const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || env?.SUPABASE_ANON_KEY;

    // Verifica se as chaves são válidas (não vazias e não a string "undefined")
    const hasRealKeys = supabaseUrl && 
                        supabaseAnonKey && 
                        supabaseUrl !== 'undefined' && 
                        supabaseAnonKey !== 'undefined' &&
                        supabaseUrl.startsWith('http');

    if (hasRealKeys) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const realClient = createClient(supabaseUrl, supabaseAnonKey);
            
            // Força a tipagem e define que NÃO é um stub
            const typedClient = realClient as IAppSupabaseClient;
            typedClient.isStub = false;
            
            console.log("✅ Supabase: Cliente real inicializado.");
            return typedClient;
        } catch (err) {
            console.error("❌ Erro ao inicializar cliente real do Supabase:", err);
        }
    }

    // Fallback para o Mock caso não existam chaves ou ocorra erro
    console.warn("⚠️ Supabase: Chaves não encontradas ou inválidas. Ativando modo MOCK (Simulação).");
    const { supabaseMockClient } = await import('./supabaseMock');
    return supabaseMockClient;
};

// Exporta a promessa única para ser aguardada pela aplicação
export const supabasePromise = createDynamicClient();