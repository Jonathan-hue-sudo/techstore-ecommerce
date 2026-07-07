// src/app/(shop)/checkout/page.tsx
"use client";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, calcularIVA, totalConIVA } from "@/lib/utils";
import { FiMapPin, FiPhone, FiFileText, FiCheckCircle } from "react-icons/fi";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, total, checkout, isLoading, fetchCart } = useCart();
  const router = useRouter();
  const [form, setForm]       = useState({ direccion: "", telefono: "", notas: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (session) fetchCart();
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await checkout(form); setSuccess(true); } catch {}
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-3">¡Orden realizada!</h1>
        <p className="text-gray-600 mb-8 text-sm">Tu orden fue procesada. Te notificaremos cuando sea enviada.</p>
        <button onClick={() => router.push("/orders")} className="btn-primary mr-3">Ver mis órdenes</button>
        <button onClick={() => router.push("/shop")}   className="btn-secondary">Seguir comprando</button>
      </div>
    </div>
  );

  const subtotal   = total();
  const iva        = calcularIVA(subtotal);
  const totalFinal = totalConIVA(subtotal);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Datos de entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Dirección de entrega", name: "direccion", icon: FiMapPin,   type: "textarea", ph: "Calle, número, ciudad, provincia..." },
                { label: "Teléfono de contacto", name: "telefono",  icon: FiPhone,    type: "tel",      ph: "0999 999 999" },
                { label: "Notas adicionales",    name: "notas",     icon: FiFileText, type: "textarea", ph: "Instrucciones especiales..." },
              ].map(({ label, name, icon: Icon, type, ph }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <div className="relative">
                    <Icon
                      className={`absolute left-4 ${type === "textarea" ? "top-3.5" : "top-1/2 -translate-y-1/2"} text-gray-400`}
                      size={16}
                    />
                    {type === "textarea" ? (
                      <textarea
                        value={(form as any)[name]}
                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                        placeholder={ph} rows={3}
                        className="input-field pl-11 resize-none"
                      />
                    ) : (
                      <input
                        type={type}
                        value={(form as any)[name]}
                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                        placeholder={ph}
                        className="input-field pl-11"
                      />
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="btn-primary w-full py-4 shadow-lg shadow-blue-200">
                {isLoading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando...</>
                  : `Confirmar orden • ${formatPrice(totalFinal)}`
                }
              </button>
            </form>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-2">
          <div className="card sticky top-20">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Resumen de orden</h2>

            {/* Lista de productos */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.productoId} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.producto?.imagen ? (
                      <Image src={item.producto.imagen} alt={item.producto.nombre} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">💻</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.producto?.nombre}</p>
                    <p className="text-xs text-gray-500">x{item.cantidad}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {formatPrice(Number(item.producto?.precio) * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            {/* Desglose de precios con IVA */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal (sin IVA)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>

              {/* IVA destacado */}
              <div className="flex justify-between items-center text-sm bg-blue-50 px-3 py-2 rounded-xl">
                <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                  IVA
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">15%</span>
                </span>
                <span className="text-blue-700 font-bold">{formatPrice(iva)}</span>
              </div>

              {/* Total final */}
              <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total con IVA</span>
                <span className="text-blue-700 text-xl">{formatPrice(totalFinal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
