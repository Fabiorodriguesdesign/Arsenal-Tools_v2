
import { Tool } from '../types';
import { kitFreelancerToolsPt, kitFreelancerToolsEn } from './tool-definitions/kit-freelancer';
import { mediaToolsPt, mediaToolsEn } from './tool-definitions/media-tools';
import { otherToolsPt, otherToolsEn } from './tool-definitions/others';

// These tools are part of the codebase and should not be editable via Admin Panel.
// IDs are string-based to distinguish from database IDs (numbers).

export const INTERNAL_TOOLS_PT: Tool[] = [
    ...kitFreelancerToolsPt,
    ...mediaToolsPt,
    ...otherToolsPt
];

export const INTERNAL_TOOLS_EN: Tool[] = [
    ...kitFreelancerToolsEn,
    ...mediaToolsEn,
    ...otherToolsEn
];
