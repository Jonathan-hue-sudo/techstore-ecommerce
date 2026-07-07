// src/app/admin/categories/page.tsx
"use client";
import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

interface Categoria { id: string; nombre: string; slug: string; descripcion: string|null; imagen: string|null; _count: { productos: number }; }
const FORM_VACIO = { nombre: "", descripcion: "", imagen: "" };

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editando, setEditando]     = useState<Categoria|null>(null);
  const [form, setForm]             = useState(FORM_VACIO);
  const [guardando, setGuardando]   = useState(false);
  const [preview, setPreview]       = useState("");

  const fetchCategorias = () => {
    setLoading(true);
    fetch("/api/categories").then(r => r.json()).then(setCategorias).finally(() => setLoading(false));
  };
  useEffect(() => { fetchCategorias(); }, []);
  useEffect(() => { setPreview(form.imagen || ""); }, [form.imagen]);

  const abrirCrear  = () => { setEditando(null); setForm(FORM_VACIO); setShowModal(true); };
  const abrirEditar = (c: Categoria) => { setEditando(c); setForm({ nombre: c.nombre, descripcion: c.descripcion || "", imagen: c.imagen || "" }); setShowModal(true); };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { toast.error("El nombre es requerido"); return; }
    setGuardando(true);
    try {
      const url    = editando ? `/api/categories/${editando.id}` : "/api/categories";
      const method = editando ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editando ? "Categoría actualizada" : "Categoría creada");
      setShowModal(false); fetchCategorias();
    } catch (e: any) { toast.error(e.message); } finally { setGuardando(false); }
  };

  const handleEliminar = async (id: string, nombre: string, count: number) => {
    if (count > 0) { toast.error(`No se puede eliminar: tiene ${count} producto(s)`); return; }
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    const res  = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) { toast.success("Categoría eliminada"); fetchCategorias(); }
    else toast.error(data.error || "Error al eliminar");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="font-display font-bold text-3xl text-gray-900">Categorías</h1><p className="text-gray-500 mt-1">{categorias.length} categorías</p></div>
        <button onClick={abrirCrear} className="btn-primary"><FiPlus size={18}/> Nueva categoría</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
      ) : categorias.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTag size={32} className="text-gray-400"/></div>
          <p className="text-gray-500 font-medium mb-4">No hay categorías aún</p>
          <button onClick={abrirCrear} className="btn-primary">Crear primera categoría</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categorias.map((cat) => (
            <div key={cat.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-40 bg-gradient-to-br from-blue-900 to-blue-600">
                {cat.imagen ? (
                  <Image src={cat.imagen} alt={cat.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">⌨︎</div>
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEditar(cat)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blue-600 hover:bg-white shadow-sm"><FiEdit2 size={14}/></button>
                  <button onClick={() => handleEliminar(cat.id, cat.nombre, cat._count.productos)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-white shadow-sm"><FiTrash2 size={14}/></button>
                </div>
                {/* Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/90 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    <FiPackage size={11}/> {cat._count.productos} productos
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-gray-900 text-base leading-tight">{cat.nombre}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5 mb-2">/{cat.slug}</p>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{cat.descripcion || "Sin descripción"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-xl text-gray-900">{editando ? "Editar categoría" : "Nueva categoría"}</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"><FiX size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen de la categoría</label>
                <div className="relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 border-2 border-dashed border-gray-200 mb-2">
                  {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover" onError={() => setPreview("")}/>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 gap-2">
                      <span className="text-4xl">📷</span>
                      <span className="text-xs text-blue-400">Vista previa</span>
                    </div>
                  )}
                </div>
                <input value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} className="input-field text-sm" placeholder="https://images.unsplash.com/..."/>
                <p className="text-xs text-gray-400 mt-1">Pega una URL de imagen de Unsplash, Cloudinary, etc.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="input-field" placeholder="Ej: Smartphones, Gaming, Audio..." autoFocus/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="input-field resize-none" rows={3} placeholder="Descripción breve de la categoría"/>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleGuardar} disabled={guardando} className="btn-primary flex-1">
                {guardando ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Guardando...</> : (editando ? "Actualizar" : "Crear categoría")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
