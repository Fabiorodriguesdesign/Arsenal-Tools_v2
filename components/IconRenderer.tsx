
import React from 'react';
import { iconPaths } from '../data/iconPaths';

interface IconRendererProps {
  icon: string;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, className }) => {
  // 1. Verifica se a string passada é uma chave válida no nosso registro de ícones (data/iconPaths)
  if (iconPaths[icon]) {
    const { viewBox, content, fill, stroke, strokeWidth, strokeLinecap, strokeLinejoin } = iconPaths[icon];
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox || "0 0 24 24"}
        className={className}
        fill={fill || "none"}
        stroke={stroke || "currentColor"}
        strokeWidth={strokeWidth || "2"}
        strokeLinecap={strokeLinecap as any || "round"}
        strokeLinejoin={strokeLinejoin as any || "round"}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // 2. Verifica se é um código SVG bruto (legado ou customizado)
  if (icon.trim().startsWith('<svg')) {
    return (
      <div 
        aria-hidden="true"
        className={className} 
        dangerouslySetInnerHTML={{ __html: icon }} 
      />
    );
  }
  
  // 3. Verifica se é uma URL de imagem ou Base64
  if (icon.startsWith('data:image') || icon.startsWith('http') || icon.startsWith('/')) {
    return <img 
        src={icon} 
        alt="" 
        aria-hidden="true" 
        className={`${className} object-contain`} 
        loading="lazy"
        decoding="async"
    />;
  }

  // 4. Fallback visual caso o ícone não seja encontrado
  return <div className={`${className} bg-neutral-200 dark:bg-neutral-800 rounded opacity-50`} />;
};

export default React.memo(IconRenderer);
