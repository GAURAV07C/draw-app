import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});



export const SignInSchmea = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});


export const createRoomSchema = z.object({
  name: z.string().min(2),
});
