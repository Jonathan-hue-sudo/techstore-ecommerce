import { NextRequest } from "next/server";
import { CarritoController } from "@/controllers/CarritoController";
export const PUT    = (req: NextRequest, { params }: { params: { productId: string } }) => CarritoController.actualizarItem(req, params.productId);
export const DELETE = (req: NextRequest, { params }: { params: { productId: string } }) => CarritoController.eliminarItem(req, params.productId);
