
import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        title: "Pack Designer Premium",
        description: "Mais de 1000 arquivos editáveis para social media. Photoshop e Canva.",
        price: 47.90,
        oldPrice: 97.00,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-4.jpg?raw=true", 
        purchaseUrl: "https://fabiorodriguesdesign.com.br/pack",
        category: "design",
        isFeatured: true,
        badge: "Mais Vendido",
        active: true
    },
    {
        id: 2,
        title: "Ebook: Marketing para Designers",
        description: "Aprenda a vender seus serviços e conquistar clientes high-ticket.",
        price: 29.90,
        oldPrice: 59.90,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/CARROSSEL-VERT-dia-do-consumidor-01.jpg?raw=true", 
        purchaseUrl: "https://fabiorodriguesdesign.com.br/ebook-marketing",
        category: "marketing",
        isFeatured: false,
        active: true
    },
    {
        id: 3,
        title: "Mentoria Individual",
        description: "1 hora de consultoria via Google Meet para destravar sua carreira.",
        price: 150.00,
        coverUrl: "https://i.imgur.com/MaoShGg.jpeg", 
        purchaseUrl: "https://wa.me/5514988386852",
        category: "produtividade",
        isFeatured: true,
        badge: "Vagas Limitadas",
        active: true
    },
    {
        id: 4,
        title: "Guia Renda Extra Online",
        description: "Guia completo com 50 formas de fazer dinheiro na internet em 2025.",
        price: 19.90,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Carrossel-Vertical-Dia-das-M%C3%A3es-_3.jpg?raw=true",
        purchaseUrl: "https://rendaextra.com",
        category: "marketing",
        isFeatured: false,
        active: true
    },
    // Novos Produtos Específicos para os Banners
    {
        id: 5,
        title: "Coleção Deus e Bíblia",
        description: "Ebooks inspiradores que ensinam, com fé e esperança, como superar crises e transformar sua vida.",
        price: 24.90,
        oldPrice: 49.90,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Feed-Biblia-Livro-Exodo-13.jpg?raw=true", 
        purchaseUrl: "https://deusebiblia.com.br",
        category: "marketing",
        isFeatured: true,
        badge: "Lançamento",
        active: true
    },
    {
        id: 6,
        title: "Kit Atividades Bíblicas",
        description: "Material educativo, vídeos e músicas para crianças aprenderem sobre Deus e a Bíblia.",
        price: 37.00,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Feed-Biblia-Livro-Exodo-14.jpg?raw=true",
        purchaseUrl: "https://atividadesbiblicas.com",
        category: "marketing",
        isFeatured: false,
        badge: "Kids",
        active: true
    },
    {
        id: 7,
        title: "Pack Lucrativo: Artes Prontas",
        description: "Transforme templates em renda recorrente. Modelos de alta conversão.",
        price: 57.90,
        oldPrice: 119.00,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-5.jpg?raw=true",
        purchaseUrl: "https://fabiorodriguesdesign.com.br/ebook-packs-lucrativos",
        category: "design",
        isFeatured: true,
        active: true
    },
    {
        id: 8,
        title: "PSD Grátis: Social Media",
        description: "Arquivo editável profissional para você testar a qualidade dos nossos packs.",
        price: 0.00,
        coverUrl: "https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/OpsAqui/Arts/Story-Feliz-Natal-Boa-Festas-25-de-Dezembro-Social-Media-PSD-Edit%C3%A1vel-6.jpg?raw=true",
        purchaseUrl: "https://fabiorodriguesdesign.com.br/freebies",
        category: "design",
        isFeatured: false,
        badge: "Grátis",
        active: true
    }
];