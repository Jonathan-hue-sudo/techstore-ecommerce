// src/app/admin/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { FiUsers, FiShield, FiUser } from "react-icons/fi";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(setUsuarios).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-gray-900">Usuarios</h1>
        <p className="text-gray-500 mt-1">{usuarios.length} usuarios registrados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total usuarios",    value: usuarios.length,                                    icon: FiUsers,  color: "text-blue-600",   bg: "bg-blue-50" },
          { label: "Administradores",   value: usuarios.filter(u => u.rol === "ADMIN").length,     icon: FiShield, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Clientes",          value: usuarios.filter(u => u.rol === "CLIENTE").length,   icon: FiUser,   color: "text-green-600",  bg: "bg-green-50" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={s.color} size={22}/>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className="font-display font-bold text-2xl text-gray-900">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Usuario","Email","Rol","Registro"].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? <tr><td colSpan={4} className="text-center py-12 text-gray-400">Cargando...</td></tr>
                : usuarios.map(usuario => (
                <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{usuario.nombre?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{usuario.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      usuario.rol === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                    }`}>
                      {usuario.rol === "ADMIN" ? "Administrador" : "Cliente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(usuario.creadoEn).toLocaleDateString("es-EC", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
