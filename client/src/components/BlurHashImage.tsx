import { useBlurHashImage } from '../hooks/useBlurHashImage.js';

interface BlurHashImageProps {
  src: string;
  blurHash: string | null;
  alt: string;
}

export function BlurHashImage({ src, blurHash, alt }: BlurHashImageProps) {
  const { placeholder, loaded, errored, imgRef, onLoad, onError } = useBlurHashImage(src, blurHash);

  return (
    <div className="absolute inset-0 bg-slide-bg">
      {placeholder && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        onLoad={onLoad}
        onError={onError}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded && !errored ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
