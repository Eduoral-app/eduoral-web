import { getResourceView } from "@/services/api/resources";
import { useQuery } from "@tanstack/react-query";

export function useGetResourceView(id: string) {
  return useQuery({
    queryKey: ["resources-link", id],
    queryFn: () => getResourceView(id),
  });
}
