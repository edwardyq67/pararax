import React from "react";

function Proyectos() {
  const card = [
    {
      id: 1,
      title: "Proyectos1",
      imagen: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/PrimerProducto.webp",
      descripcion:
        "Training India's Next-Gen Automation Engineers: Inside the Addverb & NAMTECH Robotics Lab",
      fecha: "05/07/2024",
      categorias: ["Educacion", "Hardware", "Software"],
    },
    {
      id: 2,
      title: "Proyectos2",
      imagen: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/SegundoProducto.webp",
      descripcion:
        "Training India's Next-Gen Automation Engineers: Inside the Addverb & NAMTECH Robotics Lab",
      fecha: "05/07/2024",
      categorias: ["Educacion", "Hardware", "Software"],
    },
    {
      id: 3,
      title: "Proyectos3",
      imagen: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/TercerProducto.webp",
      descripcion:
        "Training India's Next-Gen Automation Engineers: Inside the Addverb & NAMTECH Robotics Lab",
      fecha: "05/07/2024",
      categorias: ["Educacion", "Hardware", "Software"],
    },
  ];

  return (
    <section className="bg-white  w-full min-h-screen relative py-24 px-4 sm:px-6 lg:px-8">

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