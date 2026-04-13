"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";

function Contacto() {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  };
  
  const socialLinks = [
    { 
      name: "Facebook", 
      icon: FaFacebook, 
      url: "https://facebook.com", 
      color: "hover:text-blue-500" 
    },
    { 
      name: "WhatsApp", 
      icon: FaWhatsapp, 
      url: "https://wa.me/", 
      color: "hover:text-green-500" 
    },
    { 
      name: "YouTube", 
      icon: FaYoutube, 
      url: "https://youtube.com", 
      color: "hover:text-red-600" 
    },
    { 
      name: "LinkedIn", 
      icon: FaLinkedin, 
      url: "https://linkedin.com", 
      color: "hover:text-blue-400" 
    }
  ];

  const links = [
    { name: "Términos y Condiciones", url: "/terminos-y-condiciones" },
    { name: "Libro de Reclamaciones", url: "/libro-de-reclamaciones" }
  ];

  return (
    <div className="w-full pt-10 md:pt-36 bg-white flex flex-col items-center justify-center">
      <div className="w-full bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-[100dvh] w-full rounded-t-lg 
          bg-gradient-to-b from-black from-[0%] via-black via-[50%] to-primary-600 
          flex flex-col items-center justify-center py-10 px-4 sm:p-6 md:p-8 overflow-hidden"
        >

          {/* Glow - Responsivo */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[600px] h-[200px] sm:h-[250px] md:h-[300px] bg-white/10 blur-3xl rounded-full" />

          <div className="w-full gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto flex flex-col items-center relative z-10 px-4 sm:px-0">

            {/* Título - Responsivo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative inline-block p-3 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md rounded-xl w-full sm:w-auto mb-10"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white text-center max-w-[90vw] sm:max-w-[80vw] md:max-w-2xl">
                Contáctanos para información más específica
              </h2>

              {/* Esquinas - Tamaños responsivos */}
              <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-white/80 rounded-tl-md"></span>
              <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-white/80 rounded-tr-md"></span>
              <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-white/80 rounded-bl-md"></span>
              <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-white/80 rounded-br-md"></span>
            </motion.div>

            {/* Formulario - Responsivo */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 w-full"
            >

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

                {/* Nombre - Responsivo */}
                <motion.div variants={item} className="space-y-2">
                  <label className="text-gray-700 text-xs sm:text-sm font-medium">
                    Nombre completo *
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm sm:text-base"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Apellido"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm sm:text-base"
                      required
                    />
                  </div>
                </motion.div>

                {/* Empresa */}
                <motion.div variants={item} className="space-y-2">
                  <label className="text-gray-700 text-xs sm:text-sm font-medium">
                    Compañía *
                  </label>

                  <input
                    type="text"
                    placeholder="Nombre de tu empresa"
                    className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm sm:text-base"
                    required
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={item} className="space-y-2">
                  <label className="text-gray-700 text-xs sm:text-sm font-medium">
                    Correo electrónico *
                  </label>

                  <input
                    type="email"
                    placeholder="tu@empresa.com"
                    className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm sm:text-base"
                    required
                  />
                </motion.div>

                {/* Teléfono */}
                <motion.div variants={item} className="space-y-2">
                  <label className="text-gray-700 text-xs sm:text-sm font-medium">
                    Teléfono *
                  </label>

                  <input
                    type="tel"
                    placeholder="+51 999 999 999"
                    className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm sm:text-base"
                    required
                  />
                </motion.div>

                {/* Mensaje */}
                <motion.div variants={item} className="md:col-span-2 space-y-2">
                  <label className="text-gray-700 text-xs sm:text-sm font-medium">
                    Mensaje *
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none transition text-sm sm:text-base"
                    required
                  />
                </motion.div>

                {/* Botón */}
                <motion.div
                  variants={item}
                  className="md:col-span-2 flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg transition duration-150 shadow-lg w-full sm:w-auto text-sm sm:text-base"
                  >
                    Enviar mensaje
                  </motion.button>
                </motion.div>

              </form>

            </motion.div>

          </div>

        </motion.div>
      </div>
     
      {/* Footer sin motion */}
      <div className='bg-black z-50 w-full text-white'>
        <div className="w-full flex flex-col items-center justify-center py-12 px-4">
          {/* Redes sociales */}
          <div className="flex gap-6 z-50 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} transition-colors duration-300`}
              >
                <social.icon size={30} />
              </a>
            ))}
          </div>

          {/* Línea divisoria */}
          <div className="w-full max-w-6xl h-px bg-gray-700 mb-8 z-50"></div>
          
          {/* Enlaces de términos y condiciones */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 z-50">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Copyright */}
          <p className="text-gray-500 text-sm z-50">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contacto;