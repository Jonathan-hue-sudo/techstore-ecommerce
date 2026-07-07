# ⚡ TechStore Ecuador — E-Commerce de Electrónica

Sistema de e-commerce especializado en productos electrónicos, desarrollado con **Next.js 14**, **Prisma ORM** y **MySQL**.

---

## 🛒 Tienda especializada en:
Smartphones · Laptops y PCs · Audio y Sonido · Televisores · Gaming · Tablets · Fotografía · Accesorios Tech

---

## 🗄️ Tablas de base de datos (en español)

| Modelo (Prisma) | Tabla MySQL    | Descripción                    |
|-----------------|----------------|--------------------------------|
| `Usuario`       | `usuarios`     | Clientes y administradores     |
| `Categoria`     | `categorias`   | Categorías de electrónica      |
| `Producto`      | `productos`    | Catálogo de productos          |
| `ItemCarrito`   | `items_carrito`| Ítems del carrito persistente  |
| `Orden`      | `ordenes`      | Órdenes de compra              |
| `ItemOrden`  | `items_orden`  | Detalle de cada orden          |

---

## 🏗️ Arquitectura MVC

```
src/
├── models/          # MODEL — Acceso a datos (Prisma)
│   ├── Producto.ts
│   ├── Categoria.ts
│   ├── Usuario.ts
│   ├── Carrito.ts
│   └── Orden.ts
├── controllers/     # CONTROLLER — Lógica HTTP
│   ├── ProductoController.ts
│   ├── CategoriaController.ts
│   ├── CarritoController.ts
│   ├── OrdenController.ts
│   ├── AuthController.ts
│   └── AdminController.ts
└── app/
    ├── (shop)/      # VIEW — Tienda pública
    ├── admin/       # VIEW — Panel administración
    └── api/         # ROUTES (thin) — Delegan al Controller
```

---

## 🚀 Instalación y ejecución

### 1. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tu DATABASE_URL de MySQL online
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Inicializar la base de datos
```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:push       # Crea las tablas en MySQL
npm run db:seed       # Carga datos de electrónica (productos, categorías, usuarios)
```

### 4. Ejecutar
```bash
npm run dev
# Abre http://localhost:3000
```

---

## 🔐 Credenciales de demo (tras ejecutar seed)

| Rol           | Email                    | Contraseña  |
|---------------|--------------------------|-------------|
| Administrador | admin@techstore.ec       | admin123    |
| Cliente       | cliente@techstore.ec     | cliente123  |

---

## 🌐 Opciones de MySQL online gratuito

| Servicio     | URL                    | Notas                    |
|--------------|------------------------|--------------------------|
| Railway      | railway.app            | ⭐ Recomendado, fácil setup |
| PlanetScale  | planetscale.com        | MySQL serverless         |
| Clever Cloud | clever-cloud.com       | Opción europea           |

---

## 📡 API REST (22 endpoints)

Todos los endpoints delegan al Controller correspondiente:

- `POST /api/auth/register` — Registro de usuario
- `GET/POST /api/products` — Listar / Crear productos
- `GET/PUT/DELETE /api/products/[id]` — CRUD producto
- `GET/POST /api/categories` — Listar / Crear categorías
- `PUT/DELETE /api/categories/[id]` — Actualizar / Eliminar categoría
- `GET/POST/DELETE /api/cart` — Ver / Agregar / Vaciar carrito
- `PUT/DELETE /api/cart/[productId]` — Actualizar / Quitar ítem
- `GET/POST /api/orders` — Mis pedidos / Checkout
- `GET /api/admin/stats` — Estadísticas del dashboard
- `GET /api/admin/orders` — Todos los pedidos (admin)
- `PUT /api/admin/orders/[id]` — Cambiar estado del pedido
- `GET /api/admin/users` — Todos los usuarios (admin)

---

## 🎨 Diseño

La interfaz usa un tema **tech oscuro** para el navbar, footer y panel admin (`#0a0f1e`), con acentos en azul (`#0066ff`) y cian (`#00d4ff`). La tienda pública usa fondo claro con tarjetas modernas.
