"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const BRAND = "#CFFE25";
const BRAND_SOFT = "#9be31a";
const BRAND_GLOW = "#5b8a1a";
const FOG_COLOR = "#0a0a0a";

interface MousePos {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function ParticleHalo({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const rand = seedRandom(2718);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI;
      const r = 1.1 + rand() * 0.9;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      arr[i * 3 + 1] = Math.cos(phi) * r;
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length / 3; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(t * 0.6 + i * 0.5) * delta * 0.06;
      pos[i3] += Math.cos(t * 0.4 + i * 0.3) * delta * 0.05;
      pos[i3 + 2] += Math.sin(t * 0.5 + i * 0.7) * delta * 0.05;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={BRAND}
        transparent
        opacity={0.32}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Glyph() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.18}>
      <mesh ref={ref}>
        <Text
          fontSize={1.15}
          letterSpacing={-0.04}
          fontWeight={700}
          color={BRAND}
          anchorX="center"
          anchorY="middle"
        >
          B+
          <MeshDistortMaterial
            attach="material"
            color={BRAND}
            emissive={BRAND}
            emissiveIntensity={0.5}
            roughness={0.25}
            metalness={0.55}
            distort={0.3}
            speed={1.3}
            radius={0.6}
          />
        </Text>
      </mesh>
    </Float>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[1.55, 0.012, 16, 200]} />
      <meshStandardMaterial
        color={BRAND}
        emissive={BRAND}
        emissiveIntensity={1.1}
        metalness={0.9}
        roughness={0.15}
      />
    </mesh>
  );
}

const CUBES = Array.from({ length: 6 }, (_, i) => ({
  radius: 1.85 + (i % 3) * 0.18,
  speed: 0.18 + i * 0.03,
  phase: (i / 6) * Math.PI * 2,
  size: 0.06 + (i % 2) * 0.025,
  yOffset: -0.4 + (i % 3) * 0.4,
  tone: i % 2 === 0 ? BRAND : BRAND_SOFT,
}));

function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const t = performance.now() * 0.001;
    groupRef.current.children.forEach((cube, i) => {
      const c = CUBES[i];
      const angle = c.phase + t * c.speed;
      cube.position.x = Math.cos(angle) * c.radius;
      cube.position.z = Math.sin(angle) * c.radius;
      cube.position.y = c.yOffset + Math.sin(t * 0.8 + i) * 0.08;
    });
  });

  return (
    <group ref={groupRef}>
      {CUBES.map((c, i) => (
        <mesh key={i}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial
            color={c.tone}
            emissive={c.tone}
            emissiveIntensity={0.7}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Sculpture({
  mouseRef,
  scrollProgressRef,
  reduceMotion,
}: {
  mouseRef: React.MutableRefObject<MousePos>;
  scrollProgressRef: React.MutableRefObject<number>;
  reduceMotion?: boolean;
}) {
  const scrollGroupRef = useRef<THREE.Group>(null!);
  const mouseGroupRef = useRef<THREE.Group>(null!);
  const glyphGroupRef = useRef<THREE.Group>(null!);
  const scrollRotRef = useRef(0);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    const scrollT = scrollProgressRef.current;
    const mouse = mouseRef.current;

    scrollRotRef.current += scrollT * delta * 0.7;
    scrollGroupRef.current.rotation.y = scrollRotRef.current;

    mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      mouseGroupRef.current.rotation.x,
      mouse.y * 0.2,
      delta * 2.5,
    );
    mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      mouseGroupRef.current.rotation.y,
      mouse.x * 0.25,
      delta * 2.5,
    );

    const tx = mouse.x * 0.45;
    const ty = mouse.y * 0.28 - scrollT * 0.55;
    glyphGroupRef.current.position.x = THREE.MathUtils.lerp(
      glyphGroupRef.current.position.x,
      tx,
      delta * 3,
    );
    glyphGroupRef.current.position.y = THREE.MathUtils.lerp(
      glyphGroupRef.current.position.y,
      ty,
      delta * 3,
    );

    const baseZ = 5.5;
    const zoomTarget = baseZ + scrollT * 2.2;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      zoomTarget,
      delta * 1.5,
    );

    state.camera.lookAt(mouse.x * 0.45, mouse.y * 0.3, 0);
  });

  return (
    <group ref={scrollGroupRef}>
      <group ref={mouseGroupRef}>
        <group ref={glyphGroupRef}>
          <Glyph />
          <OrbitRing />
        </group>
        <FloatingCubes />
        <ParticleHalo />
      </group>
    </group>
  );
}

interface HeroSceneProps {
  mouseRef: React.MutableRefObject<MousePos>;
  scrollProgressRef: React.MutableRefObject<number>;
  reduceMotion?: boolean;
}

function CanvasContents({
  mouseRef,
  scrollProgressRef,
  reduceMotion,
}: HeroSceneProps) {
  const { size, gl } = useThree();
  const isMobile = size.width < 768;

  useEffect(() => {
    gl.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
  }, [isMobile, gl]);

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight
        position={[3, 2, 2]}
        intensity={isMobile ? 18 : 28}
        color={BRAND}
        distance={14}
      />
      <pointLight
        position={[-2, -1, 1]}
        intensity={6}
        color={BRAND_GLOW}
        distance={10}
      />
      <fog attach="fog" args={[FOG_COLOR, 4, 14]} />

      <Sculpture
        mouseRef={mouseRef}
        scrollProgressRef={scrollProgressRef}
        reduceMotion={reduceMotion}
      />

      {!isMobile && !reduceMotion && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={0.85}
            radius={2}
            levels={8}
          />
        </EffectComposer>
      )}
    </>
  );
}

export function HeroScene(props: HeroSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {mounted ? (
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 5.5], fov: 50, near: 0.1, far: 30 }}
          style={{ width: "100%", height: "100%" }}
        >
          <CanvasContents {...props} />
        </Canvas>
      ) : null}
    </div>
  );
}