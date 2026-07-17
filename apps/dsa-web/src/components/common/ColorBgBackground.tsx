import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { AbstractShapeBg } from 'color4bg';

/** Color palettes for organic shape background */
const DARK_COLORS = ["#E6CADB","#8e061a","#84332a","#571a00","#59081b","#E6CADB"];
const LIGHT_COLORS = ["#e6ddf3","#ffffff","#F6C7C2","#c19f9f","#fbdfe6","#E6CADB"];

const CONTAINER_ID = 'color4bg-box';

/**
 * Full-screen organic shape background powered by color4bg WebGL.
 * Re-initializes on theme change (dark ⟷ light) so the color palette matches.
 */
export const ColorBgBackground: React.FC = () => {
  const { theme } = useTheme();
  const bgRef = useRef<AbstractShapeBg | null>(null);

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

    // Destroy previous instance
    bgRef.current?.destroy?.();
    bgRef.current = null;

    // Create new instance (AbstractShapeBg constructor calls start() internally)
    let instance: AbstractShapeBg | null = null;
    try {
      instance = new AbstractShapeBg({
        dom: CONTAINER_ID,
        colors,
        loop: true,
      });
    } catch (err) {
      console.warn('[ColorBgBackground] WebGL init failed:', err);
      // Fallback: keep the dark static background visible via CSS
      return;
    }
    bgRef.current = instance;

    return () => {
      instance?.destroy?.();
      bgRef.current = null;
    };
  }, [theme]);

  return (
    <div
      id={CONTAINER_ID}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
};

export default ColorBgBackground;