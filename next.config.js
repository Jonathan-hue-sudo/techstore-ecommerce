/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necesario para Netlify con App Router
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        // Agrega tu dominio de Netlify aquí cuando lo tengas:
        // "tu-sitio.netlify.app",
      ],
    },
  },
};

module.exports = nextConfig;
