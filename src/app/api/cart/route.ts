import { NextRequest } from "next/server";
import { CarritoController } from "@/controllers/CarritoController";
export const GET    = () => CarritoController.index();
export const POST   = (req: NextRequest) => CarritoController.agregarItem(req);
export const DELETE = () => CarritoController.vaciar();
