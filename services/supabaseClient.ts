typescript
// D:/Arquivos/PROJETOS/00 - GitHub/00-Arsenal-Tools/2025-12-17-Arsenal_Tools_AI.Studio/services/supabaseClient.ts

// Linha 4 (original): CORREÇÃO AQUI - Caminho ajustado para './types' para '../types'
import { IAppSupabaseClient } from '../types'; 

// Define uma interface comum para nosso cliente (real ou mock)
// para ajudar na segurança de tipos em toda a aplicação.
// A interface IAppSupabaseClient foi movida para types.ts para quebrar uma dependência circular.
// entre supabaseClient.ts e services/supabaseMock.ts. Isso garante que
// o tipo de cliente Supabase seja resolvido corretamente em todo o aplicativo.

const createDynamicClient = async (): Promise<IAppSupabaseClient> => {
    // Acessa variáveis de ambiente de forma segura, compatível com Vite (`import.meta.env`)
    // e outros ambientes como o AI Studio (`process.env`).
    // @ts-ignore
    const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env);

    const supabaseUrl = env?.VITE_SUPABASE_URL;
    const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const realClient = createClient(supabaseUrl, supabaseAnonKey);
        // Adiciona a propriedade isStub para consistência
        (realClient as IAppSupabaseClient).isStub = false;
        return realClient as IAppSupabaseClient;
    } else {
        // Linha 24 (original): Já corrigido anteriormente
        const { supabaseMockClient } = await import('./supabaseMock');
        return supabaseMockClient;
    }
};

// Exporta a promessa que resolverá para o cliente inicializado.
// O resto da aplicação irá aguardar (await) esta promessa.
export const supabasePromise = createDynamicClient();