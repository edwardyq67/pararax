'use client'
import { Canvas as R3fCanvas } from '@react-three/fiber';
import { Suspense } from 'react';
// Importa directamente los componentes que van dentro
import { FluidEffect } from '@/components/Scene3D';

const Canvas = () => {
    return (
        <>
                <R3fCanvas
                    style={{
                        position: "fixed",
                        top: 0,
                        height: "100vh",
                        width: "100%",
                    }}
                >
                    <Suspense fallback={null}>
                        <FluidEffect />
                    </Suspense>
                </R3fCanvas>

        </>

    );
};

export default Canvas;