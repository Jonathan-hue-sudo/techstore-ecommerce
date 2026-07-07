// src/controllers/CarritoController.ts — CONTROLLER
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CarritoModel } from "@/models/Carrito";

export class CarritoController {
  private static async auth() {
    const session = await getServerSession(authOptions);
    if (!session) return { session: null, usuarioId: null };
    return { session, usuarioId: (session.user as any).id as string };
  }

  static async index() {
    try {
      const { usuarioId } = await CarritoController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      const items = await CarritoModel.getCarrito(usuarioId);
      const total = items.reduce((s, i) => s + Number(i.producto.precio) * i.cantidad, 0);
      return NextResponse.json({ items, total });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  static async agregarItem(req: NextRequest) {
    try {
      const { usuarioId } = await CarritoController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      const { productoId, cantidad } = await req.json();
      if (!productoId) return NextResponse.json({ error: "productoId requerido" }, { status: 400 });
      const item = await CarritoModel.agregarItem(usuarioId, productoId, cantidad || 1);
      return NextResponse.json(item, { status: 201 });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async actualizarItem(req: NextRequest, productoId: string) {
    try {
      const { usuarioId } = await CarritoController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      const { cantidad } = await req.json();
      return NextResponse.json(await CarritoModel.actualizarItem(usuarioId, productoId, cantidad));
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async eliminarItem(_: NextRequest, productoId: string) {
    try {
      const { usuarioId } = await CarritoController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      await CarritoModel.eliminarItem(usuarioId, productoId);
      return NextResponse.json({ message: "Item eliminado" });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  static async vaciar() {
    try {
      const { usuarioId } = await CarritoController.auth();
      if (!usuarioId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      await CarritoModel.vaciarCarrito(usuarioId);
      return NextResponse.json({ message: "Carrito vaciado" });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }
}
