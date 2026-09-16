import { NextRequest } from "next/server";

import {
  getSalesAnalyticsController,
} from "@/controllers/analytics.controller";

export async function GET(
  request: NextRequest,
) {
  return getSalesAnalyticsController(request);
}