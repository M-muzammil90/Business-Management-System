import { NextRequest } from "next/server";
import { authenticate, AuthUser } from "./auth.middleware";

export interface OrganizationContext {
  user: AuthUser;
  organizationId: string;
}

export async function authenticateOrganization(
  request: NextRequest,
): Promise<OrganizationContext> {
  const user = await authenticate(request);

  if (!user.organizationId) {
    throw new Error("User is not assigned to an organization");
  }

  return {
    user,
    organizationId: user.organizationId,
  };
}