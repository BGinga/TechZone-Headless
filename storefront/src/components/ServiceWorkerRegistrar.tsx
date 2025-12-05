// File: src/components/ServiceWorkerRegistrar.tsx
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        // Opcional: escucha updates en segundo plano
        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.onstatechange = () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Hay una nueva versión lista (soft-refresh UX futuro)
              // console.log("SW actualizado y listo");
            }
          };
        };
      } catch (e) {
        // console.warn("SW registration failed", e);
      }
    };

    register();
  }, []);

  return null;
}
