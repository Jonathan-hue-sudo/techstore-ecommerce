// src/app/(shop)/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPackage } from "react-icons/fi";

const estadoConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDIENTE:  { label: "Pendiente",   color: "bg-yellow-100 text-yellow-700", icon: FiClock },
  PROCESANDO: { label: "En proceso",  color: "bg-blue-100 text-blue-700",     icon: FiPackage },
  ENVIADO:    { label: "Enviado",     color: "bg-purple-100 text-purple-700", icon: FiTruck },
  ENTREGADO:  { label: "Entregado",   color: "bg-green-100 text-green-700",   icon: FiCheckCircle },
  CANCELADO:  { label: "Cancelado",   color: "bg-red-100 text-red-700",       icon: FiXCircle },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (session) {
      fetch("/api/orders").then(r => r.json()).then(setOrdenes).finally(() => setLoading(false));
    }
  }, [status, session]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Mi cuenta</p>
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">Mis Órdenes</h1>
      {ordenes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No tienes órdenes aún</h3>
          <button onClick={() => router.push("/shop")} className="btn-primary mt-4">Ir a la tienda</button>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => {
            const s = estadoConfig[orden.estado] || estadoConfig.PENDIENTE;
            const Icon = s.icon;
            return (
              <div key={orden.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">#{orden.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{new Date(orden.creadoEn).toLocaleDateString("es-EC", { dateStyle: "long" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>
                      <Icon size={11} /> {s.label}
                    </span>
                    <span className="font-display font-bold text-xl text-blue-700">{formatPrice(orden.total)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">{orden.items?.length || 0} producto(s)</p>
                  <div className="flex flex-wrap gap-2">
                    {orden.items?.slice(0,3).map((item: any) => (
                      <span key={item.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                        {item.producto?.nombre || "Producto"} x{item.cantidad}
                      </span>
                    ))}
                    {orden.items?.length > 3 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">+{orden.items.length - 3} más</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
