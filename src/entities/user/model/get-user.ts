import { createIsomorphicFn } from "@tanstack/react-start";
import { createServerSupabaseClient } from "@shared/api/supabase";

export const getUser = createIsomorphicFn().server(async () => {
  const supabase = (await createServerSupabaseClient())!;
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
});
