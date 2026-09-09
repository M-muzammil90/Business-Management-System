
import { NextRequest } from "next/server";

import { stockInController } from "@/controllers/inventory.controller";

export async function POST(request: NextRequest) {
  return stockInController(request);
}

