"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
      }}
    />
  ),
});

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading-screen"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>
      {!isLoading && children}
    </>
  );
}