import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    loader: 'custom',
    loaderFile: "./image-loader.ts" 
  },

  output: "standalone",
  
  // Configuración webpack para manejar shaders
  webpack: (config, { isServer }) => {
    // Regla para archivos GLSL (vertex y fragment shaders)
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: 'asset/source', // Esto importa el archivo como string
    });
    
    return config;
  },
};

export default nextConfig;