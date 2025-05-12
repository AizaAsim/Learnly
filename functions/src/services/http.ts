import { auth } from "./firebaseAdmin";
import { getUserRole } from "./users";
import { Roles } from "../types/roles";
import { DecodedIdToken } from "firebase-admin/auth";
import { Request } from "firebase-functions/v2/https";
import { AppError } from "../shared/classes/AppError";

/**
 * Authenticates an incoming request by verifying the Firebase ID token from the
 * Authorization header and checking if the user's role is allowed to access the resource.
 *
 * @param {Request} req - The incoming HTTP request object.
 * @param {Roles[]} [allowedRoles=[]] - An array of roles that are permitted to access the resource.
 *                                       If no roles are provided, any authenticated user is allowed.
 * @returns {Promise<string>} - The UID of the authenticated user if the request is successfully authenticated and authorized.
 * @throws {object} - Throws an error with a status code and message if authentication or authorization fails.
 */
export async function verifyAndAuthorizeRequest(
  req: Request,
  allowedRoles: Roles[] = []
): Promise<string> {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("User is not authenticated", 401);
  }

  const token = authHeader.split(" ")[1];

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await auth.verifyIdToken(token);
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }

  const uid = decodedToken.uid;

  // Role check
  const role = await getUserRole(uid);
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    throw new AppError("Only specified roles can access this data", 403);
  }

  return uid;
}
