'use client'

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingShape({
  position,
  geometry,
  scale = 1,
  speed = 1,
  color = '#3b82f6',
  mouse,
}: {
  position: [number, number, number]
  geometry: 'icosahedron' | 'octahedron' | 'tetrahedron' | 'torus' | 'dodecahedron'
  scale?: number
  speed?: number
  color?: string
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialPos = useRef(new THREE.Vector3(...position))
  const randomOffset = useRef(Math.random() * Math.PI * 2)

  const geo = useMemo(() => {
    switch (geometry) {
      case 'icosahedron': return new THREE.IcosahedronGeometry(0.5, 0)
      case 'octahedron': return new THREE.OctahedronGeometry(0.5, 0)
      case 'tetrahedron': return new THREE.TetrahedronGeometry(0.5, 0)
      case 'torus': return new THREE.TorusGeometry(0.4, 0.15, 8, 16)
      case 'dodecahedron': return new THREE.DodecahedronGeometry(0.5, 0)
    }
  }, [geometry])

  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.9,
    roughness: 0.15,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.1,
  }), [color])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime * speed + randomOffset.current

    meshRef.current.position.x = initialPos.current.x + Math.sin(time * 0.5) * 0.3
    meshRef.current.position.y = initialPos.current.y + Math.cos(time * 0.4) * 0.5
    meshRef.current.position.z = initialPos.current.z + Math.sin(time * 0.3) * 0.2

    meshRef.current.rotation.x = time * 0.2
    meshRef.current.rotation.y = time * 0.3

    const mouseVec = new THREE.Vector2(mouse.current.x * 5, mouse.current.y * 3)
    const meshPos2D = new THREE.Vector2(meshRef.current.position.x, meshRef.current.position.y)
    const dir = meshPos2D.sub(mouseVec)
    const dist = dir.length()

    if (dist < 3) {
      const force = (3 - dist) * 0.02
      dir.normalize()
      meshRef.current.position.x += dir.x * force
      meshRef.current.position.y += dir.y * force
    }
  })

  return <mesh ref={meshRef} geometry={geo} material={mat} scale={scale} />
}

function FloatingScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  // Half blue, half green shapes
  const shapes = useMemo(() => [
    { position: [-4, 2, -3] as [number, number, number], geometry: 'icosahedron' as const, scale: 0.8, speed: 0.6, color: '#3b82f6' },
    { position: [4, -1.5, -4] as [number, number, number], geometry: 'octahedron' as const, scale: 0.6, speed: 0.8, color: '#10b981' },
    { position: [-3, -2, -2] as [number, number, number], geometry: 'tetrahedron' as const, scale: 0.5, speed: 0.7, color: '#60a5fa' },
    { position: [3, 2.5, -5] as [number, number, number], geometry: 'dodecahedron' as const, scale: 0.7, speed: 0.5, color: '#34d399' },
    { position: [0, -3, -3] as [number, number, number], geometry: 'torus' as const, scale: 0.6, speed: 0.9, color: '#2563eb' },
    { position: [-5, 0, -4] as [number, number, number], geometry: 'octahedron' as const, scale: 0.4, speed: 1.0, color: '#10b981' },
    { position: [5, 1, -6] as [number, number, number], geometry: 'icosahedron' as const, scale: 0.5, speed: 0.4, color: '#3b82f6' },
    { position: [1, 3, -4] as [number, number, number], geometry: 'tetrahedron' as const, scale: 0.3, speed: 1.1, color: '#059669' },
  ], [])

  return (
    <>
      <ambientLight intensity={0.3} color="#dbeafe" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#10b981" />
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} mouse={mouse} />
      ))}
    </>
  )
}

export function FloatingElements({ className = '' }: { className?: string }) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  if (!isClient) return null

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        fallback={<div />}
      >
        <FloatingScene mouse={mouseRef} />
      </Canvas>
    </div>
  )
}
