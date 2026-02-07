'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ScrollControls, useScroll, Environment } from '@react-three/drei'
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

// Logo component with scroll animations
function ScrollingLogo() {
  const logoRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/logo.glb')
  const scroll = useScroll()
  const { viewport } = useThree()
  const [clonedScene] = useState(() => scene.clone())

  useEffect(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x059669,
            emissiveIntensity: 0.4,
          })
          child.material = material

          const wireframe = new THREE.WireframeGeometry(child.geometry)
          const line = new THREE.LineSegments(wireframe)
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x34d399,
            transparent: true,
            opacity: 0.6,
          })
          line.material = lineMaterial
          child.add(line)
        }
      })

      const box = new THREE.Box3().setFromObject(clonedScene)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      clonedScene.position.sub(center)

      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = (viewport.height * 1.8) / maxDim
      clonedScene.scale.setScalar(scale)
    }
  }, [clonedScene, viewport])

  useFrame((state) => {
    if (!logoRef.current || !scroll) return

    const offset = scroll.offset

    logoRef.current.rotation.y = state.clock.elapsedTime * 0.2

    if (offset < 0.4) {
      logoRef.current.position.x = 0
      logoRef.current.position.y = 0
      logoRef.current.position.z = -3
      logoRef.current.scale.setScalar(1.8)
      logoRef.current.rotation.x = 0
    } else if (offset < 0.6) {
      const t = (offset - 0.4) / 0.2
      logoRef.current.position.x = THREE.MathUtils.lerp(0, viewport.width * 0.3, t)
      logoRef.current.position.y = THREE.MathUtils.lerp(0, viewport.height * 0.05, t)
      logoRef.current.position.z = THREE.MathUtils.lerp(-3, -2, t)
      logoRef.current.scale.setScalar(THREE.MathUtils.lerp(1.8, 0.8, t))
      logoRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI * 0.1, t)
    } else if (offset < 0.8) {
      logoRef.current.position.x = viewport.width * 0.3
      logoRef.current.position.y = viewport.height * 0.05
      logoRef.current.position.z = -2
      logoRef.current.rotation.x = -Math.PI * 0.1
      logoRef.current.scale.setScalar(0.8)
    } else {
      const t = (offset - 0.8) / 0.2
      logoRef.current.position.x = THREE.MathUtils.lerp(viewport.width * 0.3, viewport.width * 0.25, t)
      logoRef.current.position.y = THREE.MathUtils.lerp(viewport.height * 0.05, -viewport.height * 0.1, t)
      logoRef.current.position.z = THREE.MathUtils.lerp(-2, -5, t)
      logoRef.current.rotation.x = -Math.PI * 0.1
      logoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 0.5, t))
    }
  })

  return (
    <group ref={logoRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.8} color="#d1fae5" />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#10b981" />
      <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#34d399" />
      <pointLight position={[0, 0, 10]} intensity={1} color="#6ee7b7" />
      <pointLight position={[0, -5, 5]} intensity={0.8} color="#059669" />
      <ScrollingLogo />
    </>
  )
}

// Loading fallback that matches the hero look
function HeroFallback() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="text-center max-w-5xl mx-auto px-6">
        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-green-200 leading-tight drop-shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-6">
          Global Talent World
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto font-light tracking-wide">
          A digital sanctuary for the world&apos;s most exceptional minds.
        </p>
        <div className="mt-12">
          <div className="w-8 h-8 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  )
}

export function ScrollingLogo3DHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasError, setCanvasError] = useState(false)
  const { scrollYProgress } = useFramerScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95])

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(52,211,153,0.15),transparent_50%)]" />

        {/* 3D Canvas */}
        {!canvasError && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                onError={() => setCanvasError(true)}
                fallback={<div />}
              >
                <ScrollControls pages={4} damping={0.15}>
                  <Scene />
                </ScrollControls>
              </Canvas>
            </Suspense>
          </div>
        )}

        {/* Hero Text */}
        <motion.div
          style={{ opacity: textOpacity, scale: textScale }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="text-center max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-green-200 leading-tight drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                Global Talent World
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto font-light tracking-wide drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              A digital sanctuary for the world&apos;s most exceptional minds.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-6 h-10 border-2 border-emerald-400/40 rounded-full flex justify-center pt-2"
              >
                <motion.div className="w-1 h-2 bg-emerald-400/60 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Accent glows */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl z-5 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-400/15 rounded-full blur-3xl z-5 mix-blend-screen pointer-events-none" />
      </div>
    </div>
  )
}

useGLTF.preload('/logo.glb')
