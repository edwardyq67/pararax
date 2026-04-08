'use client';

import { Text as DreiText } from '@react-three/drei';

const Text = () => {
    return (
        <group position-y={0.2}>
            <DreiText
                letterSpacing={-0.07}
                fontSize={0.94}
                renderOrder={1}
                position-y={0.8}
                color='#ffffff'>
                REACT POST
            </DreiText>

            <DreiText
                letterSpacing={-0.07}
                position-y={-0.12}
                fontSize={0.94}
                color='#ffffff'>
                FLUID-DISTORTION
            </DreiText>

            <DreiText
                maxWidth={4.2}
                textAlign='center'
                fontSize={0.1}
                lineHeight={1.5}
                position-y={-1}
                color='white'>
                A FLUID POST PROCESSING DISTORTION EFFECT MADE TO WORK WITH THE REACT-THREE-FIBER
                EFFECT COMPOSER. MOVE YOUR MOUSE AROUND TO SEE HOW IT INTERRACT WITH THE 3D OBJECTS
                IN THE SCENE.
            </DreiText>
        </group>
    );
};

export default Text;
