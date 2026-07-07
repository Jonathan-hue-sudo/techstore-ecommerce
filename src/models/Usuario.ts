// src/models/Usuario.ts — MODEL
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface CrearUsuarioInput {
  nombre: string;
  email: string;
  contrasena: string;
  rol?: "ADMIN" | "CLIENTE";
}

export class UsuarioModel {
  static async findAll() {
    return prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
      orderBy: { creadoEn: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    });
  }

  static async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  static async create(data: CrearUsuarioInput) {
    const existente = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (existente) throw new Error("El email ya está registrado");
    const hash = await bcrypt.hash(data.contrasena, 12);
    return prisma.usuario.create({
      data: { ...data, contrasena: hash, rol: data.rol || "CLIENTE" },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    });
  }

  static async getStats() {
    const [total, admins, clientes] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: { rol: "ADMIN" } }),
      prisma.usuario.count({ where: { rol: "CLIENTE" } }),
    ]);
    return { total, admins, clientes };
  }
}
