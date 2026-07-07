// src/components/shop/CartSidebar.tsx
"use client";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calcularIVA, totalConIVA } from "@/lib/utils";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiZap } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateItem, removeItem, total } = useCart();
  const subtotal = total();
  const iva      = calcularIVA(subtotal);
  const totalFinal = totalConIVA(subtotal);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={closeCart} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0a0f1e] z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <FiZap size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-display font-bold text-lg leading-none">Mi Carrito</h2>
              <p className="text-gray-400 text-xs mt-0.5">{items.length} producto(s)</p>
            </div>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <FiShoppingBag size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium mb-1">Tu carrito está vacío</p>
              <p className="text-gray-600 text-sm mb-6">Agrega productos para comenzar</p>
              <button onClick={closeCart} className="btn-primary text-sm">Ver tienda</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productoId || (item as any).productId}
                className="flex gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                  {item.producto?.imagen || (item as any).product?.image ? (
                    <Image
                      src={item.producto?.imagen || (item as any).product?.image}
                      alt={item.producto?.nombre || (item as any).product?.name}
                      fill className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">💻</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
                    {item.producto?.nombre || (item as any).product?.name}
                  </p>
                  <p className="text-blue-400 font-bold text-sm mt-0.5">
                    {formatPrice(item.producto?.precio || (item as any).product?.price)}
                    <span className="text-gray-500 font-normal text-xs ml-1">c/u (sin IVA)</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateItem(item.productoId || (item as any).productId, item.cantidad - 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors">
                      <FiMinus size={11} />
                    </button>
                    <span className="font-bold text-sm text-white w-5 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateItem(item.productoId || (item as any).productId, item.cantidad + 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors">
                      <FiPlus size={11} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productoId || (item as any).productId)}
                      className="ml-auto text-red-400 hover:text-red-300 transition-colors p-1">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con desglose de IVA */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-3">
            {/* Desglose */}
            <div className="space-y-2 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-gray-300">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  IVA{" "}
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-md font-semibold">15%</span>
                </span>
                <span className="text-gray-300">{formatPrice(iva)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Envío</span>
                <span className="text-green-400 font-semibold">Gratis</span>
              </div>
            </div>

            {/* Total final */}
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-base">Total con IVA</span>
              <span className="text-2xl font-display font-bold text-white">{formatPrice(totalFinal)}</span>
            </div>

            <Link href="/checkout" onClick={closeCart}
              className="btn-primary w-full py-3.5 text-sm shadow-lg shadow-blue-600/30">
              Proceder al pago — {formatPrice(totalFinal)}
            </Link>
            <button onClick={closeCart}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
