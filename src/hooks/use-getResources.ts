import { getResources, ResourceFilters } from "@/services/api/resources";
import { useQuery } from "@tanstack/react-query";

export function useGetResources(filters: ResourceFilters = {}) {
  return useQuery({
    queryKey: ["resources", filters],
    queryFn: () => getResources(filters),
  });
}
