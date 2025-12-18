
import { BioLink } from '../types';

export const MOCK_BIO_LINKS: BioLink[] = [
    // --- Links Design (@fabiorodriguesdsgn) ---
    {
        id: 4,
        title: 'PSDs Grátis',
        titleKey: 'bio.psd.title',
        image_url: 'file-code',
        destination_url: '#/store?search=PSD', // Link Interno para Loja
        category: 'design',
        order: 1,
        active: true,
        description: 'Acesse nossa loja exclusiva e baixe arquivos PSD editáveis gratuitamente.',
        descriptionKey: 'bio.psd.description'
    },
    {
        id: 3,
        title: 'Pack\'s Design',
        titleKey: 'bio.pack.title',
        image_url: 'layers',
        destination_url: '#/store?search=Pack', // Link Interno para Loja
        category: 'design',
        order: 2,
        active: true,
        description: 'Coleção completa de designs criativos e editáveis para agilizar sua criação.',
        descriptionKey: 'bio.pack.description'
    },
    {
        id: 1,
        title: 'Portfólio Behance',
        titleKey: 'bio.behance.title',
        image_url: 'behance-icon',
        destination_url: 'https://www.behance.net/fabiorojdrigues', // URL Atualizada
        category: 'design',
        order: 3,
        active: true,
        description: 'Confira meus estudos de caso de Identidade Visual e Web Design.',
        descriptionKey: 'bio.behance.description'
    },
    {
        id: 101, 
        title: 'Ebook Pack\'s Lucrativos',
        titleKey: 'bio.ebook_lucrativo.title',
        image_url: 'ebook-lucrativo', 
        destination_url: '#/store?search=Lucrativo', // Link Interno para Loja
        category: 'design',
        order: 4,
        active: true,
        description: 'Aprenda a transformar design em renda passiva e escalável.',
        descriptionKey: 'bio.ebook_lucrativo.description'
    },
    {
        id: 2,
        title: 'Blog Design e Inovação',
        titleKey: 'bio.blog_design.title',
        image_url: 'globe', 
        destination_url: 'https://fabiorodriguesdesign.com/category/blog/criatividade-e-design/', // URL Atualizada
        category: 'design',
        order: 5,
        active: true,
        description: 'Artigos profundos sobre Design, Criatividade e tendências visuais.',
        descriptionKey: 'bio.blog_design.description'
    },
    {
        id: 102,
        title: 'Grupo do Whatsapp',
        titleKey: 'bio.whatsapp.title',
        image_url: 'whatsapp',
        destination_url: 'https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV',
        category: 'design',
        order: 6,
        active: true,
        description: 'Networking VIP, vagas e conteúdos exclusivos para designers.',
        descriptionKey: 'bio.whatsapp.description'
    },

    // --- Links Marketing (@fabiodicastop) ---
    {
        id: 8,
        title: 'Deus e Bíblia',
        titleKey: 'bio.biblia.title',
        image_url: 'book', 
        destination_url: '#/store?search=Bíblia', // Link interno ativado
        category: 'marketing',
        order: 1,
        active: true,
        description: 'Ebooks inspiradores para fortalecer a mente e transformar sua vida.',
        descriptionKey: 'bio.biblia.description'
    },
    {
        id: 103,
        title: 'Shopee Achados',
        titleKey: 'bio.shopee.title',
        image_url: 'shopping-cart',
        destination_url: '#/app/shopee-finder',
        category: 'marketing',
        order: 2,
        active: true,
        description: 'Curadoria dos melhores produtos e ofertas da Shopee para você.',
        descriptionKey: 'bio.shopee.description'
    },
    {
        id: 9,
        title: 'Atividades Bíblicas',
        titleKey: 'bio.atividades.title',
        image_url: 'sparkles', 
        destination_url: '#/store?search=Atividades', // Link Interno para Loja
        category: 'marketing',
        order: 3,
        active: true,
        description: 'Materiais educativos completos para crianças aprenderem sobre Deus.',
        descriptionKey: 'bio.atividades.description'
    },
    {
        id: 10,
        title: 'Renda Extra',
        titleKey: 'bio.renda.title',
        image_url: 'chart-bar', 
        destination_url: '#/store?search=Renda', // Link Interno para Loja
        category: 'marketing',
        order: 4,
        active: true,
        description: 'Guia definitivo com estratégias validadas para lucrar na internet.',
        descriptionKey: 'bio.renda.description'
    },
    {
        id: 13,
        title: 'Fé, Deus e Bíblia',
        titleKey: 'bio.blog_fe.title',
        image_url: 'globe', 
        destination_url: 'https://fabiorodriguesdesign.com/category/blog/motivacao/', // URL Atualizada
        category: 'marketing',
        order: 5,
        active: true,
        description: 'Artigos e reflexões diárias para motivar sua caminhada de fé.',
        descriptionKey: 'bio.blog_fe.description'
    }
];
