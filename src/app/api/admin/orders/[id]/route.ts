// src/app/api/admin/orders/[id]/route.ts — thin route
import { NextRequest } from "next/server";
import { OrdenController } from "@/controllers/OrdenController";

export const PUT = (req: NextRequest, { params }: { params: { id: string } }) =>
  OrdenController.actualizarEstado(req, params.id);
