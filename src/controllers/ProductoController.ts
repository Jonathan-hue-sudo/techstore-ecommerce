// src/controllers/ProductoController.ts — CONTROLLER
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductoModel } from "@/models/Producto";

export class ProductoController {
  static async index(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const result = await ProductoModel.findAll({
        categoriaId: searchParams.get("categoriaId") || undefined,
        busqueda:    searchParams.get("busqueda")    || undefined,
        destacado:   searchParams.get("destacado") === "true" ? true : undefined,
        activo:      searchParams.get("todos") === "true" ? undefined : true,
        pagina:      Number(searchParams.get("pagina"))  || 1,
        limite:      Number(searchParams.get("limite")) || 12,
      });
      return NextResponse.json(result);
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  static async create(req: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const data = await req.json();
      if (!data.nombre || !data.precio || !data.categoriaId)
        return NextResponse.json({ error: "Nombre, precio y categoría son requeridos" }, { status: 400 });
      const producto = await ProductoModel.create(data);
      return NextResponse.json(producto, { status: 201 });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async show(_: NextRequest, id: string) {
    try {
      const producto = await ProductoModel.findById(id);
      if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
      return NextResponse.json(producto);
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  static async update(req: NextRequest, id: string) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const data = await req.json();
      const producto = await ProductoModel.update(id, data);
      return NextResponse.json(producto);
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  static async destroy(_: NextRequest, id: string) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      await ProductoModel.delete(id);
      return NextResponse.json({ message: "Producto eliminado" });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }
}
