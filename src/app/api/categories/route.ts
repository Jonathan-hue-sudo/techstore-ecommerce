import { NextRequest } from "next/server";
import { CategoriaController } from "@/controllers/CategoriaController";
export const GET  = () => CategoriaController.index();
export const POST = (req: NextRequest) => CategoriaController.create(req);
