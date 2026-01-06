"use client";

import React, { useRef, useState, useMemo, Suspense, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, Sparkles, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Loading component
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="text-snow-accent text-lg font-medium">
                Loading 3D Model... {progress.toFixed(0)}%
            </div>
        </Html>
    );
}

function SpiralParticles({ isAnimating }: { isAnimating: boolean }) {
    const count = 800; // Reduced for performance
    const mesh = useRef<THREE.InstancedMesh>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 20;
            const radius = 2 + Math.random() * 3;
            const speed = 0.03 + Math.random() * 0.07;

            temp.push({
                speed,
                y: Math.random() * 30,
                originalAngle: angle,
                originalRadius: radius
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            const { speed, originalAngle, originalRadius } = particle;

            if (isAnimating) {
                // Spiral to center
                const t = state.clock.getElapsedTime() * 3;
                const currentRadius = originalRadius * Math.max(0.1, 1 - (Math.sin(t) + 1) / 4);
                const currentAngle = originalAngle + t * 6;

                dummy.position.set(
                    Math.cos(currentAngle) * currentRadius * 2,
                    Math.sin(t * 2 + i * 0.01) * 2,
                    Math.sin(currentAngle) * currentRadius * 2
                );
                dummy.scale.setScalar(0.05);
            } else {
                // Falling snow
                const t = state.clock.getElapsedTime() * speed;
                const yPos = 10 - ((t * 6 + particle.y) % 20);

                dummy.position.set(
                    Math.cos(originalAngle + t * 0.2) * originalRadius * 1.2,
                    yPos,
                    Math.sin(originalAngle + t * 0.2) * originalRadius * 1.2
                );
                dummy.scale.setScalar(0.025);
            }

            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.04, 0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
    );
}

function Model({ onClick, isAnimating }: { onClick: () => void, isAnimating: boolean }) {
    const { scene } = useGLTF("/3d-model.glb");
    const groupRef = useRef<THREE.Group>(null);

    // Apply ice material
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const iceMaterial = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0x88d4ff),
                    metalness: 0.0,
                    roughness: 0.15,
                    transmission: 0.8,
                    thickness: 1.5,
                    ior: 1.4,
                    envMapIntensity: 1.5,
                    clearcoat: 0.3,
                    transparent: true,
                    opacity: 0.9,
                });
                mesh.material = iceMaterial;
            }
        });
    }, [scene]);

    // GSAP click animation
    useEffect(() => {
        if (!groupRef.current || !isAnimating) return;

        gsap.timeline()
            .to(groupRef.current.rotation, {
                y: groupRef.current.rotation.y + Math.PI * 4,
                duration: 1.5,
                ease: "power2.out"
            })
            .to(groupRef.current.scale, {
                x: 1.2, y: 1.2, z: 1.2,
                duration: 0.2,
                ease: "power2.out"
            }, 0)
            .to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)"
            }, 0.2);
    }, [isAnimating]);

    // Floating
    useFrame((state) => {
        if (groupRef.current && !isAnimating) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef} onClick={onClick}>
            <primitive
                object={scene}
                scale={2.5}
                position={[0, 0, 0]}
                rotation={[0.2, -0.3, 0]}
            />
        </group>
    );
}

// Preload
useGLTF.preload("/3d-model.glb");

export function ThreeDViewer() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [contextLost, setContextLost] = useState(false);
    const [key, setKey] = useState(0);

    const handleClick = useCallback(() => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 2000);
        }
    }, [isAnimating]);

    // Handle WebGL context loss/restoration
    const handleContextLost = useCallback(() => {
        console.warn("WebGL context lost - will attempt recovery");
        setContextLost(true);
    }, []);

    const handleContextRestored = useCallback(() => {
        console.log("WebGL context restored");
        setContextLost(false);
        setKey(prev => prev + 1); // Force re-render
    }, []);

    // Auto-recover after context loss
    useEffect(() => {
        if (contextLost) {
            const timer = setTimeout(() => {
                setKey(prev => prev + 1);
                setContextLost(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [contextLost]);

    if (contextLost) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-snow-primary/50 rounded-xl">
                <div className="text-snow-accent animate-pulse">Recovering 3D view...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-[500px] relative z-10 cursor-pointer">
            <Canvas
                key={key}
                camera={{ position: [0, 0, 7], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
                    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
                }}
            >
                <fog attach="fog" args={['#0a1628', 8, 18]} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[10, 10, 10]} intensity={1.0} color="#60a5fa" />
                <pointLight position={[-10, 5, 0]} intensity={0.8} color="#e0f2fe" />

                {/* Environment */}
                <Environment preset="night" />

                {/* 3D Model */}
                <Suspense fallback={<Loader />}>
                    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                        <Model onClick={handleClick} isAnimating={isAnimating} />
                    </Float>
                </Suspense>

                {/* Snow */}
                <SpiralParticles isAnimating={isAnimating} />

                {/* Sparkles */}
                <Sparkles count={100} scale={10} size={1.5} speed={0.2} opacity={0.4} color="#ffffff" />
            </Canvas>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-snow-accent/60 text-sm">
                Click to interact
            </div>
        </div>
    );
}
