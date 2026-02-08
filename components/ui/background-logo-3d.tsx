'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function SlowSpinLogo() {
  const logoRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/logo.glb')
  const [clonedScene] = useState(() => scene.clone())

  useEffect(() => {
    if (!clonedScene) return

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x3b82f6),
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.04,
          wireframe: true,
          emissive: new THREE.Color(0x10b981),
          emissiveIntensity: 0.05,
        })
      }
    })

    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    clonedScene.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 4.0 / maxDim
    clonedScene.scale.setScalar(scale)
  }, [clonedScene])

  useFrame((state) => {
    if (!logoRef.current) return
    logoRef.current.rotation.y = state.clock.elapsedTime * 0.1
    logoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
  })

  return (
    <group ref={logoRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

export function BackgroundLogo3D({ className = '' }: { className?: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} color="#dbeafe" />
        <pointLight position={[3, 3, 5]} intensity={0.3} color="#3b82f6" />
        <React.Suspense fallback={null}>
          <SlowSpinLogo />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
