"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating point particles that slowly rotate, emulating a neural-network
 * constellation background. Uses imperative geometry attachment to satisfy
 * strict R3F / Three.js typing requirements.
 */
function Particles({ count = 150 }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#00C896"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Connections({ count = 40 }) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    for (let i = 0; i < count; i++) {
      const sx = (Math.random() - 0.5) * 10;
      const sy = (Math.random() - 0.5) * 10;
      const sz = (Math.random() - 0.5) * 10;
      vertices.push(sx, sy, sz);
      vertices.push(
        sx + (Math.random() - 0.5) * 2,
        sy + (Math.random() - 0.5) * 2,
        sz + (Math.random() - 0.5) * 2
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [count]);

  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.0008;
      lineRef.current.rotation.z += 0.0004;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#3B82F6" transparent opacity={0.2} />
    </lineSegments>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles count={200} />
        <Particles count={100} />
        <Connections count={50} />
      </Canvas>
    </div>
  );
}
