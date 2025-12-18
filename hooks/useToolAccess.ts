
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tool } from '../types';

interface UseToolAccessResult {
    hasAccess: boolean;
    isLocked: boolean;
    tierRequired: string;
}

export const useToolAccess = () => {
    const { tier } = useAuth();

    const checkAccess = useCallback((tool: Tool): UseToolAccessResult => {
        // Ferramentas Freemium: Acesso para todos
        if (tool.type === 'freemium') {
            return { hasAccess: true, isLocked: false, tierRequired: 'Free' };
        }

        // Ferramentas Premium:
        // Admin e Pro têm acesso
        if (tier === 'admin' || tier === 'pro') {
            return { hasAccess: true, isLocked: false, tierRequired: 'Pro' };
        }

        // Usuário Free tentando acessar Premium
        return { hasAccess: false, isLocked: true, tierRequired: 'Pro' };
    }, [tier]);

    return { checkAccess };
};
