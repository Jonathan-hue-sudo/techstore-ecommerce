// src/models/Orden.ts — MODEL
import { prisma } from "@/lib/prisma";
import { CarritoModel } from "./Carrito";

export class OrdenModel {
  static async create(usuarioId: string, data: { direccion?: string; telefono?: string; notas?: string }) {
    const items = await CarritoModel.getCarrito(usuarioId);
    if (items.length === 0) throw new Error("El carrito está vacío");

    const total = items.reduce((sum, item) => sum + Number(item.producto.precio) * item.cantidad, 0);

    return prisma.$transaction(async (tx) => {
      // Verificar stock
      for (const item of items) {
        const prod = await tx.producto.findUnique({ where: { id: item.productoId } });
        if (!prod || prod.stock < item.cantidad)
          throw new Error(`Stock insuficiente para: ${item.producto.nombre}`);
      }

      // Crear orden con sus ítems
      const nuevaOrden = await tx.orden.create({
        data: {
          usuarioId,
          total,
          ...data,
          items: {
            create: items.map((item) => ({
              productoId: item.productoId,
              cantidad:   item.cantidad,
              precio:     item.producto.precio,
            })),
          },
        },
        include: { items: { include: { producto: true } }, usuario: true },
      });

      // Descontar stock
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data:  { stock: { decrement: item.cantidad } },
        });
      }

      // Vaciar carrito
      await tx.itemCarrito.deleteMany({ where: { usuarioId } });

      return nuevaOrden;
    });
  }

  static async findByUsuario(usuarioId: string) {
    return prisma.orden.findMany({
      where:   { usuarioId },
      include: { items: { include: { producto: true } } },
      orderBy: { creadoEn: "desc" },
    });
  }

  static async findAll(opciones?: { pagina?: number; limite?: number }) {
    const { pagina = 1, limite = 20 } = opciones || {};
    const [ordenes, total] = await Promise.all([
      prisma.orden.findMany({
        include: { usuario: { select: { nombre: true, email: true } }, items: true },
        orderBy: { creadoEn: "desc" },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.orden.count(),
    ]);
    return { ordenes, total };
  }

  static async actualizarEstado(id: string, estado: string) {
    return prisma.orden.update({ where: { id }, data: { estado: estado as any } });
  }

  static async getStats() {
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const [total, pendientes, ingresos, ordenesRecientes] = await Promise.all([
      prisma.orden.count(),
      prisma.orden.count({ where: { estado: "PENDIENTE" } }),
      prisma.orden.aggregate({
        _sum: { total: true },
        where: { estado: { not: "CANCELADO" } },
      }),
      prisma.orden.findMany({
        where:   { estado: { not: "CANCELADO" }, creadoEn: { gte: seisMesesAtras } },
        select:  { total: true, creadoEn: true },
        orderBy: { creadoEn: "asc" },
      }),
    ]);

    // Agrupar por mes en JS (evita $queryRaw)
    const mapaMensual: Record<string, number> = {};
    for (const orden of ordenesRecientes) {
      const d    = new Date(orden.creadoEn);
      const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      mapaMensual[clave] = (mapaMensual[clave] || 0) + Number(orden.total);
    }

    const mensual: { mes: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d    = new Date();
      d.setMonth(d.getMonth() - i);
      const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      mensual.push({ mes: clave, total: mapaMensual[clave] || 0 });
    }

    return { total, pendientes, ingresos: Number(ingresos._sum.total || 0), mensual };
  }
}
