import { useQuery } from "@tanstack/react-query";
import { getPlayerMetrics } from "./getPlayerMetrics";

export function usePlayerMetrics() {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    queryKey: ["player-metrics"],
    queryFn: getPlayerMetrics,
  });
}
