"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
};

export default function MobileNavDrawer({
  menuItems = [],
}: {
  menuItems?: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = useCallback(() => {
    setClosing(true);
    const TIMER = 300; // must match CSS animation duration
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, TIMER);
  }, []);

  // Cerrar con ESC (solo cuando está abierto)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  // Cerrar automáticamente si el usuario navega atrás/adelante
  useEffect(() => {
    if (!open) return;
    const handlePopState = () => {
      handleClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open, handleClose]);

  return (
    <>
      <button
        className="sm:hidden p-2 rounded-full hover:bg-tz-bg-soft"
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
      >
        <svg
          className="h-6 w-6 text-tz-fg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${
            closing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          onClick={handleClose}
        >
          <div
            className={`absolute left-0 top-0 h-[100dvh] w-3/4 max-w-xs bg-white flex flex-col shadow-tz p-5 overflow-y-auto ${
              closing ? "animate-slideOut" : "animate-slideIn"
            }`}
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex pt-4 justify-between items-center mb-4">
              <span className="font-semibold text-lg text-tz-fg">Menú</span>
              <button onClick={handleClose} aria-label="Cerrar menú">
                <X className="h-6 w-6 text-tz-fg" />
              </button>
            </div>

            <nav className="flex flex-col mt-2">
              {menuItems.length > 0 ? (
                menuItems.map((item) => {
                  const hasChildren =
                    Array.isArray(item.items) && item.items.length > 0;
                  const isOpen = !!expanded[item.id];
                  return (
                    <div key={item.id} className="border-b border-tz-border/60">
                      <div className="flex items-center justify-between">
                        {hasChildren ? (
                          <button
                            type="button"
                            className="flex-1 text-left py-3 pr-2 text-tz-fg hover:text-tz-primary"
                            aria-expanded={isOpen}
                            aria-controls={`sub-${item.id}`}
                            onClick={() => toggle(item.id)}
                          >
                            {item.title}
                          </button>
                        ) : (
                          <Link
                            href={item.url}
                            className="flex-1 py-3 pr-2 text-tz-fg hover:text-tz-primary"
                            onClick={handleClose}
                          >
                            {item.title}
                          </Link>
                        )}

                        {hasChildren ? (
                          <button
                            type="button"
                            aria-label={isOpen ? "Contraer" : "Expandir"}
                            className="p-2"
                            onClick={() => toggle(item.id)}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 text-tz-muted" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-tz-muted" />
                            )}
                          </button>
                        ) : null}
                      </div>

                      {hasChildren ? (
                        <div
                          id={`sub-${item.id}`}
                          className={`overflow-hidden transition-[max-height] duration-300 ${
                            isOpen ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <ul className="pl-4 pb-2">
                            {item.items!.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.url}
                                  className="block py-2 text-sm text-tz-fg hover:text-tz-primary"
                                  onClick={handleClose}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-tz-muted">
                  Sin enlaces disponibles.
                </p>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
