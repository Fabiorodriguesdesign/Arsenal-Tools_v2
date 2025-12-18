
import { Tool } from '../../types';

export const mediaToolsPt: Tool[] = [
    { 
        id: 'elementor-cropp',
        lang: 'pt',
        type: 'freemium',
        name: 'Elementor Cropp', 
        icon: 'elementor-cropp', 
        description: 'Padronize imagens em lote: recorte automático (trim), ajuste de margem e redimensionamento perfeito para web.', 
        internalRoute: '/app/media-tools?tool=elementor-cropp', 
        category: 'category.imageEditing' 
    },
    { 
        id: 'background',
        lang: 'pt',
        type: 'freemium',
        name: 'Background Master', 
        icon: 'background-master', 
        description: 'Adicione fundos profissionais a múltiplas imagens transparentes de uma só vez.', 
        internalRoute: '/app/media-tools?tool=background', 
        category: 'category.utilities' 
    },
    { 
        id: 'psd-generator',
        lang: 'pt',
        type: 'freemium',
        name: 'Gerador PSD', 
        icon: 'psd-generator', 
        description: 'Crie arquivos PSD com camadas automaticamente combinando uma imagem principal e um fundo.', 
        internalRoute: '/app/media-tools?tool=psd-generator', 
        category: 'category.utilities' 
    },
     { 
        id: 'svg-to-code',
        lang: 'pt',
        type: 'freemium',
        name: 'SVG 4 Code', 
        icon: 'code-bracket', 
        description: 'Otimize e converta SVGs para componentes React/TSX prontos para uso.', 
        internalRoute: '/app/media-tools?tool=svg-to-code', 
        category: 'category.utilities' 
    },
    { 
        id: 'img-to-svg',
        lang: 'pt',
        type: 'freemium',
        name: 'IMG 4 SVG', 
        icon: 'img-to-svg', 
        description: 'Converta imagens raster (PNG, JPG) em arquivos SVG vetoriais diretamente no navegador.', 
        internalRoute: '/app/media-tools?tool=img-to-svg', 
        category: 'category.utilities' 
    },
    { 
        id: 'img-to-webp',
        lang: 'pt',
        type: 'freemium',
        name: 'IMG 4 WEBP', 
        icon: 'img-to-webp', 
        description: 'Converta e otimize imagens para o formato WebP ultra-leve.', 
        internalRoute: '/app/media-tools?tool=img-to-webp', 
        category: 'category.utilities' 
    },
    { 
        id: 'audio-converter',
        lang: 'pt',
        type: 'freemium',
        name: 'Conversor de Áudio', 
        icon: 'audio-converter', 
        description: 'Conversão rápida de arquivos MP3, WAV e OGG diretamente no navegador.', 
        internalRoute: '/app/media-tools?tool=audio-converter', 
        category: 'category.utilities' 
    },
    { 
        id: 'zipper',
        lang: 'pt',
        type: 'freemium',
        name: 'Gerador Zip', 
        icon: 'zipper', 
        description: 'Agrupe arquivos em ZIPs ou zipe arquivos únicos. Extrai tags SEO automaticamente.', 
        internalRoute: '/app/media-tools?tool=zipper', 
        category: 'category.utilities' 
    },
    { 
        id: 'renamer',
        lang: 'pt',
        type: 'freemium',
        name: 'Renomeador em Lote', 
        icon: 'renamer', 
        description: 'Renomeie centenas de arquivos sequencialmente em segundos.', 
        internalRoute: '/app/media-tools?tool=renamer', 
        category: 'category.utilities' 
    },
    { 
        id: 'optimizer',
        lang: 'pt',
        type: 'freemium',
        name: 'Otimizador de Imagens', 
        icon: 'optimizer', 
        description: 'Comprima e redimensione imagens (JPG, PNG, WebP) sem perder qualidade.', 
        internalRoute: '/app/media-tools?tool=optimizer', 
        category: 'category.utilities' 
    },
    { 
        id: 'converter',
        lang: 'pt',
        type: 'freemium',
        name: 'Conversor de Imagens', 
        icon: 'converter', 
        description: 'Converta formatos de imagem em lote (ex: WebP para JPG, PNG para AVIF).', 
        internalRoute: '/app/media-tools?tool=converter', 
        category: 'category.utilities' 
    },
    { 
        id: 'watermark',
        lang: 'pt',
        type: 'freemium',
        name: 'Marca d\'Água', 
        icon: 'bubbles', 
        description: 'Proteja suas imagens aplicando logotipos ou textos como marca d\'água em lote.', 
        internalRoute: '/app/media-tools?tool=watermark', 
        category: 'category.utilities' 
    },
    { 
        id: 'palette',
        lang: 'pt',
        type: 'freemium',
        name: 'Gerador de Paletas', 
        icon: 'palette-generator', 
        description: 'Extraia as cores principais de qualquer imagem e crie paletas harmônicas.', 
        internalRoute: '/app/media-tools?tool=palette', 
        category: 'category.utilities' 
    }
];

