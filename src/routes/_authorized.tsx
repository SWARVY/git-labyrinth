import { useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Suspense } from "@suspensive/react";

import { AuthGuard, LogoutButton } from "@features/auth";
import { AppFooter, LanguageToggle } from "@shared/ui";

export const Route = createFileRoute("/_authorized")({
  component: AuthorizedLayout,
});

function HeaderSkeleton() {
  return (
    <header className="nav-header relative z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="h-5 w-28 animate-pulse bg-muted" />
        <div className="h-4 w-20 animate-pulse bg-muted" />
      </div>
    </header>
  );
}

const navLinkClass =
  "font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary";

function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-header relative z-10 select-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="font-title text-sm text-primary"
          style={{
            textShadow:
              "0 0 8px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)",
          }}
        >
          Git Labyrinth
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-4 sm:flex"
          aria-label="Main navigation"
        >
          <Link to="/dashboard" className={navLinkClass}>
            Camp
          </Link>
          <Link to="/my-card" className={navLinkClass}>
            My Card
          </Link>
          <Link to="/about" className={navLinkClass}>
            About
          </Link>
          <LanguageToggle />
          <LogoutButton />
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="font-pixel text-xs text-muted-foreground sm:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="mx-4 border-2 border-black bg-card p-3 sm:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Camp
            </Link>
            <Link
              to="/my-card"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              My Card
            </Link>
            <Link
              to="/about"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center gap-4 border-t border-secondary pt-3">
              <LanguageToggle />
              <LogoutButton />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function AuthorizedLayout() {
  return (
    <Suspense clientOnly fallback={<HeaderSkeleton />}>
      <AuthGuard>
        <AppHeader />
        <Outlet />
        <AppFooter />
      </AuthGuard>
    </Suspense>
  );
}
