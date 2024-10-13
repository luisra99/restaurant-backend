import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const updateSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .optional(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Debe introducir un correo",
    })
    .email({
      message: "El correo no es válido",
    }),
  password: z
    .string({
      required_error: "Debe introducir una contraseña",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});
