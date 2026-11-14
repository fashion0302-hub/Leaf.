import { useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface EditorialImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function EditorialImage({
  src,
  alt,
  aspectClass = 'aspect-[4/3]',
  className = '',
  imgClassName = '',
  priority = false,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#E4DACB]/45 ${aspectClass} ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#E4DACB]/60 p-6 text-center">
          <BrandLogo variant="symbol" className="h-10 opacity-40" decorative />
          <p className="max-w-xs text-xs text-[#656860]">{alt}</p>
        </div>
      )}
    </div>
  );
}
