import { NextRequest } from "next/server";
import { ProductoController } from "@/controllers/ProductoController";
export const GET    = (req: NextRequest, { params }: { params: { id: string } }) => ProductoController.show(req, params.id);
export const PUT    = (req: NextRequest, { params }: { params: { id: string } }) => ProductoController.update(req, params.id);
export const DELETE = (req: NextRequest, { params }: { params: { id: string } }) => ProductoController.destroy(req, params.id);
