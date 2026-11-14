interface BrandLogoProps {
  variant?: 'wordmark' | 'symbol';
  className?: string;
  alt?: string;
  decorative?: boolean;
}

export function BrandLogo({
  variant = 'wordmark',
  className = 'h-8',
  alt,
  decorative = false,
}: BrandLogoProps) {
  const src =
    variant === 'wordmark' ? '/brand/leaf-wordmark.png' : '/brand/leaf-symbol.png';
  const defaultAlt = variant === 'wordmark' ? 'Leaf.' : 'Leaf. 심볼';

  return (
    <img
      src={src}
      alt={decorative ? '' : alt ?? defaultAlt}
      aria-hidden={decorative ? true : undefined}
      className={`w-auto object-contain select-none ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
