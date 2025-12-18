
export interface ShopeeProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating: number;
    soldCount: number;
    affiliateLink: string;
    discount?: number;
    category: string;
}

export interface ShopeeCategory {
    id: string;
    name: string;
    icon?: string;
}
