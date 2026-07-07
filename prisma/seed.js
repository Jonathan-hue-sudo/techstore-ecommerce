// prisma/seed.js — TechStore Ecuador
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cargando datos de electrónica...");

  // ── Usuarios ─────────────────────────────────────────────────────────────
  const passAdmin = await bcrypt.hash("admin123", 12);
  await prisma.usuario.upsert({
    where: { email: "admin@techstore.ec" },
    update: {},
    create: { nombre: "Administrador TechStore", email: "admin@techstore.ec", contrasena: passAdmin, rol: "ADMIN" },
  });

  const passCliente = await bcrypt.hash("cliente123", 12);
  await prisma.usuario.upsert({
    where: { email: "cliente@techstore.ec" },
    update: {},
    create: { nombre: "Carlos Mendoza", email: "cliente@techstore.ec", contrasena: passCliente, rol: "CLIENTE" },
  });

  // ── Categorías ────────────────────────────────────────────────────────────
  const cats = [
    { nombre: "Smartphones",     slug: "smartphones",     descripcion: "Teléfonos inteligentes de última generación",  imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600" },
    { nombre: "Laptops y PCs",   slug: "laptops-pcs",     descripcion: "Computadoras portátiles y de escritorio",      imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600" },
    { nombre: "Audio y Sonido",  slug: "audio-sonido",    descripcion: "Audífonos, parlantes y sistemas de sonido",    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
    { nombre: "Televisores",     slug: "televisores",     descripcion: "Smart TVs y monitores de alta resolución",     imagen: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600" },
    { nombre: "Gaming",          slug: "gaming",          descripcion: "Consolas, accesorios y periféricos gaming",    imagen: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600" },
    { nombre: "Tablets y iPads", slug: "tablets-ipads",   descripcion: "Tablets para trabajo y entretenimiento",       imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
    { nombre: "Fotografía",      slug: "fotografia",      descripcion: "Cámaras digitales, drones y accesorios",       imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600" },
    { nombre: "Accesorios Tech", slug: "accesorios-tech", descripcion: "Cables, cargadores, hubs y más",              imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600" },
  ];

  for (const cat of cats) {
    await prisma.categoria.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const getCat = (slug) => prisma.categoria.findUnique({ where: { slug } });
  const smartphones  = await getCat("smartphones");
  const laptops      = await getCat("laptops-pcs");
  const audio        = await getCat("audio-sonido");
  const tvs          = await getCat("televisores");
  const gaming       = await getCat("gaming");
  const tablets      = await getCat("tablets-ipads");
  const fotografia   = await getCat("fotografia");
  const accesorios   = await getCat("accesorios-tech");

  // ── Productos ─────────────────────────────────────────────────────────────
  const productos = [
    { nombre: "Samsung Galaxy S24 Ultra",    slug: "samsung-galaxy-s24-ultra",    descripcion: "Flagship de Samsung con cámara de 200MP, S-Pen integrado, Snapdragon 8 Gen 3 y pantalla Dynamic AMOLED 2X de 6.8\".", precio: 1299.99, stock: 30, imagen: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", destacado: true,  categoriaId: smartphones.id },
    { nombre: "iPhone 15 Pro Max",           slug: "iphone-15-pro-max",           descripcion: "Chip A17 Pro, sistema de cámara Pro de 48MP, titanio de grado aeroespacial y Dynamic Island.",                         precio: 1499.99, stock: 20, imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", destacado: true,  categoriaId: smartphones.id },
    { nombre: "Xiaomi Redmi Note 13 Pro",    slug: "xiaomi-redmi-note-13-pro",    descripcion: "Cámara de 200MP, pantalla AMOLED 6.67\", carga rápida 67W y batería 5100mAh.",                                        precio: 399.99,  stock: 50, imagen: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500", destacado: false, categoriaId: smartphones.id },
    { nombre: "MacBook Pro 14\" M3 Pro",     slug: "macbook-pro-14-m3-pro",       descripcion: "Chip Apple M3 Pro, pantalla Liquid Retina XDR, hasta 22 horas de batería y 18GB RAM unificada.",                       precio: 2199.99, stock: 15, imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", destacado: true,  categoriaId: laptops.id },
    { nombre: "ASUS ROG Zephyrus G14",       slug: "asus-rog-zephyrus-g14",       descripcion: "Laptop gaming con AMD Ryzen 9, RTX 4060, pantalla QHD 165Hz y 16GB RAM.",                                              precio: 1449.99, stock: 10, imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500", destacado: true,  categoriaId: laptops.id },
    { nombre: "Lenovo ThinkPad X1 Carbon",   slug: "lenovo-thinkpad-x1-carbon",   descripcion: "Ultrabook empresarial Intel Core i7 13a gen, 16GB RAM, SSD 512GB. Certificado MIL-SPEC.",                              precio: 1699.99, stock: 8,  imagen: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500", destacado: false, categoriaId: laptops.id },
    { nombre: "Sony WH-1000XM5",             slug: "sony-wh-1000xm5",             descripcion: "Audífonos inalámbricos con cancelación de ruido líder, 30 horas de batería y audio Hi-Res.",                           precio: 349.99,  stock: 40, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", destacado: true,  categoriaId: audio.id },
    { nombre: "JBL Charge 5",                slug: "jbl-charge-5",                descripcion: "Parlante Bluetooth resistente al agua IP67, 20 horas de batería y función de banco de energía.",                        precio: 179.99,  stock: 60, imagen: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", destacado: false, categoriaId: audio.id },
    { nombre: "Apple AirPods Pro 2",         slug: "apple-airpods-pro-2",         descripcion: "Cancelación de ruido activa de nueva generación, audio espacial personalizado y chip H2.",                              precio: 249.99,  stock: 35, imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", destacado: true,  categoriaId: audio.id },
    { nombre: "Samsung Neo QLED 65\" 4K",    slug: "samsung-neo-qled-65",         descripcion: "Smart TV 4K Neo QLED con Quantum Mini LED, procesador NQ4 AI Gen2 y Dolby Atmos.",                                     precio: 1899.99, stock: 8,  imagen: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", destacado: true,  categoriaId: tvs.id },
    { nombre: "LG OLED C3 55\" 4K",          slug: "lg-oled-c3-55",               descripcion: "Panel OLED autoiluminado, negro perfecto, procesador α9 AI y compatible con Dolby Vision IQ.",                         precio: 1349.99, stock: 6,  imagen: "https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=500", destacado: false, categoriaId: tvs.id },
    { nombre: "PlayStation 5 Slim",          slug: "playstation-5-slim",          descripcion: "La PS5 en formato compacto: SSD ultrarrápido, ray tracing, 4K a 120fps y DualSense.",                                  precio: 499.99,  stock: 12, imagen: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500", destacado: true,  categoriaId: gaming.id },
    { nombre: "Xbox Series X",               slug: "xbox-series-x",               descripcion: "CPU 8-core Zen 2, GPU 12 teraflops, SSD NVMe 1TB, 4K nativo y retrocompatibilidad total.",                             precio: 549.99,  stock: 10, imagen: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500", destacado: false, categoriaId: gaming.id },
    { nombre: "ASUS ROG Monitor 27\" 240Hz", slug: "asus-rog-monitor-27-240hz",   descripcion: "Monitor gaming IPS 27\", QHD 2560x1440, 240Hz, 1ms, HDR400, G-Sync y FreeSync.",                                      precio: 449.99,  stock: 15, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500", destacado: true,  categoriaId: gaming.id },
    { nombre: "iPad Pro 12.9\" M2",          slug: "ipad-pro-12-m2",              descripcion: "Chip M2, pantalla Liquid Retina XDR ProMotion 120Hz, compatible con Apple Pencil 2.",                                  precio: 1099.99, stock: 18, imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", destacado: true,  categoriaId: tablets.id },
    { nombre: "Samsung Galaxy Tab S9",       slug: "samsung-galaxy-tab-s9",       descripcion: "Pantalla Dynamic AMOLED 2X, S-Pen incluido, Snapdragon 8 Gen 2, resistente al agua IP68.",                             precio: 799.99,  stock: 20, imagen: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500", destacado: false, categoriaId: tablets.id },
    { nombre: "Sony Alpha a7 IV",            slug: "sony-alpha-a7-iv",            descripcion: "Cámara mirrorless full-frame 33MP, grabación 4K 60fps, IBIS 5 ejes y AF con inteligencia artificial.",                 precio: 2499.99, stock: 5,  imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", destacado: true,  categoriaId: fotografia.id },
    { nombre: "DJI Mavic 3 Pro",             slug: "dji-mavic-3-pro",             descripcion: "Dron con triple cámara Hasselblad, sensor 4/3 CMOS, vuelo 43 min y transmisión O3 a 15km.",                            precio: 2199.99, stock: 4,  imagen: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500", destacado: true,  categoriaId: fotografia.id },
    { nombre: "Anker 140W USB-C Cargador",   slug: "anker-140w-usb-c",            descripcion: "Cargador GaN 140W con 3 puertos (2x USB-C + 1x USB-A), compatible con MacBook Pro, iPad e iPhone.",                   precio: 79.99,   stock: 100,imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500", destacado: false, categoriaId: accesorios.id },
    { nombre: "Logitech MX Master 3S",       slug: "logitech-mx-master-3s",       descripcion: "Mouse inalámbrico premium con scroll MagSpeed, 8000 DPI y hasta 70 días de batería.",                                  precio: 99.99,   stock: 45, imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500", destacado: false, categoriaId: accesorios.id },
    { nombre: "Samsung SSD 2TB T7 Shield",   slug: "samsung-ssd-2tb-t7",          descripcion: "SSD portátil NVMe resistente a caídas y agua (IP65), velocidades hasta 1050MB/s.",                                     precio: 149.99,  stock: 55, imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500", destacado: false, categoriaId: accesorios.id },
  ];

  for (const prod of productos) {
    await prisma.producto.upsert({ where: { slug: prod.slug }, update: {}, create: prod });
  }

  console.log("✅ Seed completado!");
  console.log("👤 Admin:   admin@techstore.ec  / admin123");
  console.log("👤 Cliente: cliente@techstore.ec / cliente123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
