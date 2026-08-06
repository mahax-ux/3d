import { useGLTF, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import React from 'react'
import skyScene from '../assets/3d/sky.glb'
import moonScene from '../assets/3d/moon.glb' // <-- Import your 3D moon .glb file

// Component to load your actual 3D .glb Moon model
const ModelMoon = () => {
  const moon = useGLTF(moonScene);

  return (
    <group position={[35, 38, -45]} scale={[3, 3, 3]}>
      <primitive object={moon.scene} />
      {/* Natural, subtle cool-white moonlight aura */}
      <pointLight 
        intensity={120} 
        distance={65} 
        color="#e2e8f0" 
        decay={2} 
        position={[0, 0, 0]}
      />
    </group>
  );
};

const Sky = ({ isRotating, theme }) => {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();

  const isNight = theme === 'night';

  useEffect(() => {
    sky.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color = new THREE.Color(isNight ? '#02050e' : '#ffffff');
        
        if (child.material.emissive) {
          child.material.emissive = new THREE.Color(isNight ? '#000000' : '#87ceeb');
          child.material.emissiveIntensity = isNight ? 0 : 0.2;
        }
      }
    });
  }, [sky, isNight]);

  useFrame((_, delta) => {
    if (isRotating && skyRef.current) {
      skyRef.current.rotation.y += 0.15 * delta;
    }
  });

  return (
    <group ref={skyRef}>
      {isNight && (
        <>
          <Stars 
            radius={120} 
            depth={60} 
            count={6000} 
            factor={5} 
            saturation={0} 
            fade 
            speed={1.2} 
          />
          <ModelMoon />
        </>
      )}
      
      <mesh>
        <primitive object={sky.scene} />
      </mesh>
    </group>
  );
};

useGLTF.preload(moonScene);
export default Sky;