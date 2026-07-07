// src/app/(shop)/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";
import { FiZap, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight, FiCpu, FiSmartphone, FiMonitor } from "react-icons/fi";

async function getDestacados() {
  return prisma.producto.findMany({
    where: { destacado: true, activo: true },
    include: { categoria: true },
    take: 4,
    orderBy: { creadoEn: "desc" },
  });
}

async function getCategorias() {
  return prisma.categoria.findMany({
    include: { _count: { select: { productos: true } } },
    take: 8,
  });
}

export default async function HomePage() {
  const [destacados, categorias] = await Promise.all([getDestacados(), getCategorias()]);

  return (
    <div className="min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        {/* Background glow effects */}
        <div className="absolute inset-0 circuit-bg" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <FiZap size={14} className="text-cyan-400" /> Productos originales con garantía
              </div>
              <h1 className="font-display font-bold text-5xl md:text-6xl xl:text-7xl leading-tight mb-6">
                La tecnología
                <br />
                <span className="gradient-text">del futuro,</span>
                <br />
                hoy en Ecuador
              </h1>
              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                Smartphones, laptops, gaming y más. Todos los productos electrónicos que necesitas, con garantía oficial y entrega rápida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/40 text-base group">
                  Ver todos los productos
                  <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/shop?destacado=true"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm">
                  ⚡ Ofertas destacadas
                </Link>
              </div>
            </div>

            {/* Visual — stats grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-slide-up">
              {[
                { icon: FiSmartphone,  label: "Smartphones",   val: "150+",  color: "from-blue-500 to-cyan-500" },
                { icon: FiMonitor,     label: "Laptops y PCs", val: "80+",   color: "from-violet-500 to-blue-500" },
                { icon: FiCpu,         label: "Accesorios",    val: "300+",  color: "from-cyan-500 to-teal-500" },
                { icon: FiHeadphones,  label: "Audio",         val: "60+",   color: "from-pink-500 to-violet-500" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="tech-card p-6 group hover:bg-white/10 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="font-display font-bold text-3xl text-white">{val}</p>
                  <p className="text-gray-400 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { emoji: "⛴︎", title: "Envío rápido",   desc: "24-48 horas a todo Ecuador" },
            { emoji: "⚔︎", title: "Pago seguro",    desc: "Transacciones 100% protegidas" },
            { emoji: "✔︎", title: "100% Original",  desc: "Productos con garantía oficial" },
            { emoji: "☎︎", title: "Soporte técnico", desc: "Asesoría especializada 24/7" },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ────────────────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Explora</p>
            <h2 className="font-display font-bold text-3xl text-gray-900">Categorías</h2>
          </div>
          <Link href="/shop" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 text-sm">
            Ver todo <FiArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categorias.map((cat) => (
            <Link key={cat.id} href={`/shop?categoriaId=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-200 block">
              {cat.imagen ? (
                <Image src={cat.imagen} alt={cat.nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-5xl">💻</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display font-bold text-white text-sm leading-tight">{cat.nombre}</p>
                <p className="text-gray-300 text-xs mt-0.5">{cat._count.productos} productos</p>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 ring-2 ring-cyan-400/0 group-hover:ring-cyan-400/60 rounded-2xl transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ──────────────────────────────────── */}
      {destacados.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">⚡ Selección especial</p>
                <h2 className="font-display font-bold text-3xl text-gray-900">Productos destacados</h2>
              </div>
              <Link href="/shop?destacado=true" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 text-sm">
                Ver todos <FiArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BANNER CTA ────────────────────────────────────────────── */}
      <section className="mx-4 my-10 max-w-7xl md:mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-violet-700 text-white px-8 py-12 text-center">
          <div className="absolute inset-0 circuit-bg opacity-30" />
          <div className="relative">
            <p className="text-blue-200 text-sm font-semibold mb-2 uppercase tracking-widest">¿Nuevo en TechStore?</p>
            <h3 className="font-display font-bold text-3xl md:text-4xl mb-4">Regístrate y accede<br />a precios exclusivos</h3>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-base">
              Crear cuenta gratis <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
