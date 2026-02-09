'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function SpinningLogo() {
  const logoRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/logo.glb')
  const [clonedScene] = useState(() => scene.clone())

  useEffect(() => {
    if (!clonedScene) return

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x3b82f6),
          metalness: 0.8,
          roughness: 0.2,
          emissive: new THREE.Color(0x1d4ed8),
          emissiveIntensity: 0.3,
        })

        // Add green wireframe overlay
        const wireGeo = new THREE.WireframeGeometry(child.geometry)
        const wireMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(0x34d399),
          transparent: true,
          opacity: 0.3,
        })
        const wireLines = new THREE.LineSegments(wireGeo, wireMat)
        child.add(wireLines)
      }
    })

    // Center and scale to fit small viewport
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    clonedScene.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.2 / maxDim
    clonedScene.scale.setScalar(scale)
  }, [clonedScene])

  useFrame((state) => {
    if (!logoRef.current) return
    logoRef.current.rotation.y = state.clock.elapsedTime * 0.8
  })

  return (
    <group ref={logoRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

export function NavbarLogo3D() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">G</span>
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: false }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} color="#dbeafe" />
        <directionalLight position={[3, 3, 3]} intensity={1.0} color="#3b82f6" />
        <directionalLight position={[-2, 2, 3]} intensity={0.5} color="#10b981" />
        <React.Suspense fallback={null}>
          <SpinningLogo />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
