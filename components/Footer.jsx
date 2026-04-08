import React from 'react'
import { FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";

function Footer() {
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
    <div className='bg-black w-full text-white'>
        <div className="w-full flex flex-col items-center justify-center py-12 px-4">
            {/* Línea divisoria */}
            <div className="w-full max-w-6xl h-px bg-gray-700 mb-8"></div>
            
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
  )
}

export default Footer