import { SnackMenuItem } from '../types/order';

export interface MatchResult {
  matchedItem: SnackMenuItem;
  isExact: boolean;
  cleanName: string;
}

export function matchSnackItem(
  rawInput: string,
  pricelist: SnackMenuItem[]
): { item: SnackMenuItem | null; detectedNote?: string } {
  let cleaned = rawInput.trim().toLowerCase();
  let detectedNote: string | undefined;

  // Extract common notes like "klo buat", "pedas", "mix"
  if (cleaned.includes('klo buat') || cleaned.includes('kalau buat')) {
    detectedNote = 'klo buat';
    cleaned = cleaned.replace(/klo buat|kalau buat/gi, '').trim();
  }
  if (cleaned.includes('mix')) {
    detectedNote = (detectedNote ? detectedNote + ', ' : '') + 'mix';
  }
  if (cleaned.includes('milo')) {
    detectedNote = (detectedNote ? detectedNote + ', ' : '') + 'milo';
  }

  // 1. Direct match with aliases (exact)
  for (const item of pricelist) {
    if (item.name.toLowerCase() === cleaned) {
      return { item, detectedNote };
    }
    for (const alias of item.aliases) {
      if (alias.toLowerCase() === cleaned) {
        return { item, detectedNote };
      }
    }
  }

  // 2. Contains match with aliases
  for (const item of pricelist) {
    for (const alias of item.aliases) {
      const aliasLower = alias.toLowerCase();
      if (cleaned.includes(aliasLower) || aliasLower.includes(cleaned)) {
        return { item, detectedNote };
      }
    }
  }

  // 3. Fallback: match by partial word
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  for (const word of words) {
    for (const item of pricelist) {
      for (const alias of item.aliases) {
        if (alias.toLowerCase().includes(word)) {
          return { item, detectedNote };
        }
      }
    }
  }

  return { item: null, detectedNote };
}
