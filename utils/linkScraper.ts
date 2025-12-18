/**
 * Utilitário para extrair metadados (Open Graph, JSON-LD, Prices) de URLs externas.
 * Utiliza um proxy público (AllOrigins) para contornar restrições de CORS no navegador.
 */

export interface ScrapedData {
    title?: string;
    description?: string;
    image?: string;
    price?: number;
    currency?: string;
}

export const scrapeUrlMetadata = async (url: string): Promise<ScrapedData | null> => {
    if (!url || !url.startsWith('http')) {
        throw new Error("URL inválida ou incompleta.");
    }

    try {
        const encodedUrl = encodeURIComponent(url);
        // Proxy com cache busting para evitar bloqueios de repetibilidade
        const proxyUrl = `https://api.allorigins.win/get?url=${encodedUrl}&_=${Date.now()}`;

        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`O serviço de importação está temporariamente indisponível (CORS Proxy).`);
        }

        const data = await response.json();
        
        if (!data.contents) {
            throw new Error("Não foi possível ler o conteúdo deste link.");
        }

        const html = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Extração Básica (Open Graph)
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        
        // 2. Extração de Preços
        let priceStr = 
            doc.querySelector('meta[property="product:price:amount"]')?.getAttribute('content') ||
            doc.querySelector('meta[property="og:price:amount"]')?.getAttribute('content') ||
            doc.querySelector('meta[name="price"]')?.getAttribute('content');

        let currency = 
            doc.querySelector('meta[property="product:price:currency"]')?.getAttribute('content') ||
            doc.querySelector('meta[property="og:price:currency"]')?.getAttribute('content') ||
            'BRL';

        // 3. Extração Avançada (JSON-LD)
        if (!priceStr) {
            const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                try {
                    const json = JSON.parse(script.textContent || '{}');
                    const offers = json.offers || (Array.isArray(json) ? json.find((i: any) => i['@type'] === 'Product')?.offers : null);
                    
                    if (offers) {
                        const offer = Array.isArray(offers) ? offers[0] : offers;
                        if (offer && (offer.price || offer.lowPrice)) {
                            priceStr = offer.price || offer.lowPrice;
                            currency = offer.priceCurrency || currency;
                            break;
                        }
                    }
                } catch (e) { continue; }
            }
        }
        
        const title = ogTitle || doc.title;
        const description = ogDescription || doc.querySelector('meta[name="description"]')?.getAttribute('content');
        
        let image = ogImage;
        if (!image) {
            const firstImg = doc.querySelector('img[id*="product"]')?.getAttribute('src') || doc.querySelector('img')?.getAttribute('src');
            if (firstImg) {
                try { image = new URL(firstImg, url).toString(); } catch { image = firstImg; }
            }
        }

        let price = 0;
        if (priceStr) {
            const cleanPrice = priceStr.toString().replace(/[^0-9.,]/g, '').replace(',', '.');
            price = parseFloat(cleanPrice);
        }

        return {
            title: title?.trim(),
            description: description?.trim(),
            image: image?.trim(),
            price: isNaN(price) ? 0 : price,
            currency
        };

    } catch (error) {
        console.error("Scraper Error:", error);
        // Mensagem específica para erro de rede/CORS
        throw new Error("A Shopee bloqueou o preenchimento automático para este link. Por favor, insira os dados manualmente.");
    }
};