import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { AppFooter, LanguageToggle } from '@shared/ui';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  const { t } = useTranslation();

  return (
    <>
      <nav
        className="relative z-10 mx-auto flex max-w-5xl select-none items-center justify-between px-4 py-4"
        aria-label="Public navigation"
      >
        <Link
          to="/"
          className="font-title text-sm text-primary transition-opacity hover:opacity-80"
          style={{
            textShadow:
              '0 0 8px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)',
          }}
        >
          Git Labyrinth
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link
            to="/"
            className="font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary"
          >
            &larr; {t('about.backToHome')}
          </Link>
        </div>
      </nav>
      <Outlet />
      <AppFooter />
    </>
  );
}
