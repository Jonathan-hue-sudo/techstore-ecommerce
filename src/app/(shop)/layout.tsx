// src/app/(shop)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import CartSidebar from "@/components/shop/CartSidebar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="pt-16 min-h-screen bg-gray-50">{children}</main>
      <footer className="bg-[#0a0f1e] text-gray-400 pt-10 pb-6 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">🗲</span>
              </div>
              <span className="text-white font-display font-bold text-lg">Tech<span className="text-cyan-400">Store</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/shop" className="hover:text-cyan-400 transition-colors">Tienda</a>
              <a href="/orders" className="hover:text-cyan-400 transition-colors">Mis Órdenes</a>
              <a href="/auth/login" className="hover:text-cyan-400 transition-colors">Ingresar</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs">© {new Date().getFullYear()} TechStore Ecuador — Electrónica original con garantía</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Todos los sistemas operativos
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
