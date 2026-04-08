'use client';
import { Environment, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { useRef, useEffect } from 'react';
import { Group } from 'three';
import { Fluid } from '@/lib/Fluid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Torus = () => {

  const modelRef = useRef<Group>(null);
  const positionRef = useRef(0);

  const { scene } = useGLTF("https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/gltf/Mundo8.gltf");

  const { viewport } = useThree();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(positionRef, {
        current: -viewport.width * 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "center center",
          end: "900vh",
          scrub: true,
        }
      });
    });

    return () => ctx.revert();
  }, [viewport.width]);

  useFrame(() => {

    if (!modelRef.current) return;

    modelRef.current.rotation.y += 0.001;

    // 👇 suavizado
    modelRef.current.position.x += 
      (positionRef.current - modelRef.current.position.x) * 0.03;

  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5,5,5]} />
      <Environment preset='warehouse' />

      <primitive
        ref={modelRef}
        object={scene}
        scale={1}
        position={[0,0,0]}
      />
    </>
  );
};

export const FluidEffect = () => {
  return (
    <EffectComposer>
      <Fluid />
    </EffectComposer>
  );
};