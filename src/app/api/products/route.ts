import { NextRequest } from "next/server";
import { ProductoController } from "@/controllers/ProductoController";
export const GET  = (req: NextRequest) => ProductoController.index(req);
export const POST = (req: NextRequest) => ProductoController.create(req);
