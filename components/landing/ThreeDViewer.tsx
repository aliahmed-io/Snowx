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

// OPTIMIZED: Reduced particle count from 800 to 300
const PARTICLE_COUNT = 300;

// Pre-generate particle data outside useMemo
const SPIRAL_PARTICLE_DATA = (() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 20;
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
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => SPIRAL_PARTICLE_DATA, []);
    const transition = useRef(0);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        const target = isAnimating ? 1 : 0;
        transition.current = THREE.MathUtils.lerp(transition.current, target, delta * 2);

        const t = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            const { speed, originalAngle, originalRadius } = particle;

            const snowTime = t * speed;
            const snowY = 10 - ((snowTime * 6 + particle.y) % 20);
            const snowX = Math.cos(originalAngle + snowTime * 0.2) * originalRadius * 1.2;
            const snowZ = Math.sin(originalAngle + snowTime * 0.2) * originalRadius * 1.2;
            const snowScale = 0.025;

            const spiralTime = t * 3;
            const spiralRadius = originalRadius * Math.max(0.1, 1 - (Math.sin(spiralTime) + 1) / 4);
            const spiralAngle = originalAngle + spiralTime * 6;

            const spiralX = Math.cos(spiralAngle) * spiralRadius * 2;
            const spiralY = Math.sin(spiralTime * 2 + i * 0.01) * 2;
            const spiralZ = Math.sin(spiralAngle) * spiralRadius * 2;
            const spiralScale = 0.05;

            const f = transition.current;
            dummy.position.set(
                THREE.MathUtils.lerp(snowX, spiralX, f),
                THREE.MathUtils.lerp(snowY, spiralY, f),
                THREE.MathUtils.lerp(snowZ, spiralZ, f)
            );

            dummy.scale.setScalar(THREE.MathUtils.lerp(snowScale, spiralScale, f));
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLE_COUNT]}>
            {/* OPTIMIZED: Using simpler sphereGeometry instead of dodecahedron */}
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
    );
}

function Model({ onClick, isAnimating }: { onClick: () => void, isAnimating: boolean }) {
    const { scene } = useGLTF("/3d-model.glb");
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const groupRef = useRef<THREE.Group>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    const material = Array.isArray(mesh.material)
                        ? mesh.material[0].clone()
                        : mesh.material.clone();

                    (material as THREE.MeshStandardMaterial).color.set("#ffffff");
                    (material as THREE.MeshStandardMaterial).emissive.set("#bae6fd");
                    (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
                    (material as THREE.MeshStandardMaterial).roughness = 0.2;
                    (material as THREE.MeshStandardMaterial).metalness = 0.9;

                    mesh.material = material;
                }
            }
        });
    }, [clonedScene]);

    useEffect(() => {
        if (!groupRef.current || !isAnimating) return;

        // Kill any existing animation before starting new one
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl.to(groupRef.current.rotation, {
            y: groupRef.current.rotation.y + Math.PI * 2, // OPTIMIZED: Reduced from 4 to 2 rotations
            duration: 1.2, // OPTIMIZED: Slightly faster
            ease: "power2.out"
        })
            .to(groupRef.current.scale, {
                x: 1.1, y: 1.1, z: 1.1, // OPTIMIZED: Reduced scale
                duration: 0.15,
                ease: "power2.out"
            }, 0)
            .to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)"
            }, 0.15);

        return () => {
            tl.kill();
        };
    }, [isAnimating]);

    useFrame((state, delta) => {
        if (groupRef.current && !isAnimating) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
            event.preventDefault();
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

// OPTIMIZED: Click debounce cooldown in ms
const CLICK_COOLDOWN = 500;

export function ThreeDViewer() {
    const t = useTranslations("Common");
    const [isAnimating, setIsAnimating] = useState(false);
    const [contextLost, setContextLost] = useState(false);
    const [key, setKey] = useState(0);
    const lastClickTime = useRef(0);

    // OPTIMIZED: Debounced click handler to prevent spam clicks
    const handleClick = useCallback(() => {
        const now = Date.now();
        if (now - lastClickTime.current < CLICK_COOLDOWN) {
            return; // Ignore rapid clicks
        }
        lastClickTime.current = now;

        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1500); // OPTIMIZED: Reduced from 2000ms
        }
    }, [isAnimating]);

    const handleContextLost = useCallback(() => {
        console.warn("WebGL context lost - will attempt recovery");
        setContextLost(true);
    }, []);

    const handleContextRestored = useCallback(() => {
        console.log("WebGL context restored");
        setContextLost(false);
        setKey(prev => prev + 1);
    }, []);

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
                // OPTIMIZED: Use demand mode - only render when needed
                frameloop="always"
                dpr={[1, 1.5]} // OPTIMIZED: Limit device pixel ratio
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

                {/* OPTIMIZED: Reduced sparkle count */}
                <Sparkles count={60} scale={10} size={1.5} speed={0.2} opacity={0.4} color="#ffffff" />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-snow-accent/60 text-sm">
                {t("clickToInteract")}
            </div>
        </div>
    );
}
