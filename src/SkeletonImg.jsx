import { useState } from "react";

// <img> that fades in once loaded. Put it inside an element with the
// `.skeleton` class (shimmer background) so a slow photo shows a placeholder.
export default function SkeletonImg({ className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...props}
      ref={(el) => {
        // already cached → no load event will fire
        if (el && !loaded && el.complete && el.naturalWidth) setLoaded(true);
      }}
      className={`sk-img${loaded ? " is-loaded" : ""} ${className}`}
      onLoad={() => setLoaded(true)}
    />
  );
}
