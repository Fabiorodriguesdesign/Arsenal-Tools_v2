
interface SvgOptimizationResult {
    optimizedSvg: string;
    componentCode: string;
    error?: string;
}

// Compacts code by removing newlines and extra spaces
const minifyCode = (code: string): string => {
    return code
        .replace(/\r?\n|\r/g, '') // Remove newlines
        .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces to one
        .replace(/>\s+</g, '><')  // Remove spaces between tags
        .trim();
};

// Basic cleanup: removes comments, XML decl, DOCTYPE
const cleanSvgString = (svg: string): string => {
    return svg
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/<\?xml.*?>/gi, '') // Remove XML declaration
        .replace(/<!DOCTYPE.*?>/gi, '') // Remove DOCTYPE
        .trim();
};

// Removes hardcoded fills and strokes or replaces them with currentColor
const removeHardcodedColors = (svg: string): string => {
    let processed = svg;
    // Remove fill="..." attributes or replace with currentColor
    // We replace specific colors, but keeping 'none' is usually important for transparency
    processed = processed.replace(/fill="(?!(none|transparent))[^"]*"/gi, 'fill="currentColor"');
    processed = processed.replace(/stroke="(?!(none|transparent))[^"]*"/gi, 'stroke="currentColor"');
    
    // Remove style attributes that set fill/stroke
    processed = processed.replace(/style="[^"]*"/gi, (match) => {
         let styleBody = match.slice(7, -1);
         styleBody = styleBody.replace(/fill:\s*[^;]+;?/gi, 'fill: currentColor;');
         styleBody = styleBody.replace(/stroke:\s*[^;]+;?/gi, 'stroke: currentColor;');
         return `style="${styleBody}"`;
    });

    return processed;
};

// Converts kebab-case attributes to camelCase (React/JSX style)
const convertAttributesToJsx = (svg: string): string => {
    // List of common SVG attributes that need conversion
    const attributes = [
        'accent-height', 'alignment-baseline', 'allow-reorder', 'arabic-form', 'baseline-shift',
        'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters',
        'color-profile', 'color-rendering', 'content-script-type', 'content-style-type', 'dominant-baseline',
        'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity',
        'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style',
        'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical',
        'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color',
        'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness',
        'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering',
        'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray',
        'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity',
        'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position',
        'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic',
        'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y',
        'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'x-height'
    ];

    let processedSvg = svg;

    attributes.forEach(attr => {
        const camelCase = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const regex = new RegExp(`${attr}=`, 'g');
        processedSvg = processedSvg.replace(regex, `${camelCase}=`);
    });

    // Special case for 'class' -> 'className'
    processedSvg = processedSvg.replace(/\sclass=/g, ' className=');
    
    // Remove namespaces often not needed in inline SVG
    processedSvg = processedSvg.replace(/\sxmlns:xlink="[^"]*"/g, '');
    
    return processedSvg;
};

export const generateRasterImageComponent = (base64Data: string, componentName: string, isTypeScript: boolean) => {
    const interfaceDef = isTypeScript 
        ? `import React, { ImgHTMLAttributes } from "react";\n\ninterface ${componentName}Props extends ImgHTMLAttributes<HTMLImageElement> {}\n\n` 
        : `import React from "react";\n\n`;
    
    const propsType = isTypeScript ? `: React.FC<${componentName}Props>` : '';
    const propsArg = 'props';

    const componentCode = `${interfaceDef}const ${componentName}${propsType} = (${propsArg}) => (\n  <img src="${base64Data}" alt="${componentName}" {...props} />\n);\n\nexport default ${componentName};`;
    
    return componentCode;
};

// Generates the full React component code from SVG string
export const generateReactComponent = (
    svgInput: string, 
    componentName: string = 'MyIcon', 
    isTypeScript: boolean = true, 
    minify: boolean = true,
    removeBackground: boolean = false
): SvgOptimizationResult => {
    try {
        const trimmedInput = svgInput.trim();
        if (!trimmedInput.startsWith('<svg') && !trimmedInput.includes('<svg')) {
             return { optimizedSvg: '', componentCode: '', error: 'Invalid SVG input. Content must contain <svg> tag.' };
        }

        let cleanedSvg = cleanSvgString(trimmedInput);
        
        if (removeBackground) {
            cleanedSvg = removeHardcodedColors(cleanedSvg);
        }

        let jsxSvg = convertAttributesToJsx(cleanedSvg);

        // Inject props to the svg tag
        // Finds the opening <svg ... > tag and injects {...props}
        const svgTagMatch = jsxSvg.match(/<svg([^>]*)>/);
        let finalJsx = jsxSvg;
        
        if (svgTagMatch) {
            const existingAttrs = svgTagMatch[1];
            // Only add props spread if not already there
            if (!existingAttrs.includes('{...props}')) {
                 const newOpeningTag = `<svg${existingAttrs} {...props}>`;
                 finalJsx = finalJsx.replace(svgTagMatch[0], newOpeningTag);
            }
        }

        if (minify) {
            finalJsx = minifyCode(finalJsx);
        }

        const interfaceDef = isTypeScript 
            ? `import { SVGProps } from "react";\n\ninterface ${componentName}Props extends SVGProps<SVGSVGElement> {}\n\n` 
            : '';
        
        const propsType = isTypeScript ? `: React.FC<${componentName}Props>` : '';
        const propsArg = 'props';

        const componentCode = `${interfaceDef}const ${componentName}${propsType} = (${propsArg}) => (\n  ${finalJsx}\n);\n\nexport default ${componentName};`;

        return {
            optimizedSvg: jsxSvg,
            componentCode
        };

    } catch (error: any) {
        return {
            optimizedSvg: '',
            componentCode: '',
            error: error.message || 'Unknown error processing SVG'
        };
    }
};
