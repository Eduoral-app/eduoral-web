import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .min(1, "Email is required")
    .max(100, "Email is too long"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long")
    .regex(/[A-Za-z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
