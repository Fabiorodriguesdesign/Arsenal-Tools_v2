
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Tool, NewTool } from '../types';
import { INTERNAL_TOOLS_PT, INTERNAL_TOOLS_EN } from '../data/internal_tools'; // Importa todas as ferramentas internas
import { useLanguage } from './LanguageContext';
import { SupabaseService } from '../services/supabaseService';
import { handleError } from '../utils/errorHandler';

interface ToolContextType {
  allTools: Tool[];
  tools: Tool[];
  freemiumTools: Tool[];
  premiumTools: Tool[];
  isLoading: boolean;
  error: Error | null;
  handleAddTool: (newToolData: NewTool) => Promise<void>;
  handleUpdateTool: (updatedTool: Tool) => Promise<void>;
  handleDeleteTool: (toolId: string | number) => Promise<void>;
  refetchTools: () => Promise<void>;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { language } = useLanguage();

    const refetchTools = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        // 1. Carrega ferramentas internas
        const baseInternalTools = language === 'pt' ? INTERNAL_TOOLS_PT : INTERNAL_TOOLS_EN;
        
        try {
            // 2. Busca ferramentas do Supabase
            const toolsFromDb = await SupabaseService.getTools();

            if (toolsFromDb && toolsFromDb.length > 0) {
                // Conjunto para rastrear quais ferramentas do DB foram usadas para sobrescrever internas
                const usedDbIds = new Set<string | number>();

                // 3. Mescla Inteligente:
                // Itera sobre as ferramentas internas e verifica se existe uma correspondente no DB
                // A correspondência é feita por ID (se igual) OU por internalRoute (para ligar string-id com number-id)
                const mergedTools = baseInternalTools.map(internalTool => {
                    const dbMatch = toolsFromDb.find(dbTool => {
                        // Match por ID exato
                        if (dbTool.id === internalTool.id) return true;
                        // Match por Rota Interna (Ex: 'psd-generator' string vs 15 number, mas mesma rota)
                        if (internalTool.internalRoute && dbTool.internalRoute === internalTool.internalRoute) return true;
                        return false;
                    });

                    if (dbMatch) {
                        usedDbIds.add(dbMatch.id);
                        // Retorna a ferramenta do DB (com dados atualizados pelo admin), 
                        // mas garante que propriedades críticas de sistema (como o componente React) sejam preservadas se necessário.
                        // Aqui, sobrescrevemos tudo com o DB, exceto se quiséssemos forçar ícones locais.
                        return { ...internalTool, ...dbMatch }; 
                    }
                    return internalTool;
                });

                // 4. Adiciona ferramentas do DB que são NOVAS (não existem no hardcode)
                // Ex: Ferramentas externas adicionadas pelo painel admin
                const newDbTools = toolsFromDb.filter(dbTool => !usedDbIds.has(dbTool.id));
                
                setAllTools([...mergedTools, ...newDbTools]);
            } else {
                setAllTools(baseInternalTools);
            }

        } catch (fetchError) {
            console.error("Erro ao buscar tools:", fetchError);
            // Fallback: Apenas ferramentas internas em caso de erro crítico no DB
            setAllTools(baseInternalTools);
        } finally {
            setIsLoading(false);
        }
    }, [language]);

    useEffect(() => {
        refetchTools();
    }, [refetchTools]);

    const handleAddTool = useCallback(async (newToolData: NewTool) => {
        try {
            const addedTool = await SupabaseService.addTool(newToolData);
            if(addedTool) {
               setAllTools(prevTools => [...prevTools, addedTool]);
            }
        } catch (error) {
            handleError(error, 'Add Tool Context');
            throw error;
        }
    }, []);

    const handleUpdateTool = useCallback(async (updatedTool: Tool) => {
        try {
            // Apenas ferramentas com ID numérico (do DB) podem ser atualizadas via API
            if (typeof updatedTool.id === 'number') {
                const returnedTool = await SupabaseService.updateTool(updatedTool);
                if(returnedTool){
                    setAllTools(prevTools => prevTools.map(tool => tool.id === returnedTool.id ? returnedTool : tool));
                }
            } else {
                // Tentar atualizar uma ferramenta hardcoded que ainda não está no DB?
                // Na prática, a ferramenta interna é substituída pela versão do DB na próxima carga.
                console.warn("Tentativa de atualizar ferramenta interna sem persistência direta.");
            }
        } catch (error) {
            handleError(error, 'Update Tool Context');
            throw error;
        }
    }, []);

    const handleDeleteTool = useCallback(async (toolId: string | number) => {
        try {
            if (typeof toolId === 'number') {
                await SupabaseService.deleteTool(toolId);
                setAllTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
            } else {
                 throw new Error("Ferramentas internas não podem ser deletadas permanentemente.");
            }
        } catch (error) {
            handleError(error, 'Delete Tool Context');
            throw error;
        }
    }, []);
    
    // Filtros
    const tools = useMemo(() => allTools.filter(tool => tool.lang === language), [allTools, language]);
    const freemiumTools = useMemo(() => tools.filter(t => t.type === 'freemium'), [tools]);
    const premiumTools = useMemo(() => tools.filter(t => t.type === 'premium'), [tools]);

    const value = {
        allTools,
        tools,
        freemiumTools,
        premiumTools,
        isLoading,
        error,
        handleAddTool,
        handleUpdateTool,
        handleDeleteTool,
        refetchTools 
    };

    return (
        <ToolContext.Provider value={value}>
            {children}
        </ToolContext.Provider>
    );
};

export const useTools = (): ToolContextType => {
    const context = useContext(ToolContext);
    if (!context) {
        throw new Error('useTools deve ser usado dentro de um ToolProvider');
    }
    return context;
};
