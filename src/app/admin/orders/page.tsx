// src/app/admin/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPackage, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";

const estadoConfig: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: "Pendiente",   color: "bg-yellow-100 text-yellow-700" },
  PROCESANDO: { label: "En proceso",  color: "bg-blue-100 text-blue-700" },
  ENVIADO:    { label: "Enviado",     color: "bg-purple-100 text-purple-700" },
  ENTREGADO:  { label: "Entregado",   color: "bg-green-100 text-green-700" },
  CANCELADO:  { label: "Cancelado",   color: "bg-red-100 text-red-700" },
};
const estadosValidos = ["PENDIENTE","PROCESANDO","ENVIADO","ENTREGADO","CANCELADO"];

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actualizando, setAct]    = useState<string|null>(null);

  useEffect(() => {
    fetch("/api/admin/orders").then(r => r.json()).then(data => {
      setOrdenes(data.ordenes || []); setLoading(false);
    });
  }, []);

  const cambiarEstado = async (id: string, estado: string) => {
    setAct(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        toast.success("Estado actualizado");
        setOrdenes(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
      } else toast.error("Error al actualizar");
    } finally { setAct(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-gray-900">Órdenes</h1>
        <p className="text-gray-500 mt-1">{ordenes.length} órdenes en total</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["# Orden","Cliente","Productos","Total","Fecha","Estado"].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Cargando órdenes...</td></tr>
                : ordenes.length === 0
                  ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No hay órdenes aún</td></tr>
                  : ordenes.map(orden => {
                    const s = estadoConfig[orden.estado] || estadoConfig.PENDIENTE;
                    return (
                      <tr key={orden.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4"><span className="font-mono text-sm font-semibold text-gray-700">#{orden.id.slice(-8).toUpperCase()}</span></td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{orden.usuario?.nombre}</p>
                          <p className="text-xs text-gray-500">{orden.usuario?.email}</p>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-700">{orden.items?.length || 0} producto(s)</span></td>
                        <td className="px-6 py-4"><span className="font-bold text-blue-700">{formatPrice(orden.total)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-600">{new Date(orden.creadoEn).toLocaleDateString("es-EC", { dateStyle: "medium" })}</span></td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select value={orden.estado} onChange={e => cambiarEstado(orden.id, e.target.value)}
                              disabled={actualizando === orden.id}
                              className={`appearance-none pr-7 pl-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${s.color}`}>
                              {estadosValidos.map(st => (
                                <option key={st} value={st}>{estadoConfig[st].label}</option>
                              ))}
                            </select>
                            <FiChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
