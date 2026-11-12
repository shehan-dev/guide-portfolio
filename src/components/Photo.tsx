"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a progressive "blur-up": the image starts blurred and
 * slightly scaled over a tinted placeholder, then sharpens once loaded.
 */
export default function Photo({ className, style, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      className={className}
      data-loaded={loaded || undefined}
      style={{
        backgroundColor: "var(--surface-2)",
        filter: loaded ? "none" : "blur(14px)",
        transform: loaded ? "none" : "scale(1.04)",
        transition: "filter 600ms var(--ease-in-out), transform 600ms var(--ease-in-out)",
        objectFit: "cover",
        ...style,
      }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
