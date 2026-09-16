import { NextRequest } from "next/server";

import { authenticateOrganization } from "./organization.middleware";

export async function authenticateAdmin(request: NextRequest) {
	const context = await authenticateOrganization(request);

	if (context.user.role !== "SUPER_ADMIN") {
		throw new Error("Only administrators can access the dashboard");
	}

	return context;
}
