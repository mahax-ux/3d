
import React, { useRef, useEffect } from 'react'
import { useGLTF, ContactShadows } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import * as THREE from 'three'
import islandScene from '../assets/3d/ssse.glb'
import Shoe from '../models/Shoe'

const Island = ({ isRotating, setIsRotating, setCurrentStage, theme, ...props }) => {
  const { nodes, materials } = useGLTF(islandScene)
  const islandRef = useRef();
  const shoeFocusTargetRef = useRef(); // Target reference for the central focus light
  const { gl, viewport } = useThree();
  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;

  const isNight = theme === 'night';

  // Toggle stadium light bulb emissive state
  useEffect(() => {
    if (materials.Lights) {
      if (isNight) {
        materials.Lights.color = new THREE.Color('#ffffff');
        materials.Lights.emissive = new THREE.Color('#ffffff');
        materials.Lights.emissiveIntensity = 30;
        materials.Lights.toneMapped = false;
      } else {
        materials.Lights.color = new THREE.Color('#222222');
        materials.Lights.emissive = new THREE.Color('#000000');
        materials.Lights.emissiveIntensity = 0;
        materials.Lights.toneMapped = true;
      }
      materials.Lights.needsUpdate = true;
    }
  }, [materials, isNight]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }

  const handlePointerMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      if (!isRotating) setIsRotating(true);
      islandRef.current.rotation.y += 0.01 * Math.PI;
      rotationSpeed.current = 0.0125;
    } else if (e.key === 'ArrowRight') {
      if (!isRotating) setIsRotating(true);
      islandRef.current.rotation.y -= 0.01 * Math.PI;
      rotationSpeed.current = -0.0125;
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setIsRotating(false);
    }
  }

  useFrame(() => {
    if (!isRotating) {
      rotationSpeed.current *= dampingFactor;
      if (Math.abs(rotationSpeed.current) < 0.0001) {
        rotationSpeed.current = 0;
      }
      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      const rotation = islandRef.current.rotation.y;
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  })

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [gl]);

  return (
    <a.group ref={islandRef} {...props} dispose={null}>
      {/* Target object positioned right at the center of the shoe */}
      <object3D ref={shoeFocusTargetRef} position={[0, 0, 0]} />

      {/* Floating Shoe */}
      <Shoe position={[0, 0, 0]} scale={50} />

      {/* FOCUS SPOTLIGHT ON THE SHOE (Night Mode Only) */}
      {isNight && (
        <>
          {/* Main Overhead Focus Light */}
          <spotLight
            position={[0, 35, 10]}
            target={shoeFocusTargetRef.current}
            intensity={800}
            angle={0.25}       
            penumbra={0.3}      
            distance={70}
            color="#ffffff"
            castShadow
            shadow-bias={-0.0005}
          />

          {/* Low Front Rim Light to highlight shoe details */}
          <spotLight
            position={[0, 5, 25]}
            target={shoeFocusTargetRef.current}
            intensity={250}
            angle={0.3}
            penumbra={0.5}
            distance={50}
            color="#e0f2fe"
          />
        </>
      )}

      {/* Ground Contact Drop Shadow */}
      <ContactShadows
        position={[0, -18.0, 0]}
        opacity={isNight ? 0.95 : 0.6}
        scale={35}
        blur={1.5}
        far={25}
        color="#000000"
      />

      {/* Terrain Base */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Base_Mesh.geometry}
        material={materials["Material.001"]}
        position={[0, -31.77, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[250, 250, 249.99]}
      />

      {/* Stadium Structure */}
      <group position={[0, -18.1, 0]}>
        {/* Tower floodlights illuminate the stadium field background */}
        {isNight && (
          <>
            <pointLight position={[-30, 28, 20]} intensity={400} distance={90} color="#fffaee" decay={1.8} />
            <pointLight position={[30, 28, 20]} intensity={400} distance={90} color="#fffaee" decay={1.8} />
            <pointLight position={[-30, 28, -20]} intensity={400} distance={90} color="#fffaee" decay={1.8} />
            <pointLight position={[30, 28, -20]} intensity={400} distance={90} color="#fffaee" decay={1.8} />
          </>
        )}

        <mesh castShadow receiveShadow geometry={nodes.Track_Lines.geometry} material={materials.Track_Lines} />
        <mesh castShadow receiveShadow geometry={nodes["G-Object011"].geometry} material={materials.Metal} />
        
        {/* Floodlight Bulbs */}
        <mesh 
          geometry={nodes["G-Object011_1"].geometry} 
          material={materials.Lights} 
        />

        <mesh castShadow receiveShadow geometry={nodes["G-Object004"].geometry} material={materials["White Metal"]} />
        <mesh castShadow receiveShadow geometry={nodes["G-Object004_1"].geometry} material={materials.Net} />
        <mesh castShadow receiveShadow geometry={nodes["G-Object001"].geometry} material={materials["Track Mat"]} />
        <mesh castShadow receiveShadow geometry={nodes["G-Object001_1"].geometry} material={materials.Football_Ground} />
        <mesh castShadow receiveShadow geometry={nodes["G-Object001_2"].geometry} material={materials.Grass} />
      </group>
    </a.group>
  );
}

export default Island;



