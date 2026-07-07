// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiRefreshCw, FiArrowUpRight } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

export default function AdminDashboard() {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const cargarStats = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar estadísticas");
      setStats(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarStats(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Cargando estadísticas...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
        <FiAlertTriangle size={28} className="text-red-500" />
      </div>
      <p className="font-semibold text-gray-900">{error}</p>
      <button onClick={cargarStats} className="btn-primary"><FiRefreshCw size={16}/> Reintentar</button>
    </div>
  );

  const chartData = (stats?.ordenes?.mensual || []).map((m: any) => {
    const [, mes] = (m.mes || "").split("-");
    return { mes: mes ? MESES[parseInt(mes, 10) - 1] : "", ingresos: Number(m.total || 0) };
  });

  const tarjetas = [
    { label: "Ingresos Totales", value: formatPrice(stats?.ordenes?.ingresos || 0), icon: FiDollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", sub: "Órdenes no canceladas" },
    { label: "Total Órdenes",    value: stats?.ordenes?.total ?? 0,     icon: FiShoppingBag, color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100",    sub: `${stats?.ordenes?.pendientes ?? 0} pendientes` },
    { label: "Productos",        value: stats?.productos?.activos ?? 0, icon: FiPackage,     color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-100",  sub: `${stats?.productos?.stockBajo ?? 0} con stock bajo` },
    { label: "Clientes",         value: stats?.usuarios?.clientes ?? 0, icon: FiUsers,       color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-100",  sub: `${stats?.usuarios?.total ?? 0} usuarios totales` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen de TechStore</p>
        </div>
        <button onClick={cargarStats} className="btn-secondary text-sm"><FiRefreshCw size={15}/> Actualizar</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {tarjetas.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`card border ${s.border} hover:shadow-md transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center`}><Icon className={s.color} size={22}/></div>
                <FiArrowUpRight size={16} className="text-gray-300"/>
              </div>
              <p className="font-display font-bold text-3xl text-gray-900 mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-gray-700">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><FiTrendingUp className="text-blue-600" size={18}/></div>
              <div>
                <h2 className="font-display font-bold text-lg text-gray-900">Ingresos mensuales</h2>
                <p className="text-xs text-gray-400">Últimos 6 meses</p>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-emerald-600">{formatPrice(stats?.ordenes?.ingresos || 0)}</span>
          </div>
          {chartData.some((d: any) => d.ingresos > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} width={55}/>
                <Tooltip formatter={(v: any) => [formatPrice(v), "Ingresos"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}/>
                <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad)" dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400">
              <div className="text-center"><p className="font-medium">Sin ventas en los últimos 6 meses</p><p className="text-sm mt-1">Los datos aparecerán aquí cuando haya órdenes</p></div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Resumen rápido</h2>
            <div className="space-y-0">
              {[
                { label: "Órdenes pendientes",  value: stats?.ordenes?.pendientes  ?? 0, color: "text-yellow-600", dot: "bg-yellow-400" },
                { label: "Productos activos",    value: stats?.productos?.activos   ?? 0, color: "text-green-600",  dot: "bg-green-400" },
                { label: "Productos destacados", value: stats?.productos?.destacados ?? 0, color: "text-blue-600",   dot: "bg-blue-400" },
                { label: "Stock bajo (≤5)",      value: stats?.productos?.stockBajo ?? 0, color: "text-red-600",    dot: "bg-red-400" },
                { label: "Total usuarios",       value: stats?.usuarios?.total      ?? 0, color: "text-purple-600", dot: "bg-purple-400" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5"><div className={`w-2 h-2 rounded-full ${item.dot}`}/><span className="text-sm text-gray-600">{item.label}</span></div>
                  <span className={`font-bold text-base ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {(stats?.productos?.stockBajo || 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <FiAlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18}/>
              <div>
                <p className="font-semibold text-amber-900 text-sm">¡Stock bajo!</p>
                <p className="text-amber-700 text-xs mt-0.5">{stats.productos.stockBajo} producto(s) con 5 o menos unidades.</p>
                <Link href="/admin/products" className="text-xs font-bold text-amber-800 underline mt-1 inline-block">Ver productos →</Link>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="font-display font-bold text-base text-gray-900 mb-3">Acciones rápidas</h2>
            <div className="space-y-1">
              {[
                ["/admin/products",   "☀︎ Agregar producto"],
                ["/admin/categories", "🏷️ Agregar categoría"],
                ["/admin/orders",     "📦 Ver órdenes"],
                ["/admin/users",      "👥 Ver usuarios"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
