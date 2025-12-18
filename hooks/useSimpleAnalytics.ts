
import { useEffect } from 'react';

export const useSimpleAnalytics = () => {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const visitsKey = `visits_${today}`;
    const lastVisitKey = 'last_visit_timestamp';
    
    const lastVisit = localStorage.getItem(lastVisitKey);
    const now = Date.now();

    // Conta visita apenas se passou 1 hora desde a última ou se é a primeira vez
    if (!lastVisit || now - parseInt(lastVisit) > 3600000) {
        const currentVisits = parseInt(localStorage.getItem(visitsKey) || '0');
        localStorage.setItem(visitsKey, (currentVisits + 1).toString());
        localStorage.setItem(lastVisitKey, now.toString());
    }
  }, []);
};
