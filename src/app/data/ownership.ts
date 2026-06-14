// Single source of truth for which volumes' Digital Edition the member owns.
// Volume numbers match the ids used by ReaderContext.openVolume / VOLUME_META.
export const OWNED_VOLUME_IDS = new Set(["1.0", "04", "03"]);

export const isVolumeOwned = (num: string) => OWNED_VOLUME_IDS.has(num);
