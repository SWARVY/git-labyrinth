import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@shared/api/supabase";

export function useAuthSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);
}
