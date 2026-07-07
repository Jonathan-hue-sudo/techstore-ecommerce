// src/app/api/orders/route.ts — thin route
import { NextRequest } from "next/server";
import { OrdenController } from "@/controllers/OrdenController";

export const GET  = () => OrdenController.misOrdenes();
export const POST = (req: NextRequest) => OrdenController.create(req);
