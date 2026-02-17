import { queryOptions } from "@tanstack/react-query";
import { createBrowserClient } from "@shared/api/supabase";

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const supabase = createBrowserClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  staleTime: 5 * 60 * 1000,
});
