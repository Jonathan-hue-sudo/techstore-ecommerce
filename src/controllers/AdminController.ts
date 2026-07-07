// src/controllers/AdminController.ts — CONTROLLER
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductoModel } from "@/models/Producto";
import { UsuarioModel } from "@/models/Usuario";
import { OrdenModel } from "@/models/Orden";

export class AdminController {
  private static async requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") return null;
    return session;
  }

  static async stats() {
    try {
      const session = await AdminController.requireAdmin();
      if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const [productos, usuarios, ordenes] = await Promise.all([
        ProductoModel.getStats(),
        UsuarioModel.getStats(),
        OrdenModel.getStats(),
      ]);
      return NextResponse.json({ productos, usuarios, ordenes });
    } catch (e: any) {
      console.error("AdminController.stats error:", e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  static async usuarios() {
    try {
      const session = await AdminController.requireAdmin();
      if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      return NextResponse.json(await UsuarioModel.findAll());
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }
}
