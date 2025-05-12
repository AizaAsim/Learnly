import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { Roles } from "../../types/roles";

export const RoleSchema = z.enum([Roles.ADMIN, Roles.USER, Roles.CREATOR]);
export type RoleType = z.infer<typeof RoleSchema>;

export const UserRootSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  displayName: z.string().optional(),
  username: z.string().optional(),
  role: RoleSchema,
  bio: z.string().optional(),
  isBlocked: z.boolean().optional(),
  avatar_url: z.string().optional(),
});
export type UserRootType = z.infer<typeof UserRootSchema>;

export const UserPrivateSchema = z.object({
  email: z.string().email(),
  claimsLastUpdated: z.instanceof(Timestamp).optional(),
});
export type UserPrivateType = z.infer<typeof UserPrivateSchema>;

export type UserType = UserRootType & UserPrivateType;
