

// ============================================================================
// WORKER SCRIPTS BARREL FILE
// ============================================================================
// Este arquivo agora apenas reexporta os scripts dos workers modulares.

export { CONVERTER_WORKER_CODE } from './workers/converterWorker';
export { OPTIMIZER_WORKER_CODE } from './workers/optimizerWorker';
export { WEBP_WORKER_CODE } from './workers/webpWorker';
export { PALETTE_WORKER_CODE } from './workers/paletteWorker';
export { WATERMARK_WORKER_CODE } from './workers/watermarkWorker';
export { ZIPPER_WORKER_CODE } from './workers/zipperWorker';
export { ELEMENTOR_CROPP_WORKER_CODE } from './workers/elementorCroppWorker';
export { PSD_LAYER_REPLACER_WORKER_CODE } from './workers/psdLayerReplacerWorker'; // New worker
