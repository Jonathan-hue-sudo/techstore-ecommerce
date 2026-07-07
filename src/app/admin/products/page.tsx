// src/app/admin/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

interface Producto { id: string; nombre: string; precio: any; stock: number; activo: boolean; destacado: boolean; imagen: string|null; categoria: { nombre: string }; }
interface Categoria { id: string; nombre: string; }

const FORM_VACIO = { nombre: "", descripcion: "", precio: "", stock: "", categoriaId: "", imagen: "", destacado: false, activo: true };

export default function AdminProductosPage() {
  const [productos, setProductos]   = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading]       = useState(true);
  const [busqueda, setBusqueda]     = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [editando, setEditando]     = useState<Producto | null>(null);
  const [form, setForm]             = useState(FORM_VACIO);
  const [guardando, setGuardando]   = useState(false);

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      fetch("/api/products?todos=true&limite=200").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]);
    setProductos(p.productos || []); setCategorias(c || []); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const abrirCrear = () => { setEditando(null); setForm({ ...FORM_VACIO, categoriaId: categorias[0]?.id || "" }); setShowModal(true); };
  const abrirEditar = (p: Producto) => {
    setEditando(p);
    setForm({ nombre: p.nombre, descripcion: (p as any).descripcion || "", precio: String(p.precio), stock: String(p.stock), categoriaId: (p as any).categoriaId || "", imagen: p.imagen || "", destacado: p.destacado, activo: p.activo });
    setShowModal(true);
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.precio || !form.categoriaId) { toast.error("Nombre, precio y categoría son requeridos"); return; }
    setGuardando(true);
    try {
      const url    = editando ? `/api/products/${editando.id}` : "/api/products";
      const method = editando ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editando ? "Producto actualizado" : "Producto creado");
      setShowModal(false); fetchData();
    } catch (e: any) { toast.error(e.message); } finally { setGuardando(false); }
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Producto eliminado"); fetchData(); } else toast.error("Error al eliminar");
  };

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="font-display font-bold text-3xl text-gray-900">Productos</h1><p className="text-gray-500 mt-1">{productos.length} productos en total</p></div>
        <button onClick={abrirCrear} className="btn-primary"><FiPlus size={18}/> Nuevo producto</button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar productos..." className="input-field pl-10"/>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Producto","Categoría","Precio","Stock","Estado","Acciones"].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Cargando...</td></tr>
                : filtrados.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No hay productos</td></tr>
                : filtrados.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.imagen ? <Image src={p.imagen} alt={p.nombre} width={40} height={40} className="object-cover w-full h-full"/> : <div className="w-full h-full flex items-center justify-center text-xl">⌨︎</div>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.nombre}</p>
                        {p.destacado && <span className="text-xs text-blue-600 font-medium">🗲 Destacado</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.categoria?.nombre}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">{formatPrice(p.precio)}</td>
                  <td className="px-6 py-4"><span className={`text-sm font-semibold ${p.stock <= 5 ? "text-red-500" : "text-gray-900"}`}>{p.stock}</span></td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.activo ? "Activo" : "Inactivo"}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={15}/></button>
                      <button onClick={() => handleEliminar(p.id, p.nombre)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-xl text-gray-900">{editando ? "Editar producto" : "Nuevo producto"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nombre *",    key: "nombre",      type: "text",   ph: "Ej: iPhone 15 Pro Max" },
                { label: "URL imagen",  key: "imagen",      type: "text",   ph: "https://..." },
              ].map(({ label, key, type, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input-field" placeholder={ph}/>
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="input-field resize-none" rows={3} placeholder="Descripción del producto"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio *</label><input type="number" step="0.01" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="input-field" placeholder="0.00"/></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="0"/></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría *</label>
                <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })} className="input-field">
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.destacado} onChange={e => setForm({ ...form, destacado: e.target.checked })} className="w-4 h-4 rounded text-blue-600"/><span className="text-sm font-medium text-gray-700">🗲 Destacado</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} className="w-4 h-4 rounded text-blue-600"/><span className="text-sm font-medium text-gray-700">Activo</span></label>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleGuardar} disabled={guardando} className="btn-primary flex-1">{guardando ? "Guardando..." : (editando ? "Actualizar" : "Crear producto")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
