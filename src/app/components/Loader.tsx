"use client";

import React from 'react';
import Image from 'next/image';
import Loaderimg from '@/app/assets/loader.png';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#b5c1dda3] bg-opacity-80 flex items-center justify-center">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Half-circle spinner */}
        <div className="absolute w-full h-full rounded-full border-t-4 border-blue-500 animate-spin"></div>

        {/* Animated growing loader image */}
        <Image
          src={Loaderimg}
          width={40}
          height={40}
          alt="loader"
          className="animate-grow object-contain"
        />
      </div>
    </div>
  );
}
