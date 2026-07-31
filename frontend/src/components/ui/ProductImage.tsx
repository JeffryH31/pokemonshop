import { useState } from 'react'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  /** Rendered when there is no src or the image fails to load. */
  fallback: React.ReactNode
}

/**
 * Renders a product image with a graceful fallback. Covers two cases the raw
 * `<img>` tag does not: a missing `image_url`, and an `image_url` that is set
 * but fails to load (e.g. a 404 or an admin typo). In both cases we show the
 * caller-provided placeholder instead of the browser's broken-image icon.
 */
export default function ProductImage({ src, alt, className, fallback }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <>{fallback}</>

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
