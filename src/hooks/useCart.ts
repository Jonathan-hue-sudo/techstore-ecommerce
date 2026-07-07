// src/hooks/useCart.ts
"use client";
import { create } from "zustand";
import toast from "react-hot-toast";
import { calcularIVA, totalConIVA } from "@/lib/utils";

interface ItemCarrito {
  id: string;
  productoId: string;
  cantidad: number;
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string | null;
    stock: number;
  };
}

interface CartStore {
  items: ItemCarrito[];
  isLoading: boolean;
  isOpen: boolean;

  openCart:   () => void;
  closeCart:  () => void;
  toggleCart: () => void;

  fetchCart:   () => Promise<void>;
  addItem:     (productoId: string, cantidad?: number) => Promise<void>;
  updateItem:  (productoId: string, cantidad: number)  => Promise<void>;
  removeItem:  (productoId: string)                    => Promise<void>;
  clearCart:   ()                                       => Promise<void>;
  checkout:    (data: { direccion?: string; telefono?: string; notas?: string }) => Promise<any>;

  total:       () => number;
  iva:          () => number;
  totalConIva:  () => number;
  count: () => number;
}

export const useCart = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,
  isOpen: false,

  openCart:   () => set({ isOpen: true }),
  closeCart:  () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      set({ items: data.items || [] });
    } finally { set({ isLoading: false }); }
  },

  addItem: async (productoId, cantidad = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId, cantidad }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await get().fetchCart();
      toast.success("Producto agregado al carrito");
    } catch (e: any) { toast.error(e.message || "Error al agregar al carrito"); }
  },

  updateItem: async (productoId, cantidad) => {
    try {
      const res = await fetch(`/api/cart/${productoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      await get().fetchCart();
    } catch (e: any) { toast.error(e.message || "Error al actualizar"); }
  },

  removeItem: async (productoId) => {
    try {
      await fetch(`/api/cart/${productoId}`, { method: "DELETE" });
      await get().fetchCart();
      toast.success("Producto eliminado del carrito");
    } catch { toast.error("Error al eliminar del carrito"); }
  },

  clearCart: async () => {
    try {
      await fetch("/api/cart", { method: "DELETE" });
      set({ items: [] });
    } catch { toast.error("Error al vaciar el carrito"); }
  },

  checkout: async (data) => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      set({ items: [], isOpen: false });
      toast.success("¡Orden realizada exitosamente!");
      return result;
    } catch (e: any) {
      toast.error(e.message || "Error al procesar la orden");
      throw e;
    } finally { set({ isLoading: false }); }
  },

  total:        () => get().items.reduce((s, i) => s + Number(i.producto?.precio ?? 0) * i.cantidad, 0),
  iva:          () => calcularIVA(get().items.reduce((s, i) => s + Number(i.producto?.precio ?? 0) * i.cantidad, 0)),
  totalConIva:  () => totalConIVA(get().items.reduce((s, i) => s + Number(i.producto?.precio ?? 0) * i.cantidad, 0)),
  count: () => get().items.reduce((s, i) => s + i.cantidad, 0),
}));
