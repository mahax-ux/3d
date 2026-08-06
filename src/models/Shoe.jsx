import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

const MODEL_PATH = "/shoe.glb";

const Shoe = ({ position = [0, 0, 0], floatAmp = 0.6, floatSpeed = 1.5, ...props }) => {
  const shoeRef = useRef();
  const baseY = useRef(position[1] || 0);

  const { scene } = useGLTF(MODEL_PATH);

  // Preserve textures and ensure sRGB color space
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Ensure texture maps update properly without losing color
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (position && position[1] !== undefined) {
      baseY.current = position[1];
    }
  }, [position]);

  useFrame((state, delta) => {
    if (!shoeRef.current) return;

    shoeRef.current.rotation.y += delta * 0.3;
    shoeRef.current.rotation.x = 0.35;

    shoeRef.current.position.y =
      baseY.current + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmp;
  });

  return <primitive ref={shoeRef} object={scene} position={position} {...props} />;
};

useGLTF.preload(MODEL_PATH);

export default Shoe;