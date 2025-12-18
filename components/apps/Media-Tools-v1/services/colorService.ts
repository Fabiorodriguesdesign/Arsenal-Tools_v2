export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

export const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
};

export const simulatePantone = (hex: string) => {
    let hash = 0;
    for (let i = 0; i < hex.length; i++) {
        const char = hex.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    const part1 = (Math.abs(hash) % 89) + 10;
    const part2 = (Math.abs(hash * 31) % 8999) + 1000;
    const suffixes = ['C', 'U', 'TCX', 'TPG'];
    const suffix = suffixes[Math.abs(hash) % suffixes.length];
    return `PMS ${part1}-${part2} ${suffix}`;
};
