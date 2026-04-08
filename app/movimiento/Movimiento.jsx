"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CanvasWrapper from "../Canvas";
import { motion, useInView } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- COMPONENTE DE CONTADOR CON REINICIO ---------------- */

const Counter = ({ targetValue, label, suffix = "", isVisible }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  
  // Reiniciar el contador cuando la sección se vuelve visible
  useEffect(() => {
    if (isVisible) {
      setHasAnimated(false);
      setCount(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      let start = 0;
      const duration = 2000; // 2 segundos
      const stepTime = 16; // ~60fps
      const steps = duration / stepTime;
      const increment = targetValue / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setCount(targetValue);
          setHasAnimated(true);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isVisible, hasAnimated, targetValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-white/40 font-light uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
};

/* ---------------- ESTADÍSTICAS MEJORADAS ---------------- */

const StatisticsSection = ({ isVisible }) => {
  const stats = [
    { value: 50, label: "Proyectos", suffix: "+" },
    { value: 30, label: "Clientes", suffix: "+" },
    { value: 5, label: "Valoración", suffix: "★" },
  ];

  return (
    <div className="flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 pt-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
          className="relative"
        >
          {/* Línea decorativa superior */}
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
            className="absolute -top-4 left-0 h-px bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0"
          />
          
          <Counter 
            targetValue={stat.value} 
            label={stat.label} 
            suffix={stat.suffix}
            isVisible={isVisible}
          />
        </motion.div>
      ))}
    </div>
  );
};

/* ---------------- PLANETA ---------------- */

function Planet() {
  const groupRef = useRef();
  const dragging = useRef(false);
  const previousMouse = useRef([0, 0]);
  const velocity = useRef({ x: 0, y: 0 });

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
    );
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: texture },
        color: { value: new THREE.Color(0x43c4f5) },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform vec3 color;
        uniform float time;
        varying vec2 vUv;

        void main(){
          vec4 texColor = texture2D(baseTexture,vUv);
          float scanline = sin(vUv.y * 50.0 - time * 5.0) * 0.15;
          vec3 finalColor = color * texColor.r * (2.0 + scanline);
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          gl_FragColor = vec4(finalColor * pulse, texColor.r);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, [texture]);

  useFrame(() => {
    shaderMaterial.uniforms.time.value += 0.01;

    if (groupRef.current && !dragging.current) {
      groupRef.current.rotation.y += velocity.current.x + 0.001;
      groupRef.current.rotation.x += velocity.current.y;

      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
    }
  });

  const onPointerDown = (e) => {
    dragging.current = true;
    previousMouse.current = [e.clientX, e.clientY];
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onPointerMove = (e) => {
    if (!dragging.current || !groupRef.current) return;

    const deltaX = e.clientX - previousMouse.current[0];
    const deltaY = e.clientY - previousMouse.current[1];

    const speed = 0.005;

    groupRef.current.rotation.y += deltaX * speed;
    groupRef.current.rotation.x += deltaY * speed;

    velocity.current.x = deltaX * speed;
    velocity.current.y = deltaY * speed;

    previousMouse.current = [e.clientX, e.clientY];
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerUp}
    >
      <mesh material={shaderMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      <mesh scale={1.015}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#43C4F5"
          wireframe
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------------- ESTRELLAS ---------------- */

function StarsBackground() {
  const starsCount = 5000;

  const positions = useMemo(() => {
    const pos = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }

    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starsCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial color="white" size={0.2} transparent opacity={0.7} />
    </points>
  );
}

/* ---------------- COMPONENTE PRINCIPAL ---------------- */

function Movimiento() {
  const containerRef = useRef(null);
  const boxRef = useRef(null);

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);

  const [isVisible, setIsVisible] = useState({
    section1: false,
    section2: false,
  });

  /* Intersection Observer con threshold más bajo para detección temprana */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === section1Ref.current) {
            setIsVisible((prev) => ({
              ...prev,
              section1: entry.isIntersecting,
            }));
          }

          if (entry.target === section2Ref.current) {
            setIsVisible((prev) => ({
              ...prev,
              section2: entry.isIntersecting,
            }));
          }
        });
      },
      { threshold: 0.2 } // Cambiado de 0.3 a 0.2 para detección más temprana
    );

    if (section1Ref.current) observer.observe(section1Ref.current);
    if (section2Ref.current) observer.observe(section2Ref.current);

    return () => observer.disconnect();
  }, []);

  /* GSAP scroll planeta */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalScroll =
        containerRef.current.offsetHeight - window.innerHeight;

      gsap.to(boxRef.current, {
        x: window.innerWidth * -0.25,
        y: totalScroll ,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[210dvh] bg-black overflow-hidden"
    >


      {/* ESTRELLAS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <StarsBackground />
        </Canvas>
      </div>

      {/* PLANETA */}
      <div
        ref={boxRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] z-30"
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 3]} intensity={2} />
          <Planet />
        </Canvas>
      </div>

      {/* SECCIÓN 1 CON MOTION */}
      <motion.div
        ref={section1Ref}
        initial={{ opacity: 0, y: 100 }}
        animate={isVisible.section1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="h-[100dvh] flex items-center justify-center relative z-40 px-4 sm:px-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isVisible.section1 ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl w-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl hover:shadow-primary-500/20 hover:border-white/30 transition-all duration-500"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible.section1 ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full mx-auto mb-8"
          />
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.section1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Diseño + Tecnología
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.section1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-300 md:text-xl leading-relaxed"
          >
            Creamos experiencias que convierten visitantes en clientes
            y marcas en referentes digitales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible.section1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex justify-center gap-4"
          >
            {['Innovación', 'Resultados'].map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/20"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* SECCIÓN 2 CON ESTADÍSTICAS MEJORADAS */}
      <motion.div
        ref={section2Ref}
        initial={{ opacity: 0, x: -50 }}
        animate={isVisible.section2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="h-[100dvh] flex items-end relative z-20 px-6 md:px-20 text-white pb-20"
      >
        <div className="grid md:grid-cols-2 gap-16 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible.section2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.section2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible.section2 ? { width: 100 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-px bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
            />
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              Potencia tu{" "}
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                marca digital
              </span>
            </h2>

            <p className="text-gray-300 md:text-xl max-w-xl leading-relaxed font-light">
              Creamos experiencias web modernas, rápidas y visualmente impactantes
              que elevan tu negocio al siguiente nivel.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full font-medium text-white shadow-lg hover:shadow-primary-500/50 transition-all duration-300"
            >
              <span>Comienza ahora</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.button>

            {/* ESTADÍSTICAS MINIMALISTAS Y GRANDES */}
            <StatisticsSection isVisible={isVisible.section2} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Movimiento;