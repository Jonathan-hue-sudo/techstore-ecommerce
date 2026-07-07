// src/models/Producto.ts — MODEL
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface CrearProductoInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: string;
  imagen?: string;
  destacado?: boolean;
}

export interface ActualizarProductoInput extends Partial<CrearProductoInput> {
  activo?: boolean;
}

export class ProductoModel {
  static async findAll(opciones?: {
    categoriaId?: string;
    busqueda?: string;
    destacado?: boolean;
    activo?: boolean;
    pagina?: number;
    limite?: number;
  }) {
    const { categoriaId, busqueda, destacado, activo = true, pagina = 1, limite = 12 } = opciones || {};

    const where: any = { activo };
    if (categoriaId) where.categoriaId = categoriaId;
    if (destacado !== undefined) where.destacado = destacado;
    if (busqueda) where.OR = [
      { nombre: { contains: busqueda } },
      { descripcion: { contains: busqueda } },
    ];

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: { categoria: true },
        orderBy: { creadoEn: "desc" },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.producto.count({ where }),
    ]);

    return { productos, total, paginas: Math.ceil(total / limite) };
  }

  static async findById(id: string) {
    return prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
  }

  static async findBySlug(slug: string) {
    return prisma.producto.findUnique({ where: { slug }, include: { categoria: true } });
  }

  static async create(data: CrearProductoInput) {
    const slug = slugify(data.nombre);
    return prisma.producto.create({
      data: { ...data, slug },
      include: { categoria: true },
    });
  }

  static async update(id: string, data: ActualizarProductoInput) {
    const updateData: any = { ...data };
    if (data.nombre) updateData.slug = slugify(data.nombre);
    return prisma.producto.update({ where: { id }, data: updateData, include: { categoria: true } });
  }

  static async delete(id: string) {
    return prisma.producto.delete({ where: { id } });
  }

  static async getStats() {
    const [total, activos, destacados, stockBajo] = await Promise.all([
      prisma.producto.count(),
      prisma.producto.count({ where: { activo: true } }),
      prisma.producto.count({ where: { destacado: true } }),
      prisma.producto.count({ where: { stock: { lte: 5 } } }),
    ]);
    return { total, activos, destacados, stockBajo };
  }
}
