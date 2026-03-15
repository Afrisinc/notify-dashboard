import { useEffect } from "react";
import { useApp } from "@/hooks/useApps";
import { useAppContext } from "@/contexts/AppContext";

/**
 * Fetch app by ID and store it in AppContext
 * Uses React Query for caching and state management
 */
export function useAppData(appId: string | undefined) {
  const { data, isLoading, error } = useApp(appId ?? "", {
    enabled: !!appId,
  });
  const { setSelectedApp } = useAppContext();

  useEffect(() => {
    if (data) {
      setSelectedApp(data);
    }
  }, [data, setSelectedApp]);

  return { app: data, isLoading, error };
}
