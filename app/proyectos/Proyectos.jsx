"use client";

import React, { useEffect, useState } from "react";

function Proyectos() {
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Fetch datos desde API
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch("/api/proyectos");
        if (!response.ok) {
          throw new Error("Error al cargar los proyectos");
        }
        const result = await response.json();
        // Si la API devuelve { proyectos: [...] }
        setCard(result.proyectos || []);
        // Si la API devuelve directamente el array, usar:
        // setCard(result || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  if (loading) {
    return (
      <section className="bg-white w-full min-h-screen relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">Cargando proyectos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white w-full min-h-screen relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (card.length === 0) {
    return (
      <section className="bg-white w-full min-h-screen relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center text-gray-500">
            <p>No hay proyectos disponibles</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white w-full min-h-screen relative py-24 px-4 sm:px-6 lg:px-8">

      {/* 🔥 TÍTULO */}
      <div className="text-center mb-20">
        <div className="relative inline-block">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 relative z-10">
            Nuestros Proyectos
          </h2>

          <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"></div>
        </div>

        <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
          Descubre los proyectos más innovadores que estamos desarrollando
        </p>
      </div>

      {/* 🔥 GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {card.map((item) => (
            <div
              key={item.id}
              className="
              group
              rounded-2xl
              overflow-hidden
              shadow-lg
              transition-all
              duration-500
              transform
              cursor-pointer
              hover:-translate-y-3
              "
            >

              {/* 🔹 IMAGEN */}
              <div className="relative overflow-hidden h-60">

                <img
                  src={item.imagen}
                  alt={item.descripcion}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

              </div>

              {/* 🔹 CONTENIDO */}
              <div className="p-6">

                {/* titulo */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* descripcion */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.descripcion}
                </p>

                {/* fecha en el contenido */}
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{item.fecha}</span>
                </div>

                {/* categorias */}
                <div className="flex flex-wrap gap-2">

                  {item.categorias.map((categoria, idx) => (
                    <span
                      key={idx}
                      className="
                      text-xs
                      px-3
                      py-1
                      bg-primary-50
                      text-primary-600
                      rounded-full
                      font-semibold
                      border border-primary-100
                      "
                    >
                      {categoria}
                    </span>
                  ))}

                </div>
              </div>

            </div>
          ))}
       
        </div>
      </div>
    </section>
  );
}

export default Proyectos;