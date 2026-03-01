"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

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