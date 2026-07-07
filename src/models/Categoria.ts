// src/models/Categoria.ts — MODEL
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface CrearCategoriaInput {
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

export class CategoriaModel {
  static async findAll() {
    return prisma.categoria.findMany({
      include: { _count: { select: { productos: true } } },
      orderBy: { nombre: "asc" },
    });
  }

  static async findById(id: string) {
    return prisma.categoria.findUnique({
      where: { id },
      include: { productos: { where: { activo: true } } },
    });
  }

  static async create(data: CrearCategoriaInput) {
    const slug = slugify(data.nombre);
    return prisma.categoria.create({ data: { ...data, slug } });
  }

  static async update(id: string, data: Partial<CrearCategoriaInput>) {
    const updateData: any = { ...data };
    if (data.nombre) updateData.slug = slugify(data.nombre);
    return prisma.categoria.update({ where: { id }, data: updateData });
  }

  static async delete(id: string) {
    const count = await prisma.producto.count({ where: { categoriaId: id } });
    if (count > 0) throw new Error(`No se puede eliminar: tiene ${count} producto(s) asociado(s)`);
    return prisma.categoria.delete({ where: { id } });
  }
}
