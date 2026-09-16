import { NextRequest } from "next/server";

import {
  getDashboardStatsController,
} from "@/controllers/dashboard.controller";

export async function GET(
  request: NextRequest,
) {
  return getDashboardStatsController(request);
}