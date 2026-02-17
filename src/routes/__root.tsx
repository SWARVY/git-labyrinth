/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import i18n from '@shared/i18n';

void i18n;

import { useAuthSync } from '@entities/user';
import appCss from '~/styles/app.css?url';

import { ApiError } from '@shared/lib/api-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Git Labyrinth | Enter the Code. Survive the Maze.' },
      {
        name: 'description',
        content:
          'Explore the code labyrinth and grow your pixel hero with Git Labyrinth.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function AppShell() {
  useAuthSync();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* CRT Shader Overlay */}
      <div className="crt-overlay" aria-hidden="true" />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
