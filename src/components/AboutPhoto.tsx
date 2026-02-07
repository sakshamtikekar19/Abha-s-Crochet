'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function AboutPhoto() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-64 h-80 md:w-72 md:h-96 rounded-xl overflow-hidden border-2 border-dusty-pink/40 shadow-lg bg-dusty-pink/30 flex items-center justify-center">
        <span className="text-text-light text-sm font-light text-center px-4">
          Photo of Abha
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-xl overflow-hidden border-2 border-dusty-pink/40 shadow-lg">
      <Image
        src="/abha-photo.png"
        alt="Abha Tikekar"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 256px, 288px"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
