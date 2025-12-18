
export default {
    title: 'Color Palette Creator',
    defaultPaletteName: 'My Palette',
    step1: {
        nav: 'Controls',
        title: 'Step 1: Palette Controls',
    },
    step2: {
        nav: 'Palette',
        title: 'Step 2: My Palette',
    },
    step3: {
        nav: 'Export',
        title: 'Step 3: Export',
    },
    paletteName: {
        label: 'Palette Name',
    },
    addColor: {
        label: 'Manually Add Color',
        button: 'Add to Palette',
    },
    extractFromImage: {
        title: 'Extract Colors from Image',
        urlLabel: 'Image URL',
        urlPlaceholder: 'https://example.com/image.png',
        button: 'Extract Colors',
        orPaste: 'Or paste an image from clipboard (Ctrl+V).',
        helper: 'Tip: If the link fails (security/CORS), copy the image itself and paste it here (Ctrl+V).',
        extracting: 'Processing...',
    },
    emptyPalette: 'Your palette is empty. Add a color or extract from an image to get started!',
    export: {
        ase: 'ASE (Adobe)',
    },
    remove: {
        ariaLabel: 'Remove color {{color}}',
    },
    errors: {
        cors: 'Security Error (CORS): Could not load image from URL. Please copy the image data and paste it (Ctrl+V) instead.',
        invalidImage: 'Invalid image data or format.',
        noImageInClipboard: 'No image found in clipboard.',
    }
};