// src/controllers/OrdenController.ts — CONTROLLER
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrdenModel } from "@/models/Orden";

export class OrdenController {
  private static async auth() {
    const session = await getServerSession(authOptions);
    if (!session) return { usuarioId: null, rol: null };
    return {
      usuarioId: (session.user as any).id as string,
      rol:       (session.user as any).role as string,
    };
  }

  /** GET /api/orders — órdenes del cliente actual */
  static async misOrdenes() {
    try {
      const { usuarioId } = await OrdenController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      return NextResponse.json(await OrdenModel.findByUsuario(usuarioId));
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  /** POST /api/orders — crear orden (checkout) */
  static async create(req: NextRequest) {
    try {
      const { usuarioId } = await OrdenController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      const data = await req.json();
      return NextResponse.json(await OrdenModel.create(usuarioId, data), { status: 201 });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  /** GET /api/admin/orders — todas las órdenes (admin) */
  static async adminIndex(req: NextRequest) {
    try {
      const { rol } = await OrdenController.auth();
      if (rol !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const { searchParams } = new URL(req.url);
      return NextResponse.json(
        await OrdenModel.findAll({ pagina: Number(searchParams.get("pagina")) || 1 })
      );
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  /** PUT /api/admin/orders/:id — cambiar estado */
  static async actualizarEstado(req: NextRequest, id: string) {
    try {
      const { rol } = await OrdenController.auth();
      if (rol !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const { estado } = await req.json();
      const validos = ["PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO", "CANCELADO"];
      if (!validos.includes(estado))
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      return NextResponse.json(await OrdenModel.actualizarEstado(id, estado));
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }
}
