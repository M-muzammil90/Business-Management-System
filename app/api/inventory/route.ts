import { NextRequest } from "next/server";
import { getInventoryHistoryController } from "@/controllers/inventory.controller";

export async function GET(request: NextRequest) {
  return getInventoryHistoryController(request);
}