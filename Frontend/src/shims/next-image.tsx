import React from 'react';

export interface NextImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function Image({
  src,
  alt = '',
  fill,
  priority,
  sizes,
  className = '',
  style,
  ...props
}: NextImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      style={{ ...fillStyle, ...style }}
      {...props}
    />
  );
}
