
import { useRef, useEffect } from 'react';
import planeScene from '../assets/3d/plane.glb';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pre-allocated vector objects to ensure 60 FPS performance
const targetPosition = new THREE.Vector3();
const headlightTarget = new THREE.Object3D();
headlightTarget.position.set(0, 0, 10);

const Plane = ({ isRotating, theme, ...props }) => {
  const ref = useRef();
  const headlightRef = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);

  const isNight = theme === 'night';

  useEffect(() => {
    if (actions && actions['Take 001']) {
      actions['Take 001'].play();
    }
  }, [actions]);

  useEffect(() => {
    if (headlightRef.current) {
      headlightRef.current.target = headlightTarget;
    }
  }, [isNight]);

  useFrame((state) => {
    if (!ref.current) return;

    // Flight animation speed
    const t = state.clock.getElapsedTime() * 0.45;

    // Outer trajectory bounds (sweeps far wide and behind the central shoe)
    const radiusX = 48; 
    const radiusZ = 20;

    // 1. Current position along an elongated perimeter orbit
    const x = Math.sin(t) * radiusX;
    // Keep Z negative so it loops behind the shoe at [0, 0, 0]
    const z = -25 + Math.cos(t) * radiusZ; 
    const y = 16 + Math.sin(t * 2) * 5; // Subtle climbing and descending flight

    ref.current.position.set(x, y, z);

    // 2. Look-ahead position target
    const dt = 0.02;
    const nextX = Math.sin(t + dt) * radiusX;
    const nextZ = -25 + Math.cos(t + dt) * radiusZ;
    const nextY = 16 + Math.sin((t + dt) * 2) * 5;

    targetPosition.set(nextX, nextY, nextZ);

    // 3. Smooth direction orientation
    ref.current.lookAt(targetPosition);

    // 4. Natural flight banking into turn curves
    const roll = -Math.cos(t) * 0.4;
    ref.current.rotateZ(roll);
  });

  return (
    <group ref={ref} {...props}>
      <primitive object={headlightTarget} />

      {isNight && (
        <>
          <pointLight 
            position={[0, 0.5, 0]} 
            intensity={80} 
            distance={15} 
            color="#fff4e0" 
            decay={2} 
          />

          <spotLight
            ref={headlightRef}
            position={[0, 0, 1.5]}
            intensity={120}
            angle={0.5}
            penumbra={0.4}
            color="#fffaee"
            distance={50}
          />
        </>
      )}

      <primitive object={scene} />
    </group>
  );
};

export default Plane;
