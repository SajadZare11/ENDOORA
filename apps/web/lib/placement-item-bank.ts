/**
 * Endoora Placement Item Bank Loader
 * Loads the complete calibrated 348-item pool across all 6 language skills and A1-C2 CEFR tiers.
 */

import rawItems from "@/data/placement/core-items.json";
import { AdaptiveItem, normalizeItem } from "./adaptive-engine";

export const FULL_CALIBRATED_ITEMS_BANK: AdaptiveItem[] = (rawItems as any[]).map(normalizeItem);
