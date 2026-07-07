// src/app/api/admin/orders/route.ts — thin route
import { NextRequest } from "next/server";
import { OrdenController } from "@/controllers/OrdenController";

export const GET = (req: NextRequest) => OrdenController.adminIndex(req);
