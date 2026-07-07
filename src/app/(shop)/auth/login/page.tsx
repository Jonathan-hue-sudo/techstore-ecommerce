// src/app/(shop)/auth/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (res?.error) toast.error("Credenciales incorrectas");
      else { toast.success("¡Bienvenido!"); router.push("/"); router.refresh(); }
    } finally { setLoading(false); }
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
          <h1 className="font-display font-bold text-3xl text-gray-900">Iniciar sesión</h1>
          <p className="text-gray-500 mt-2 text-sm">Accede a tu cuenta para continuar</p>
        </div>

        <div className="card shadow-xl shadow-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com" className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showPass ? "text" : "password"} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pl-11 pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 shadow-lg shadow-blue-200">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Ingresando...</> : "Iniciar sesión"}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-blue-600 font-semibold hover:text-blue-700">Regístrate aquí</Link>
            </p>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-800 mb-1.5">Este es un proyecto Universitario de los estudiantes:</p>
            <p className="text-xs text-blue-700 font-mono">1.	Peñafiel Carchi Jonathan Gabriel</p>
            <p className="text-xs text-blue-700 font-mono">2.	Mendoza Ortegano Kevin Steven</p>
            <p className="text-xs text-blue-700 font-mono">3.	Sánchez Serrano Joseline Johanna</p>
            <p className="text-xs text-blue-700 font-mono">4.	Pilligua Alarcon Cristopher Juliam</p>
            <p className="text-xs text-blue-700 font-mono">5.	Groenow Menoscal Edgar Luis</p>
            <p className="text-xs font-bold text-blue-800 mb-1.5">Cuentas para probar:</p>
            <p className="text-xs text-blue-700 font-mono">Admin:   admin@techstore.ec / admin123</p>
            <p className="text-xs text-blue-700 font-mono">Cliente: cliente@techstore.ec / cliente123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
