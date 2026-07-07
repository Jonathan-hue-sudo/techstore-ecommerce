// src/app/(shop)/auth/register/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ nombre: "", email: "", contrasena: "", confirmar: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.contrasena !== form.confirmar) { toast.error("Las contraseñas no coinciden"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, contrasena: form.contrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("¡Cuenta creada! Iniciando sesión...");
      await signIn("credentials", { email: form.email, password: form.contrasena, redirect: false });
      router.push("/"); router.refresh();
    } catch (err: any) { toast.error(err.message || "Error al registrarse"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300/40">
              <FiZap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">Tech<span className="text-blue-600">Store</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500 mt-2 text-sm">Únete a TechStore Ecuador hoy</p>
        </div>
        <div className="card shadow-xl shadow-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Nombre completo", name: "nombre",    icon: FiUser, type: "text",     ph: "Tu nombre" },
              { label: "Correo",          name: "email",     icon: FiMail, type: "email",    ph: "tu@email.com" },
              { label: "Contraseña",      name: "contrasena", icon: FiLock, type: "password", ph: "Mínimo 6 caracteres" },
              { label: "Confirmar",       name: "confirmar", icon: FiLock, type: "password", ph: "Repite la contraseña" },
            ].map(({ label, name, icon: Icon, type, ph }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={type} required value={(form as any)[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    placeholder={ph} className="input-field pl-11" minLength={name === "contrasena" ? 6 : undefined} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 shadow-lg shadow-blue-200 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creando cuenta...</> : "Crear cuenta gratis"}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
