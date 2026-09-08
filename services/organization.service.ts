import Organization from "@/models/Organization";
import User from "@/models/User";

export async function getOrganizationById(
  organizationId: string,
) {
  console.log("User model:", User.modelName);

  const organization = await Organization.findById(
    organizationId,
  ).populate("ownerId", "name email");

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
}