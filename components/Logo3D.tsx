'use client'

import { useRef, useEffect } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function Logo3D({ scrollBased = false }: { scrollBased?: boolean }) {
  const logoRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/logo.glb')
  const { viewport } = useThree()
  const scroll = scrollBased ? useScroll() : null

  // Clone the scene to avoid sharing materials
  const clonedScene = useRef(scene.clone())

  useEffect(() => {
    if (clonedScene.current) {
      // Apply scaffolding/wireframe effect with green highlights
      clonedScene.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Create a metallic material with green highlights
          const material = new THREE.MeshStandardMaterial({
            color: 0x10b981, // Emerald green
            metalness: 0.85,
            roughness: 0.15,
            emissive: 0x059669, // Dark green emissive
            emissiveIntensity: 0.35,
            transparent: false,
            opacity: 1.0,
          })
          child.material = material

          // Add bright wireframe overlay for scaffolding effect
          const wireframe = new THREE.WireframeGeometry(child.geometry)
          const line = new THREE.LineSegments(wireframe)
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x34d399, // Light green
            transparent: true,
            opacity: 0.5
          })
          line.material = lineMaterial
          child.add(line)
        }
      })

      // Calculate bounding box and center
      const box = new THREE.Box3().setFromObject(clonedScene.current)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      // Center the model
      clonedScene.current.position.sub(center)

      // Scale to fit
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = (viewport.height * 0.6) / maxDim
      clonedScene.current.scale.setScalar(scale)
    }
  }, [viewport])

  useFrame((state) => {
    if (!logoRef.current) return

    if (scrollBased && scroll) {
      const offset = scroll.offset

      // Section 1: 0-0.33 - Centered, gentle rotation
      if (offset < 0.33) {
        logoRef.current.rotation.y = state.clock.elapsedTime * 0.2
        logoRef.current.position.x = 0
        logoRef.current.position.z = 0
        logoRef.current.scale.setScalar(1)
      }
      // Section 2: 0.33-0.66 - Move right, shrink
      else if (offset < 0.66) {
        const t = (offset - 0.33) / 0.33
        logoRef.current.position.x = THREE.MathUtils.lerp(0, viewport.width * 0.25, t)
        logoRef.current.position.z = THREE.MathUtils.lerp(0, -2, t)
        logoRef.current.rotation.y = THREE.MathUtils.lerp(
          state.clock.elapsedTime * 0.2,
          Math.PI * 0.5,
          t
        )
        logoRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.5, t))
      }
      // Section 3: 0.66-1.0 - Profile view, recede
      else {
        const t = (offset - 0.66) / 0.34
        logoRef.current.position.x = THREE.MathUtils.lerp(
          viewport.width * 0.25,
          viewport.width * 0.2,
          t
        )
        logoRef.current.position.z = THREE.MathUtils.lerp(-2, -4, t)
        logoRef.current.rotation.y = THREE.MathUtils.lerp(
          Math.PI * 0.5,
          Math.PI * 0.75,
          t
        )
        logoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.5, 0.3, t))
      }
    } else {
      // Simple continuous rotation for navbar - smooth and stable
      logoRef.current.rotation.y += 0.01
      logoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={logoRef}>
      <primitive object={clonedScene.current} />
    </group>
  )
}

useGLTF.preload('/logo.glb')
