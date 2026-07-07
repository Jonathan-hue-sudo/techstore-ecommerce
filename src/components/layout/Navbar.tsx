// src/components/layout/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiMenu, FiX, FiGrid, FiLogOut, FiPackage, FiUser, FiZap } from "react-icons/fi";

const navLinks = [
  { href: "/shop",                   label: "Tienda" },
  { href: "/shop?categoriaId=smartphones", label: "Smartphones" },
  { href: "/shop?categoriaId=laptops-pcs", label: "Laptops" },
  { href: "/shop?destacado=true",    label: "🗲 Ofertas" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { count, fetchCart, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => { if (session) fetchCart(); }, [session]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cartCount = count();
  const isAdmin   = session && (session.user as any).role === "ADMIN";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-[#0a0f1e]"
    }`}>
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <FiZap size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="text-white font-display font-bold text-xl tracking-tight">Tech</span>
              <span className="text-cyan-400 font-display font-bold text-xl tracking-tight">Store</span>
            </div>
          </Link>

          {/* ── Nav Links ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin"
                className="px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5">
                <FiGrid size={14} /> Panel Admin
              </Link>
            )}
          </div>

          {/* ── Actions ──────────────────────────────── */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <button onClick={toggleCart}
                  className="relative p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
                <Link href="/orders" className="hidden md:flex p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <FiPackage size={20} />
                </Link>
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{session.user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    <FiLogOut size={13} /> Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Iniciar sesión
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/30">
                  Registrarse
                </Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d1b3e]/98 backdrop-blur-md px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 px-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
              {l.label}
            </Link>
          ))}
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-cyan-400 font-semibold text-sm">Panel Admin</Link>}
          {session ? (
            <>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-gray-300 text-sm">Mis Órdenes</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2.5 px-3 text-red-400 text-sm w-full text-left">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link href="/auth/login"    onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-gray-300 text-sm">Iniciar sesión</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-blue-400 font-semibold text-sm">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
