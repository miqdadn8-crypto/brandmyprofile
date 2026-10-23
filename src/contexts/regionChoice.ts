// The visitor's own region choice, remembered across visits. Only the region selector
// writes it (via useChangeRegion); visiting a region URL or the geo lookup never does,
// so following a link to /uae can't stick UAE on a visitor in Kuwait.
// Renamed from "brandmyprofile-region", which saved every visited region; old values are ignored.
const STORAGE_KEY = "brandmyprofile-region-choice";

export function getRegionChoice(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function rememberRegionChoice(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // localStorage unavailable (private browsing, etc.) - not fatal.
  }
}
