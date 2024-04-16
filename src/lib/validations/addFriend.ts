import Email from "next-auth/providers/email";
import { z } from "zod";

export const addFriendValidator = z.object({
    email: z.string().email(),
})