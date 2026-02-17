import { useQuery } from '@tanstack/react-query';
import { userQueryOptions } from './queries';

export function useUser() {
  const { data: user, ...rest } = useQuery(userQueryOptions);
  return { user: user ?? null, ...rest };
}
