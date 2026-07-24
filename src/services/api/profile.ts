export interface UpdateUserData {
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  institution?: string;
  country?: string;
  department?: string;
  bio?: string;
}

export interface UpdatedUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  institution: string | null;
  country: string | null;
  department: string | null;
  bio: string | null;
  updatedAt: string;
}

export async function updateUser(
  userId: string,
  data: UpdateUserData,
): Promise<UpdatedUser> {
  const res = await fetch(`/api/auth/profile/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update user");
  }

  return result.user;
}
