// src/app/(shop)/shop/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiFilter } from "react-icons/fi";

interface Props {
  searchParams: { categoriaId?: string; busqueda?: string; destacado?: string; pagina?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const pagina = Number(searchParams.pagina) || 1;
  const limite = 12;
  const skip   = (pagina - 1) * limite;

  const where: any = { activo: true };
  if (searchParams.categoriaId) where.categoriaId = searchParams.categoriaId;
  if (searchParams.destacado === "true") where.destacado = true;
  if (searchParams.busqueda) {
    where.OR = [
      { nombre:      { contains: searchParams.busqueda } },
      { descripcion: { contains: searchParams.busqueda } },
    ];
  }

  const [productos, total, categorias] = await Promise.all([
    prisma.producto.findMany({ where, include: { categoria: true }, orderBy: { creadoEn: "desc" }, skip, take: limite }),
    prisma.producto.count({ where }),
    prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const totalPaginas = Math.ceil(total / limite);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Catálogo</p>
        <h1 className="font-display font-bold text-4xl text-gray-900">Tienda</h1>
        <p className="text-gray-500 mt-1">{total} productos disponibles</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="card sticky top-20 space-y-6">
            {/* Search */}
            <form>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Buscar</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" name="busqueda" defaultValue={searchParams.busqueda}
                  placeholder="Buscar productos..." className="input-field pl-9 text-sm" />
                {searchParams.categoriaId && <input type="hidden" name="categoriaId" value={searchParams.categoriaId} />}
              </div>
            </form>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorías</label>
              <div className="space-y-1">
                <Link href="/shop"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    !searchParams.categoriaId ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className="text-base">☄︎</span> Todas las categorías
                </Link>
                {categorias.map((cat) => (
                  <Link key={cat.id} href={`/shop?categoriaId=${cat.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      searchParams.categoriaId === cat.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    {(cat as any).imagen ? (
                      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={(cat as any).imagen} alt={cat.nombre} fill className="object-cover" />
                      </div>
                    ) : <span className="text-base">⌨︎</span>}
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filtros</label>
              <Link href={searchParams.destacado === "true" ? "/shop" : "/shop?destacado=true"}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  searchParams.destacado === "true" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                }`}>
                ⚡ Solo destacados
              </Link>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {productos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-gray-500 mb-6">Intenta con otros filtros o términos</p>
              <Link href="/shop" className="btn-primary">Ver todos los productos</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {productos.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>

              {/* Pagination */}
              {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => {
                    const params = new URLSearchParams();
                    if (searchParams.categoriaId) params.set("categoriaId", searchParams.categoriaId);
                    if (searchParams.busqueda)    params.set("busqueda",    searchParams.busqueda);
                    if (searchParams.destacado)   params.set("destacado",   searchParams.destacado);
                    params.set("pagina", String(p));
                    return (
                      <Link key={p} href={`/shop?${params}`}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                          p === pagina ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}>
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
