/**
 * Theme customization store.
 * Saves user preferences to localStorage and applies them as CSS custom properties.
 */

export interface ThemeConfig {
  /** Primary color HSL hue (0-360) */
  primaryHue: number;
  /** Primary color saturation (0-100) */
  primarySaturation: number;
  /** Accent color HSL hue (0-360) */
  accentHue: number;
  /** Accent color saturation (0-100) */
  accentSaturation: number;
  /** Base border radius in rem */
  radius: number;
}

const STORAGE_KEY = "xmstore-theme";
const DEFAULT_THEME: ThemeConfig = {
  primaryHue: 42,
  primarySaturation: 65,
  accentHue: 28,
  accentSaturation: 55,
  radius: 0.625,
};

export function getThemeConfig(): ThemeConfig {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  applyThemeConfig(config);
}

export function resetThemeConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  applyThemeConfig(DEFAULT_THEME);
  window.dispatchEvent(new Event("theme-update"));
}

/** Apply a theme config to the document's CSS variables. */
export function applyThemeConfig(config: ThemeConfig): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const pSat = config.primarySaturation;
  const aSat = config.accentSaturation;
  const pHue = config.primaryHue;
  const aHue = config.accentHue;

  // Only override the hue/saturation, keep lightness values from the theme
  root.style.setProperty("--color-primary", `${pHue} ${pSat}% 55%`);
  root.style.setProperty("--color-primary-foreground", `${pHue} ${pSat}% 4%`);
  root.style.setProperty("--color-ring", `${pHue} ${pSat}% 55%`);
  root.style.setProperty("--color-accent", `${aHue} ${aSat}% 50%`);
  root.style.setProperty("--color-accent-foreground", `${aHue} ${aSat}% 95%`);
  root.style.setProperty("--radius", `${config.radius}rem`);

  window.dispatchEvent(new Event("theme-update"));
}

/**
 * Inline script to restore theme before React hydration.
 * Drop this into the <head> via layout.tsx to prevent flash.
 */
export function themeScript(): string {
  return `
(function(){
  try {
    var raw = localStorage.getItem("${STORAGE_KEY}");
    if (!raw) return;
    var c = JSON.parse(raw);
    var r = document.documentElement;
    r.style.setProperty("--color-primary", c.primaryHue + " " + c.primarySaturation + "% 55%");
    r.style.setProperty("--color-primary-foreground", c.primaryHue + " " + c.primarySaturation + "% 4%");
    r.style.setProperty("--color-ring", c.primaryHue + " " + c.primarySaturation + "% 55%");
    r.style.setProperty("--color-accent", c.accentHue + " " + c.accentSaturation + "% 50%");
    r.style.setProperty("--color-accent-foreground", c.accentHue + " " + c.accentSaturation + "% 95%");
    r.style.setProperty("--radius", c.radius + "rem");
  } catch(e) {}
})();
`;
}
