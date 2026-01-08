"use client";

import React, { useRef, useState, useMemo, Suspense, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float, Sparkles, Html, useProgress, Center } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useTranslations } from "next-intl";

// Loading component
function Loader() {
    const { progress } = useProgress();
    const t = useTranslations("Common");
    return (
        <Html center>
            <div className="text-snow-accent text-lg font-medium">
                {t("loading3DModel")} {progress.toFixed(0)}%
            </div>
        </Html>
    );
}

// Pre-generate particle data outside useMemo to avoid purity issues
const SPIRAL_PARTICLE_DATA = (() => {
    const temp = [];
    for (let i = 0; i < 800; i++) {
        const angle = (i / 800) * Math.PI * 20;
        // Deterministic pseudo-random based on index
        const seedA = ((i * 17) % 100) / 100;
        const seedB = ((i * 31) % 100) / 100;
        const seedC = ((i * 47) % 100) / 100;

        temp.push({
            speed: 0.03 + seedB * 0.07,
            y: seedC * 30,
            originalAngle: angle,
            originalRadius: 2 + seedA * 3
        });
    }
    return temp;
})();

function SpiralParticles({ isAnimating }: { isAnimating: boolean }) {
    const count = 800;
    const mesh = useRef<THREE.InstancedMesh>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => SPIRAL_PARTICLE_DATA, []);
    const transition = useRef(0); // 0 = Snow, 1 = Spiral

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // Smoothly transition between states
        const target = isAnimating ? 1 : 0;
        transition.current = THREE.MathUtils.lerp(transition.current, target, delta * 2);

        const t = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            const { speed, originalAngle, originalRadius } = particle;

            // 1. Calculate Snow Position
            const snowTime = t * speed;
            const snowY = 10 - ((snowTime * 6 + particle.y) % 20);
            const snowX = Math.cos(originalAngle + snowTime * 0.2) * originalRadius * 1.2;
            const snowZ = Math.sin(originalAngle + snowTime * 0.2) * originalRadius * 1.2;
            const snowScale = 0.025;

            // 2. Calculate Spiral Position
            const spiralTime = t * 3;
            // Easing radius for spiral effect
            const spiralRadius = originalRadius * Math.max(0.1, 1 - (Math.sin(spiralTime) + 1) / 4);
            const spiralAngle = originalAngle + spiralTime * 6;

            const spiralX = Math.cos(spiralAngle) * spiralRadius * 2;
            const spiralY = Math.sin(spiralTime * 2 + i * 0.01) * 2;
            const spiralZ = Math.sin(spiralAngle) * spiralRadius * 2;
            const spiralScale = 0.05;

            // 3. Lerp between positions
            const f = transition.current;
            dummy.position.set(
                THREE.MathUtils.lerp(snowX, spiralX, f),
                THREE.MathUtils.lerp(snowY, spiralY, f),
                THREE.MathUtils.lerp(snowZ, spiralZ, f)
            );

            // Lerp scale
            dummy.scale.setScalar(THREE.MathUtils.lerp(snowScale, spiralScale, f));

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
    // Fix: Clone scene to prevent mutation of cached asset
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const groupRef = useRef<THREE.Group>(null);

    // Apply Frost Material Look
    useEffect(() => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    // Clone material to ensure unique instance if shared
                    const material = Array.isArray(mesh.material)
                        ? mesh.material[0].clone()
                        : mesh.material.clone();

                    // Frost/Ice Properties with whiter finish
                    (material as THREE.MeshStandardMaterial).color.set("#ffffff"); // Pure white base
                    (material as THREE.MeshStandardMaterial).emissive.set("#bae6fd"); // Very pale blue glow (whiter)
                    (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
                    (material as THREE.MeshStandardMaterial).roughness = 0.2; // Smoother for more reflections
                    (material as THREE.MeshStandardMaterial).metalness = 0.9; // High metalness for shiny ice look

                    mesh.material = material;
                }
            }
        });
    }, [clonedScene]);

    useEffect(() => {
        if (!groupRef.current || !isAnimating) return;

        const tl = gsap.timeline();
        tl.to(groupRef.current.rotation, {
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

        return () => {
            tl.kill();
        };
    }, [isAnimating]);

    useFrame((state, delta) => {
        // Fix: Avoid conflict between GSAP and useFrame for position/rotation
        if (groupRef.current && !isAnimating) {
            // Floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            // Slow continuous rotation to show whole model
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef} onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}>
            <Center>
                <primitive
                    object={clonedScene}
                    scale={2.5}
                    // Removed static rotation to allow continuous rotation
                    rotation={[0, 0, 0]}
                />
            </Center>
        </group>
    );
}

function ContextHandler({ onLost, onRestored }: { onLost: (e: Event) => void, onRestored: () => void }) {
    const { gl } = useThree();
    useEffect(() => {
        const canvas = gl.domElement;

        const handleLost = (event: Event) => {
            event.preventDefault(); // Important: Allows context to be restored
            onLost(event);
        };

        const handleRestored = () => {
            onRestored();
        };

        canvas.addEventListener('webglcontextlost', handleLost);
        canvas.addEventListener('webglcontextrestored', handleRestored);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleLost);
            canvas.removeEventListener('webglcontextrestored', handleRestored);
        };
    }, [gl, onLost, onRestored]);
    return null;
}

// Preload
useGLTF.preload("/3d-model.glb");

export function ThreeDViewer() {
    const t = useTranslations("Common");
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
                <div className="text-snow-accent animate-pulse">{t("recovering3DView")}</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[400px] relative z-10 cursor-pointer">
            <Canvas
                key={key}
                camera={{ position: [0, 0, 7], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: false
                }}
            >
                <ContextHandler onLost={handleContextLost} onRestored={handleContextRestored} />

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
                {t("clickToInteract")}
            </div>
        </div>
    );
}
