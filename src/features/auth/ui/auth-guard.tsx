import { useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { userQueryOptions } from '@entities/user';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: string;
}

export function AuthGuard({ children, fallback = '/' }: AuthGuardProps) {
  const navigate = useNavigate();
  const { data: user } = useSuspenseQuery(userQueryOptions);

  useEffect(() => {
    if (!user) {
      navigate({ to: fallback });
    }
  }, [user, navigate, fallback]);

  if (!user) return null;

  return <>{children}</>;
}
