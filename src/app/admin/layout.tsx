// src/app/admin/layout.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FiGrid, FiPackage, FiTag, FiUsers, FiShoppingBag, FiLogOut, FiMenu, FiZap, FiExternalLink } from "react-icons/fi";

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: FiGrid,        exact: true },
  { href: "/admin/products",   label: "Productos",  icon: FiPackage },
  { href: "/admin/categories", label: "Categorías", icon: FiTag },
  { href: "/admin/orders",     label: "Órdenes",    icon: FiShoppingBag },
  { href: "/admin/users",      label: "Usuarios",   icon: FiUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "ADMIN") router.push("/auth/login");
  }, [session, status]);

  if (status === "loading" || !session || (session.user as any).role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
          <p className="text-gray-400 text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0a0f1e] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-600"/>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiZap size={16} className="text-white"/>
            </div>
            <div className="leading-none">
              <p className="text-white font-display font-bold text-lg">Tech<span className="text-cyan-400">Store</span></p>
              <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest">Panel Admin</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon   = item.icon;
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                }`}>
                <Icon size={17}/>
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"/>}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <Link href="/" target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all">
              <FiExternalLink size={17}/> Ver tienda
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{session.user?.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{session.user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-sm font-medium">
            <FiLogOut size={16}/> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <FiMenu size={20}/>
          </button>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"/>
            <span>Sistema operativo</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
