import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/AuthController";
export const POST = (req: NextRequest) => AuthController.register(req);
