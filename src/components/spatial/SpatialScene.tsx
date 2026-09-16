"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Box, Cylinder, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// Global Scroll Tracker for R3F
function ScrollCamera() {
  useFrame((state) => {
    // Smoothly interpolate camera Y based on native scroll
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    // As scroll goes 0 -> 1, camera goes from 0 -> -30
    const targetY = -scrollProgress * 30;
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
  });
  return null;
}

function SpatialObject({ type, position, color, speed = 1, floatIntensity = 2 }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002 * speed;
      meshRef.current.rotation.y += 0.003 * speed;
    }
  });

  const material = (
    <MeshDistortMaterial
      color={color}
      envMapIntensity={2}
      clearcoat={1}
      clearcoatRoughness={0.1}
      metalness={0.9}
      roughness={0.1}
      distort={type === 'orb' ? 0.4 : 0}
      speed={type === 'orb' ? 3 : 0}
      transparent
      opacity={0.6}
    />
  );

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={floatIntensity}>
      {type === 'orb' && <Sphere ref={meshRef as any} args={[1.2, 64, 64]} position={position}>{material}</Sphere>}
      {type === 'server' && <Box ref={meshRef as any} args={[1.5, 0.3, 1.2]} position={position}>{material}</Box>}
      {type === 'database' && <Cylinder ref={meshRef as any} args={[0.8, 0.8, 1.8, 32]} position={position}>{material}</Cylinder>}
      {type === 'network' && <Torus ref={meshRef as any} args={[1.2, 0.15, 16, 100]} position={position}>{material}</Torus>}
      {type === 'cpu' && <Box ref={meshRef as any} args={[1, 0.1, 1]} position={position}>{material}</Box>}
      {type === 'ai' && <Icosahedron ref={meshRef as any} args={[1, 0]} position={position}>{material}</Icosahedron>}
    </Float>
  );
}

export default function SpatialScene() {
  const [themeColor, setThemeColor] = useState('#ff6a00');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Poll for theme changes from CSS var
    const interval = setInterval(() => {
      const el = document.documentElement;
      const theme = el.getAttribute('data-theme-color');
      if (theme === 'blue') setThemeColor('#00f0ff');
      else if (theme === 'green') setThemeColor('#00f5a0');
      else setThemeColor('#ff6a00'); // default orange
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen dark:opacity-40 dark:mix-blend-plus-lighter">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }} dpr={[1, 1.5]}>
        <ScrollCamera />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color={themeColor} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
        
        {/* Depth Layers Choreography */}
        {/* Hero: orb */}
        <SpatialObject type="orb" position={[3, 0, -2]} color={themeColor} speed={1.5} floatIntensity={3} />
        <SpatialObject type="orb" position={[-4, -2, -5]} color="#ffffff" speed={1} floatIntensity={1} />
        
        {/* About: network node (around y=-5) */}
        <SpatialObject type="network" position={[-3, -5, -1]} color={themeColor} speed={0.8} />
        
        {/* Journey: CPU (around y=-10) */}
        <SpatialObject type="cpu" position={[4, -10, -3]} color="#ffffff" speed={0.5} floatIntensity={4} />
        
        {/* Skills: glowing orb cluster (around y=-15) */}
        <SpatialObject type="orb" position={[-2, -15, -4]} color={themeColor} speed={2} floatIntensity={5} />
        
        {/* Projects: server & database (around y=-20) */}
        <SpatialObject type="server" position={[3, -20, -2]} color="#ffffff" speed={0.6} />
        <SpatialObject type="database" position={[-3, -22, -3]} color={themeColor} speed={0.8} />
        
        {/* Lab: AI (around y=-26) */}
        <SpatialObject type="ai" position={[2, -26, -1]} color={themeColor} speed={1.2} floatIntensity={3} />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
