// src/controllers/CategoriaController.ts — CONTROLLER
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CategoriaModel } from "@/models/Categoria";

export class CategoriaController {
  static async index() {
    try {
      return NextResponse.json(await CategoriaModel.findAll());
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  static async create(req: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const data = await req.json();
      if (!data.nombre?.trim()) return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
      return NextResponse.json(await CategoriaModel.create(data), { status: 201 });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async update(req: NextRequest, id: string) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const data = await req.json();
      return NextResponse.json(await CategoriaModel.update(id, data));
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async destroy(_: NextRequest, id: string) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      await CategoriaModel.delete(id);
      return NextResponse.json({ message: "Categoría eliminada" });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }
}
