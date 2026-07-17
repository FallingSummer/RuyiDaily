import React from 'react';
import { cn } from '../../utils/cn';

type BrandMarkProps = {
  /** 'icon' = icon-only (avatar/small), 'compact' = icon + short name, 'full' = icon + full name + subtitle */
  variant?: 'icon' | 'compact' | 'full';
  /** Override dimensions for the icon; defaults based on variant */
  size?: number;
  className?: string;
};

/**
 * 如意金股 (RuyiDailyStockAnalysis) brand mark.
 * Displays the Ruyi Chart icon with optional text.
 * Used in SidebarNav (compact), LoginPage (full), and Shell header (icon).
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  variant = 'compact',
  size,
  className,
}) => {
  const iconSize = size ?? (variant === 'full' ? 48 : 36);

  const icon = (
    <div
      className={cn(
        'flex items-center justify-center bg-primary-gradient text-[hsl(var(--primary-foreground))] shadow-[0_12px_28px_var(--nav-brand-shadow)] shrink-0',
        variant === 'full'
          ? 'h-12 w-12 rounded-2xl'
          : 'h-10 w-10 rounded-2xl'
      )}
      style={{ width: iconSize, height: iconSize, minWidth: iconSize }}
    >
      {/* Ruyi Chart SVG inline */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={iconSize * 0.55}
        height={iconSize * 0.55}
        fill="none"
      >
        {/* K line bars */}
        <rect x="14" y="36" width="6" height="16" rx="1" fill="white" opacity="0.7" />
        <rect x="22" y="28" width="6" height="24" rx="1" fill="white" opacity="0.85" />
        <rect x="30" y="20" width="6" height="32" rx="1" fill="white" />
        {/* Ruyi hook */}
        <path
          d="M36 20 Q36 10 30 10 Q24 10 24 18 Q24 26 32 26 Q38 26 38 18"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* AI sparkle */}
        <circle cx="41" cy="13" r="2" fill="#fbbf24" />
      </svg>
    </div>
  );

  if (variant === 'icon') return icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon}
      {variant === 'compact' && (
        <p className="min-w-0 truncate font-semibold text-foreground text-sm">
          如意金股
        </p>
      )}
      {variant === 'full' && (
        <div className="flex flex-col justify-center min-w-0">
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--login-text-primary)]">
            如意金股
          </h2>
          <p className="text-xs font-medium tracking-[0.3em] text-[var(--login-text-muted)]">
            RuyiDailyStockAnalysis
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandMark;