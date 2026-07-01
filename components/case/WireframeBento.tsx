'use client'

import ImageLightbox from '@/components/ui/ImageLightbox'

export default function WireframeBento({ images }: { images: string[] }) {
  return (
    /* CSS columns — true masonry, zero gaps regardless of image height.
       Mobile-first: 1 column on phones, 2 on small, 3 on large. */
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
      {images.map((src, i) => (
        <div
          key={src}
          className="group relative overflow-hidden rounded-xl"
          style={{
            breakInside: 'avoid',
            marginBottom: '12px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <ImageLightbox src={src} alt={`Wireframe ${String(i + 1).padStart(2, '0')}`} fill={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Wireframe ${String(i + 1).padStart(2, '0')}`}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </ImageLightbox>
        </div>
      ))}
    </div>
  )
}
