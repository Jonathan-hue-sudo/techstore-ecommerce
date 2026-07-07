// src/app/(shop)/shop/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { FiShoppingCart, FiArrowLeft, FiPackage, FiShield, FiZap } from "react-icons/fi";
import Link from "next/link";

export default function ProductoPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const router = useRouter();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`/api/products?limite=100`)
      .then(r => r.json())
      .then(data => {
        const found = data.productos?.find((p: any) => p.slug === slug);
        setProducto(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    if (!session) { router.push("/auth/login"); return; }
    setAdding(true);
    await addItem(producto.id, cantidad);
    setAdding(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!producto) return (
    <div className="text-center py-20 max-w-md mx-auto px-4">
      <div className="text-6xl mb-4">☹︎</div>
      <h2 className="font-display font-bold text-2xl mb-2">Producto no encontrado</h2>
      <Link href="/shop" className="btn-primary mt-4 inline-flex">Volver a la tienda</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-medium transition-colors text-sm">
        <FiArrowLeft size={16} /> Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
          {producto.imagen ? (
            <Image src={producto.imagen} alt={producto.nombre} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blue-50 to-indigo-100">⌨︎</div>
          )}
          {producto.destacado && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <FiZap size={11} /> DESTACADO
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="flex flex-col">
          <p className="text-blue-600 font-semibold uppercase tracking-widest text-xs mb-3">
            {producto.categoria?.nombre}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
            {producto.nombre}
          </h1>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display font-bold text-4xl text-blue-700">{formatPrice(producto.precio)}</span>
          </div>

          {producto.descripcion && (
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{producto.descripcion}</p>
          )}

          {/* Stock badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-6 self-start ${
            producto.stock > 5 ? "bg-green-50 text-green-700" : producto.stock > 0 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"
          }`}>
            <FiPackage size={14} />
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock"}
          </div>

          {/* Cantidad */}
          {producto.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium text-sm">Cantidad:</span>
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-8 h-8 rounded-lg bg-white font-bold flex items-center justify-center hover:bg-gray-50 shadow-sm transition-all text-lg">−</button>
                <span className="font-bold w-8 text-center">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="w-8 h-8 rounded-lg bg-white font-bold flex items-center justify-center hover:bg-gray-50 shadow-sm transition-all text-lg">+</button>
              </div>
            </div>
          )}

          <button onClick={handleAdd} disabled={adding || producto.stock <= 0}
            className="btn-primary py-4 text-base mb-4 shadow-lg shadow-blue-200">
            {adding ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Agregando...</>
            ) : (
              <><FiShoppingCart size={20} /> Agregar al carrito</>
            )}
          </button>

          {/* Garantías */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { icon: FiShield, text: "Garantía oficial" },
              { icon: FiZap,    text: "Envío rápido" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Icon size={15} className="text-blue-600 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
