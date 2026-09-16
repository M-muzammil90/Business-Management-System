import { NextRequest } from "next/server";
import { authenticateOrganization } from "./organization.middleware";
import { ROLE_PERMISSIONS } from "@/constants/rolePermissions";
import { Permission } from "@/constants/permissions";

export async function authorizePermission(
  request: NextRequest,
  permission: Permission,
) {
  const { user, organizationId } =
    await authenticateOrganization(request);

  const permissions =
    ROLE_PERMISSIONS[user.role];

  if (!permissions?.includes(permission)) {
    throw new Error(
      "You do not have permission to perform this action",
    );
  }

  return {
    user,
    organizationId,
  };
}