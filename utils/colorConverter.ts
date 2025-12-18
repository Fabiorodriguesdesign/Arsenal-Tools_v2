
export const isValidHex = (hex: string): boolean => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
};

export const hexToRgbFloat = (hex: string): [number, number, number] | null => {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return null;
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b];
};

export const createAseFile = (paletteName: string, colors: string[]): Blob => {
  const chunks: Uint8Array[] = [];

  const writeUint16 = (value: number) => new Uint8Array([value >> 8, value & 0xff]);
  const writeUint32 = (value: number) => new Uint8Array([(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]);
  const writeFloat32 = (value: number) => {
      const buffer = new ArrayBuffer(4);
      new DataView(buffer).setFloat32(0, value, false);
      return new Uint8Array(buffer);
  };
  const writeAscii = (str: string) => {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
      return arr;
  };
  const writeUtf16Be = (str: string) => {
      const arr = new Uint8Array(str.length * 2);
      for (let i = 0; i < str.length; i++) {
          const code = str.charCodeAt(i);
          arr[i * 2] = (code >> 8) & 0xff;
          arr[i * 2 + 1] = code & 0xff;
      }
      return arr;
  };
  const writeUtf16BeBlock = (str: string) => {
      const textBytes = writeUtf16Be(str);
      return new Uint8Array([...writeUint16(str.length + 1), ...textBytes, 0x00, 0x00]);
  };
  
  // Header
  chunks.push(writeAscii('ASEF'));
  chunks.push(writeUint16(1)); // Major v1
  chunks.push(writeUint16(0)); // Minor v0
  chunks.push(writeUint32(colors.length + 2)); // Group start + colors + group end

  // Group Start Block
  const groupNameBlock = writeUtf16BeBlock(paletteName || "Untitled Palette");
  chunks.push(writeUint16(0xc001));
  chunks.push(writeUint32(groupNameBlock.length));
  chunks.push(groupNameBlock);

  // Color Blocks
  colors.forEach(hex => {
      const rgb = hexToRgbFloat(hex);
      if (!rgb) return;
      
      const colorNameBlock = writeUtf16BeBlock(hex.toUpperCase());
      const colorModel = writeAscii('RGB ');
      const colorValues = new Uint8Array([...writeFloat32(rgb[0]), ...writeFloat32(rgb[1]), ...writeFloat32(rgb[2])]);
      const colorType = writeUint16(0); // Global

      const blockLength = colorNameBlock.length + colorModel.length + colorValues.length + colorType.length;

      chunks.push(writeUint16(0x0001)); // Color Block
      chunks.push(writeUint32(blockLength));
      chunks.push(colorNameBlock);
      chunks.push(colorModel);
      chunks.push(colorValues);
      chunks.push(colorType);
  });

  // Group End Block
  chunks.push(writeUint16(0xc002));
  chunks.push(writeUint32(0));

  return new Blob(chunks, { type: 'application/octet-stream' });
};

export const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
