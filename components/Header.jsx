'use client'

import React, { useState, useEffect } from 'react'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const menu = [
    { name: "Productos", link: "#productos" },
    { name: "Nosotros", link: "#nosotros" },
    { name: "Galeria", link: "#galeria" },
    { name: "Blog", link: "#blog" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleClick = (e, link) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.querySelector(link)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Header sin motion */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-black/80 backdrop-blur-md ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => handleClick(e, '#inicio')}
              className="relative z-10 cursor-pointer"
            >
              <img 
                src="https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/logo/SmartFrostLogoCeleste.webp" 
                alt="SmartFrost" 
                className="h-5 w-auto object-contain"
              />
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-2">
                {menu.map((item, index) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      onClick={(e) => handleClick(e, item.link)}
                      className=" py-2 px-5  cursor-pointer text-white/80 hover:text-white font-medium text-base transition-all duration-300 inline-block relative group"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
                
                {/* Botón de contacto */}
                <li className="ml-4">
                  <a
                    href="#contacto"
                    onClick={(e) => handleClick(e, '#contacto')}
                    className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300" />
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <svg 
                        className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contáctanos</span>
                      <svg 
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Botón menú hamburguesa móvil */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
              aria-label="Menú"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-40 md:hidden">
          <div className="bg-black/95 backdrop-blur-lg shadow-xl">
            <nav className="container mx-auto px-4 py-6">
              <ul className="flex flex-col gap-4">
                {menu.map((item, index) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      onClick={(e) => handleClick(e, item.link)}
                      className="block py-3 text-white/80 hover:text-white text-lg font-medium transition-colors border-b border-white/10"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
                <li className="pt-4">
                  <a
                    href="#contacto"
                    onClick={(e) => handleClick(e, '#contacto')}
                    className="group relative flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold text-white overflow-hidden transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contáctanos</span>
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header