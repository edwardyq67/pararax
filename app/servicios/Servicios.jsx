"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"

export default function Servicios({ scrollFractionPorcentual }) {
    const containerRef = useRef(null)
    const [itemWidth, setItemWidth] = useState(0)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    useEffect(() => {
        console.log(scrollFractionPorcentual)
    }, [scrollFractionPorcentual])

    const imagenes = [
        {
            id: 1,
            imagen: "https://pub-7b894b68dd0d42b9ab25116919a8f951.r2.dev/Log%C3%ADsticayAlmac%C3%A9n.webp",
            titulo: "Logística y Almacén",
            descripcion: "Automatización inteligente para cadenas de suministro",
            color: "#ff0088"
        },
        {
            id: 2,
            imagen: "https://pub-7b894b68dd0d42b9ab25116919a8f951.r2.dev/SectorSalud.webp",
            titulo: "Sector Salud",
            descripcion: "IA aplicada a diagnósticos y gestión hospitalaria",
            color: "#00aaff"
        },
        {
            id: 3,
            imagen: "https://pub-7b894b68dd0d42b9ab25116919a8f951.r2.dev/ServiciosProfesionales.webp",
            titulo: "Servicios Profesionales",
            descripcion: "Soluciones personalizadas para tu negocio",
            color: "#aa44ff"
        }
    ]

    const GAP = 30

    // Obtener el ancho de la ventana solo en el cliente
    useEffect(() => {
        setItemWidth(window.innerWidth * 0.9)
        
        const handleResize = () => {
            setItemWidth(window.innerWidth * 0.9)
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Calcular distancia total a recorrer (incluyendo el spacer invisible)
    const totalDistance = itemWidth ? (imagenes.length) * (itemWidth + GAP) : 0
    const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])

    // Determinar la clase CSS basada en scrollFractionPorcentual
    const positionClass = 
        scrollFractionPorcentual > 33 && scrollFractionPorcentual <= 90
            ? "fixed justify-center" 
            : "sticky justify-start "

    return (
        <div ref={containerRef} className="relative h-[400vh]">
            <div className={`${positionClass} top-0 items-center overflow-visible flex gap-32`}>
                <motion.div
                    className="flex will-change-transform"
                    style={{ x }}
                >
                    {imagenes.map((item) => (
                        <div key={item.id} className="bg-black justify-center w-[100vw] h-[100vh] items-center flex">
                            <div
                                className="flex-shrink-0 w-[70vw] h-[70vh] rounded-xl relative overflow-hidden"
                                style={{
                                    backgroundImage: `url(${item.imagen})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Overlay sutil */}
                                <div className="absolute inset-0 bg-black/20" />
                                
                                {/* Contenido */}
                                <div className="absolute bottom-8 left-8 z-10">
                                    <span
                                        className="text-sm font-mono block mb-2"
                                        style={{ color: item.color }}
                                    >
                                        0{item.id}
                                    </span>
                                    <h2 className="text-4xl font-bold text-white mb-2">
                                        {item.titulo}
                                    </h2>
                                    <p className="text-white/80 text-lg max-w-[400px]">
                                        {item.descripcion}
                                    </p>
                                </div>
                            </div> 
                        </div>
                    ))}
                    

                </motion.div>
                
            </div>
        </div>
    )
}