import { useMutation } from "@tanstack/react-query";
import { updateUser, UpdateUserData } from "@/services/api/profile";

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      updateUser(userId, data),
  });
}
