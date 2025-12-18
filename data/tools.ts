
import { Tool } from '../types';

// This file now only serves as a seed for *external* or *dynamic* tools managed via the Admin Panel.
// Internal apps (Kit Freelancer, Media Tools, etc.) are now hardcoded in data/internal_tools.ts
// to prevent them from being edited/deleted in the Admin Dashboard.

export const FREEMIUM_TOOLS_PT: Omit<Tool, 'id' | 'type'>[] = [
    // Add external tools here if needed in the future
];

export const PREMIUM_TOOLS_PT: Omit<Tool, 'id' | 'type'>[] = [
    // Add external premium tools here if needed
];

export const FREEMIUM_TOOLS_EN: Omit<Tool, 'id' | 'type'>[] = [];

export const PREMIUM_TOOLS_EN: Omit<Tool, 'id' | 'type'>[] = [];
