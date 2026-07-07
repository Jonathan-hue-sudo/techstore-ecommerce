// src/app/(shop)/auth/error/page.tsx
"use client";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle size={32} className="text-red-500" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">Error de autenticación</h1>
        <p className="text-gray-600 mb-8">Hubo un problema al iniciar sesión. Por favor intenta de nuevo.</p>
        <Link href="/auth/login" className="btn-primary">Intentar de nuevo</Link>
      </div>
    </div>
  );
}
