
export const MAIN_LOGO_SVG = `<svg id="Camada_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444.3 421.7"><path fill="#e52920" d="M424 378.4l-63.1-111.6c-3.4-6-9.8-9.7-16.7-9.7h-100v32h-50.2v-32h-98.9c-6.9 0-13.3 3.7-16.7 9.7l-63.1 111.6c-7.2 12.8 2 28.6 16.7 28.6h100.3c6.9 0 13.3-3.7 16.7-9.7l37.4-66.1c3.4-6 9.7-9.7 16.6-9.7h33.1c6.9 0 13.3 3.6 16.7 9.7l37.4 66.2c3.4 6 9.8 9.7 16.7 9.7h100.3c14.7 0 23.9-15.8 16.7-28.6zm-305.5-142.4h75.5v-23.9c-13.4-8.4-22.3-23.2-22.3-40.2 0-26.2 21.2-47.4 47.4-47.4s47.4 21.2 47.4 47.4-8.9 31.8-22.3 40.2v23.9h75.5c10.2 0 16.7-10.8 11.9-19.8L232.4 31.2c-5.1-9.5-18.7-9.6-23.9-.1L106.6 216.2c-4.9 9 1.5 19.9 11.9 19.8z"/></svg>`;

// --- Language-independent Data ---
export const CONTACT_PHOTO_URL = "https://i.imgur.com/MaoShGg.jpeg";

// Social Links Centralization
export const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/fabiorodriguesdsgn/",
    instagram_secondary: "https://www.instagram.com/fabiodicastop/",
    website: "https://fabiorodriguesdesign.com/",
    website_br: "https://fabiorodriguesdesign.com.br/",
    youtube: "https://www.youtube.com/@fabiorodriguesdesign",
    whatsapp: "https://wa.me/5514988386852",
    whatsapp_group: "https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV",
    briefing: "https://briefing.fabiorodriguesdesign.com.br/",
    portfolio_behance: "https://www.behance.net/fabiorojdrigues",
    blog_design: "https://fabiorodriguesdesign.com/category/blog/criatividade-e-design/",
    blog_motivation: "https://fabiorodriguesdesign.com/category/blog/motivacao/",
    ko_fi: "https://ko-fi.com/fabiorodriguesdsgn"
};

// Shortcut Routes Configuration
export const SHORTCUT_ROUTES: Record<string, { app: 'media-tools' | 'kit-freelancer', tool: string }> = {
    // Media Tools Shortcuts
    '#/svg4code': { app: 'media-tools', tool: 'svg-to-code' },
    '#/img2svg': { app: 'media-tools', tool: 'img-to-svg' },
    '#/remove-bg': { app: 'media-tools', tool: 'background' },
    '#/compress': { app: 'media-tools', tool: 'optimizer' },
    '#/convert': { app: 'media-tools', tool: 'converter' },
    '#/zip': { app: 'media-tools', tool: 'zipper' },
    '#/rename': { app: 'media-tools', tool: 'renamer' },
    '#/watermark': { app: 'media-tools', tool: 'watermark' },
    '#/palette': { app: 'media-tools', tool: 'palette' },
    
    // Kit Freelancer Shortcuts
    '#/resume': { app: 'kit-freelancer', tool: 'resume-builder' },
    '#/cv': { app: 'kit-freelancer', tool: 'resume-builder' },
    '#/quote': { app: 'kit-freelancer', tool: 'proposal-builder' },
    '#/proposal': { app: 'kit-freelancer', tool: 'proposal-builder' },
    '#/receipt': { app: 'kit-freelancer', tool: 'receipt-generator' },
    '#/pix': { app: 'kit-freelancer', tool: 'qr-code-generator' },
    '#/whatsapp': { app: 'kit-freelancer', tool: 'whatsapp-generator' },
    '#/calc': { app: 'kit-freelancer', tool: 'price-calculator' },
    '#/taxes': { app: 'kit-freelancer', tool: 'tax-calculator' },
    '#/invest': { app: 'kit-freelancer', tool: 'investment-tax' },
    '#/interest': { app: 'kit-freelancer', tool: 'compound-interest' },
    '#/currency': { app: 'kit-freelancer', tool: 'currency-converter' },
    '#/goals': { app: 'kit-freelancer', tool: 'smart-goals' },
    '#/units': { app: 'kit-freelancer', tool: 'unit-converter' },
};
