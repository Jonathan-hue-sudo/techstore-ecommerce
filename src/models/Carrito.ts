// src/models/Carrito.ts — MODEL
import { prisma } from "@/lib/prisma";

export class CarritoModel {
  static async getCarrito(usuarioId: string) {
    return prisma.itemCarrito.findMany({
      where: { usuarioId },
      include: { producto: { include: { categoria: true } } },
      orderBy: { creadoEn: "desc" },
    });
  }

  static async agregarItem(usuarioId: string, productoId: string, cantidad: number = 1) {
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto || !producto.activo) throw new Error("Producto no disponible");
    if (producto.stock < cantidad) throw new Error(`Stock insuficiente. Disponible: ${producto.stock}`);

    const existente = await prisma.itemCarrito.findUnique({
      where: { usuarioId_productoId: { usuarioId, productoId } },
    });

    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidad;
      if (producto.stock < nuevaCantidad) throw new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
      return prisma.itemCarrito.update({
        where: { usuarioId_productoId: { usuarioId, productoId } },
        data: { cantidad: nuevaCantidad },
        include: { producto: true },
      });
    }

    return prisma.itemCarrito.create({
      data: { usuarioId, productoId, cantidad },
      include: { producto: true },
    });
  }

  static async actualizarItem(usuarioId: string, productoId: string, cantidad: number) {
    if (cantidad <= 0) return this.eliminarItem(usuarioId, productoId);
    return prisma.itemCarrito.update({
      where: { usuarioId_productoId: { usuarioId, productoId } },
      data: { cantidad },
      include: { producto: true },
    });
  }

  static async eliminarItem(usuarioId: string, productoId: string) {
    return prisma.itemCarrito.delete({
      where: { usuarioId_productoId: { usuarioId, productoId } },
    });
  }

  static async vaciarCarrito(usuarioId: string) {
    return prisma.itemCarrito.deleteMany({ where: { usuarioId } });
  }
}
