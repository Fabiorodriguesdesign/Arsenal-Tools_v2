
import React from 'react';

export type TabId = 
  | 'price-calculator'
  | 'tax-calculator'
  | 'whatsapp-generator'
  | 'compound-interest'
  | 'unit-converter'
  | 'qr-code-generator'
  | 'currency-converter'
  | 'investment-tax'
  | 'smart-goals'
  | 'social-engagement'
  | 'resume-builder'
  | 'proposal-builder'
  | 'receipt-generator'
  | 'settings';

export interface Tab {
  id: TabId;
  nameKey: string;
  icon: React.ReactNode;
  // Fix: Update the component type to allow an optional `setActiveTab` prop.
  // This resolves a type error in App.tsx where this prop is passed to all tab components.
  component: React.ComponentType<{ setActiveTab?: (id: TabId) => void }>;
}

export interface TabCategory {
  nameKey: string;
  items: Tab[];
}