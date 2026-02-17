import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Suspense } from '@suspensive/react';

import { AuthGuard, LogoutButton } from '@features/auth';
import { AppFooter, LanguageToggle } from '@shared/ui';

export const Route = createFileRoute('/_authorized')({
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

function AppHeader() {
  return (
    <header className="nav-header relative z-10 select-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="font-title text-sm text-primary"
          style={{
            textShadow:
              '0 0 8px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)',
          }}
        >
          Git Labyrinth
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          <Link
            to="/dashboard"
            className="font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
          >
            Camp
          </Link>
          <Link
            to="/my-card"
            className="font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
          >
            My Card
          </Link>
          <Link
            to="/about"
            className="font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
          >
            About
          </Link>
          <LanguageToggle />
          <LogoutButton />
        </nav>
      </div>
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
