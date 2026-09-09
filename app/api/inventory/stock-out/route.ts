import { NextRequest } from "next/server";

import { stockOutController } from "@/controllers/inventory.controller";

export async function POST(request: NextRequest) {
  return stockOutController(request);
}

