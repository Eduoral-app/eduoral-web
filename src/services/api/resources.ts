export type ResourceFilters = {
  // filters
  type?: string; // PAST_PAPER, NOTES...
  board?: string; // FBISE, Cambridge...
  institution?: string; // optional
  subject?: string; // Mathematics...
  year?: number;
  search?: string; // search resources

  // sorting
  sort?: "latest" | "downloads" | "views" | "popular";

  // pagination
  page?: number;
  limit?: number;
};

export async function getResources(filters: ResourceFilters = {}) {
  const params = new URLSearchParams();

  const { page = 1, limit = 12, ...rest } = filters;

  // always send pagination
  params.set("page", String(page));
  params.set("limit", String(limit));

  // add filters dynamically
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const res = await fetch(`/api/resources?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resources");
  }

  return res.json();
}

export async function getResourceView(id: string) {
  const res = await fetch(`/api/resources/${id}/view`);

  if (!res.ok) {
    throw new Error("Failed to get download URL");
  }

  return res.json() as Promise<{
    url: string;
    type: string;
  }>;
}

export async function getResourcesStats() {
  try {
    const res = await fetch("/api/resources/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch resources");
    }

    return await res.json();
  } catch (error) {
    console.error("getResources error:", error);
    return [];
  }
}
