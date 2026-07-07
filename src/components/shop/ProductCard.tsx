// src/components/shop/ProductCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { FiShoppingCart, FiZap } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  producto: {
    id: string;
    nombre: string;
    slug: string;
    precio: any;
    imagen: string | null;
    stock: number;
    destacado: boolean;
    categoria: { nombre: string };
  };
}

export default function ProductCard({ producto }: Props) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { router.push("/auth/login"); return; }
    setAdding(true);
    await addItem(producto.id);
    setAdding(false);
  };

  return (
    <Link href={`/shop/${producto.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {producto.imagen ? (
            <Image src={producto.imagen} alt={producto.nombre} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-200">⌨︎</div>
          )}
          {producto.destacado && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <FiZap size={9} /> DESTACADO
            </div>
          )}
          {producto.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-xl text-sm">Sin stock</span>
            </div>
          )}
          {producto.stock > 0 && producto.stock <= 5 && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ¡Solo {producto.stock} en stock!
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            {producto.categoria.nombre}
          </p>
          <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 min-h-[40px] group-hover:text-blue-700 transition-colors">
            {producto.nombre}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-blue-700 font-display font-bold text-lg">
                {formatPrice(producto.precio)}
              </span>
            </div>
            <button onClick={handleAdd} disabled={adding || producto.stock <= 0}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-blue-200">
              {adding ? (
                <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiShoppingCart size={17} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