export const mediaToolsEn: Tool[] = [
  { 
      id: 'elementor-cropp',
      lang: 'en',
      type: 'freemium',
      name: 'Elementor Cropp', 
      icon: 'elementor-cropp', 
      description: 'Batch standardize images: auto trim, precise margin control, and smart resizing.', 
      internalRoute: '/app/media-tools?tool=elementor-cropp', 
      category: 'category.imageEditing' 
  },
  { 
      id: 'background', 
      lang: 'en',
      type: 'freemium',
      name: 'Background Master', 
      icon: 'background-master', 
      description: 'Add professional backgrounds to multiple transparent images at once.', 
      internalRoute: '/app/media-tools?tool=background', 
      category: 'category.utilities' 
  },
  { 
      id: 'psd-generator', 
      lang: 'en',
      type: 'freemium',
      name: 'PSD Generator', 
      icon: 'psd-generator', 
      description: 'Create layered PSD files automatically combining a main image and a background.', 
      internalRoute: '/app/media-tools?tool=psd-generator', 
      category: 'category.utilities' 
  },
  { 
      id: 'svg-to-code', 
      lang: 'en',
      type: 'freemium',
      name: 'SVG 4 Code', 
      icon: 'code-bracket', 
      description: 'Optimize and convert SVGs into ready-to-use React/TSX components.', 
      internalRoute: '/app/media-tools?tool=svg-to-code', 
      category: 'category.utilities' 
  },
  { 
      id: 'img-to-svg', 
      lang: 'en',
      type: 'freemium',
      name: 'IMG 4 SVG', 
      icon: 'img-to-svg', 
      description: 'Convert raster images (PNG, JPG) into vector SVG files directly in the browser.', 
      internalRoute: '/app/media-tools?tool=img-to-svg', 
      category: 'category.utilities' 
  },
  { 
      id: 'img-to-webp', 
      lang: 'en',
      type: 'freemium',
      name: 'IMG 4 WEBP', 
      icon: 'img-to-webp', 
      description: 'Convert and optimize images to highly optimized WebP format for superior web performance.', 
      internalRoute: '/app/media-tools?tool=img-to-webp', 
      category: 'category.utilities' 
  },
  { 
      id: 'audio-converter', 
      lang: 'en',
      type: 'freemium',
      name: 'Audio Converter', 
      icon: 'audio-converter', 
      description: 'Convert audio files (MP3, WAV, OGG) directly in your browser.', 
      internalRoute: '/app/media-tools?tool=audio-converter', 
      category: 'category.utilities' 
  },
  { 
      id: 'zipper', 
      lang: 'en',
      type: 'freemium',
      name: 'File Zipper', 
      icon: 'zipper', 
      description: 'Group related files into individual ZIPs (e.g., "photo.jpg" and "photo.raw").', 
      internalRoute: '/app/media-tools?tool=zipper', 
      category: 'category.utilities' 
  },
  { 
      id: 'renamer', 
      lang: 'en',
      type: 'freemium',
      name: 'Batch Renamer', 
      icon: 'renamer', 
      description: 'Rename hundreds of files sequentially in seconds.', 
      internalRoute: '/app/media-tools?tool=renamer', 
      category: 'category.utilities' 
  },
  { 
      id: 'optimizer', 
      lang: 'en',
      type: 'freemium',
      name: 'Image Optimizer', 
      icon: 'optimizer', 
      description: 'Compress and resize images (JPG, PNG, WebP) without losing quality.', 
      internalRoute: '/app/media-tools?tool=optimizer', 
      category: 'category.utilities' 
  },
  { 
      id: 'converter', 
      lang: 'en',
      type: 'freemium',
      name: 'Image Converter', 
      icon: 'converter', 
      description: 'Convert image formats in bulk (e.g., WebP to JPG, PNG to AVIF).', 
      internalRoute: '/app/media-tools?tool=converter', 
      category: 'category.utilities' 
  },
  { 
      id: 'watermark', 
      lang: 'en',
      type: 'freemium',
      name: 'Batch Watermark', 
      icon: 'bubbles', 
      description: 'Protect your images by applying logos or text as watermarks in bulk.', 
      internalRoute: '/app/media-tools?tool=watermark', 
      category: 'category.utilities' 
  },
  { 
      id: 'palette', 
      lang: 'en',
      type: 'freemium',
      name: 'Palette Generator', 
      icon: 'palette-generator', 
      description: 'Extract main colors from any image and create harmonious palettes.', 
      internalRoute: '/app/media-tools?tool=palette', 
      category: 'category.utilities' 
  }
];