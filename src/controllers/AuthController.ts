// src/controllers/AuthController.ts — CONTROLLER
import { NextRequest, NextResponse } from "next/server";
import { UsuarioModel } from "@/models/Usuario";

export class AuthController {
  static async register(req: NextRequest) {
    try {
      const { nombre, email, contrasena } = await req.json();
      if (!nombre?.trim() || !email?.trim() || !contrasena)
        return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
      if (contrasena.length < 6)
        return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
      const usuario = await UsuarioModel.create({ nombre, email, contrasena });
      return NextResponse.json({ message: "Usuario registrado exitosamente", usuario }, { status: 201 });
    } catch (e: any) { return NextResponse.json({ error: e.message || "Error al registrar" }, { status: 400 }); }
  }
}
