
import { NextRequest } from "next/server";

import {
  stockAdjustmentController,
} from "@/controllers/inventory.controller";

export async function POST(request: NextRequest) {
  return stockAdjustmentController(request);
}

