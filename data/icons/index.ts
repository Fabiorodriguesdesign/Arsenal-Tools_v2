
import { uiIcons } from './ui';
import { businessIcons } from './business';
import { mediaIcons } from './media';
import { socialIcons } from './social';
import { otherIcons } from './others';
import { IconData } from './types';

// Combina todos os ícones em um único objeto
export const allIcons: Record<string, IconData> = {
  ...uiIcons,
  ...businessIcons,
  ...mediaIcons,
  ...socialIcons,
  ...otherIcons,
};
