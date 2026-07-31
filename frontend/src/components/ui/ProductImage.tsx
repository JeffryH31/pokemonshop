import { useState } from 'react'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  /** Rendered when there is no src or the image fails to load. */
  fallback: React.ReactNode
}

// Product image with fallback for a missing or broken `src`.
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
