import { NextRequest } from "next/server";
import { CategoriaController } from "@/controllers/CategoriaController";
export const PUT    = (req: NextRequest, { params }: { params: { id: string } }) => CategoriaController.update(req, params.id);
export const DELETE = (req: NextRequest, { params }: { params: { id: string } }) => CategoriaController.destroy(req, params.id);
