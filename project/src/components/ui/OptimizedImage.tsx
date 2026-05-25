import type { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  priority?: boolean;
  sizes?: string;
}

const IMAGE_FALLBACK = '/fifty-store-logo.png';

function optimizePexelsUrl(src: string, width?: number): string {
  try {
    const url = new URL(src);
    const params = new URLSearchParams(url.search);
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    params.set('fm', 'webp');
    params.set('q', '75');
    if (width) {
      params.set('w', String(width));
    }

    return `${url.origin}${url.pathname}?${params.toString()}`;
  } catch {
    return src;
  }
}

function buildPexelsSrcSet(src: string): string | undefined {
  if (!src.includes('images.pexels.com')) {
    return undefined;
  }

  try {
    const widths = [320, 480, 640, 800, 1000, 1200];
    const pairs = widths.map((width) => `${optimizePexelsUrl(src, width)} ${width}w`);

    return pairs.join(', ');
  } catch {
    return undefined;
  }
}

export default function OptimizedImage({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading,
  decoding,
  fetchPriority,
  ...props
}: OptimizedImageProps) {
  const optimizedSrc = src.includes('images.pexels.com') ? optimizePexelsUrl(src) : src;
  const srcSet = buildPexelsSrcSet(src);
  const fetchPriorityValue = fetchPriority ?? (priority ? 'high' : 'auto');

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? 'async'}
      {...({ fetchpriority: fetchPriorityValue } as Record<string, string>)}
      {...props}
      onError={(event) => {
        if (event.currentTarget.src.includes(IMAGE_FALLBACK)) {
          props.onError?.(event);
          return;
        }

        event.currentTarget.removeAttribute('srcset');
        event.currentTarget.src = IMAGE_FALLBACK;
        props.onError?.(event);
      }}
    />
  );
}
