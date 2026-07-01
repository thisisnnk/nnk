'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function WireframeBento({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      {/* CSS columns — true masonry, zero gaps regardless of image height.
          Mobile-first: 1 column on phones, 2 on small, 3 on large. */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
        {images.map((src, i) => (
          <div
            key={src}
            className="group relative overflow-hidden rounded-xl cursor-zoom-in"
            style={{
              breakInside: 'avoid',
              marginBottom: '12px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
            onClick={() => setLightbox(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Wireframe ${String(i + 1).padStart(2, '0')}`}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'rgba(0,170,255,0.08)' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Wireframe"
            className="max-w-full max-h-full rounded-2xl object-contain"
            style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
