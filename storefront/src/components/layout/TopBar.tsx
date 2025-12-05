// src/components/layout/Topbar.tsx
export default function Topbar() {
  return (
    <div className="hidden md:block bg-tz-bg-soft text-sm text-tz-muted">
      <div className="mx-auto max-w-container px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            {/* Aquí puedes poner pequeños logos/alianzas si aplica */}
            <span className="font-medium text-tz-fg">TechZone</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Distribuidores</span>
          </span>
        </div>
        <nav className="flex items-center gap-6" aria-label="Topbar">
          <a href="/distribuidores" className="hover:opacity-80">
            Distribuidores
          </a>
          <a href="/contacto" className="hover:opacity-80">
            Contacto
          </a>
          <a href="/soporte" className="hover:opacity-80">
            Soporte
          </a>
        </nav>
      </div>
    </div>
  );
}
