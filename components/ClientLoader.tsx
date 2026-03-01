"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// We moved the dynamic import HERE, inside the Client Component!
// This safely disables SSR for the LoadingScreen and bypasses the Math.random() error.
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { 
  ssr: false 
});

export default function ClientLoader() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <LoadingScreen
          key="loading-screen"
          onComplete={() => setIsLoading(false)}
        />
      )}
    </AnimatePresence>
  );
}