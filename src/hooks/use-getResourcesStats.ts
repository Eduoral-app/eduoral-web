import { getResourcesStats } from "@/services/api/resources";
import { useQuery } from "@tanstack/react-query";

export function useGetResourcesStats() {
  return useQuery({
    queryKey: ["resources-stats"],
    queryFn: () => getResourcesStats(),
  });
}
