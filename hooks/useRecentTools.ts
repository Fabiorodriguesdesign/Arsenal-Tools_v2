
import { useState, useCallback, useEffect } from 'react';

const MAX_RECENT_TOOLS = 6;
const STORAGE_KEY = 'arsenal_recent_tools';

export interface RecentToolItem {
  toolId: string;
  appId: 'kit-freelancer' | 'media-tools' | 'shopee-finder';
  timestamp: number;
}

export const useRecentTools = () => {
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>([]);

  useEffect(() => {
    // Carregar inicial
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentTools(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erro ao carregar histórico", e);
    }
  }, []);

  const addRecentTool = useCallback((toolId: string, appId: 'kit-freelancer' | 'media-tools' | 'shopee-finder') => {
    setRecentTools(prev => {
      // Remove se já existir para mover para o topo
      const filtered = prev.filter(item => item.toolId !== toolId);
      
      const newItem: RecentToolItem = {
        toolId,
        appId,
        timestamp: Date.now()
      };

      const newHistory = [newItem, ...filtered].slice(0, MAX_RECENT_TOOLS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
      setRecentTools([]);
      localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { recentTools, addRecentTool, clearHistory };
};
