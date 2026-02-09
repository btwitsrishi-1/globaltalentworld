'use client'

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const rippleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRippleStrength;
  uniform float uRippleFrequency;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    float dist = length(worldPos.xy - uMouse);

    float ripple = sin(dist * uRippleFrequency - uTime * 3.0) * exp(-dist * 0.8);
    float displacement = ripple * uRippleStrength;

    float idle = sin(position.x * 2.0 + uTime * 0.5) * cos(position.y * 2.0 + uTime * 0.3) * 0.02;

    vDisplacement = displacement + idle;

    vec3 newPosition = position + normal * (displacement + idle);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const rippleFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
    float diffuse = max(dot(vNormal, lightDir), 0.0);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

    float glowIntensity = abs(vDisplacement) * 15.0;

    vec3 baseColor = uColor * (0.45 + diffuse * 0.55);
    vec3 glow = uGlowColor * (fresnel * 0.9 + glowIntensity);

    vec3 finalColor = baseColor + glow;

    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 48.0);
    finalColor += vec3(0.6, 0.85, 1.0) * spec * 0.35;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const wireVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRippleStrength;
  uniform float uRippleFrequency;

  varying float vDisplacement;

  void main() {
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    float dist = length(worldPos.xy - uMouse);
    float ripple = sin(dist * uRippleFrequency - uTime * 3.0) * exp(-dist * 0.8);
    float displacement = ripple * uRippleStrength;
    float idle = sin(position.x * 2.0 + uTime * 0.5) * cos(position.y * 2.0 + uTime * 0.3) * 0.02;

    vDisplacement = displacement + idle;
    vec3 newPosition = position + normal * (displacement + idle);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const wireFragmentShader = `
  uniform vec3 uWireColor;
  varying float vDisplacement;

  void main() {
    float glow = abs(vDisplacement) * 12.0;
    float alpha = 0.25 + glow * 0.5;
    gl_FragColor = vec4(uWireColor, alpha);
  }
`

function RippleLogo({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const logoRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const wireMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const { scene } = useGLTF('/logo.glb')
  const { viewport } = useThree()
  const [clonedScene] = useState(() => scene.clone())

  // Track the base dimensions for dynamic scaling
  const baseMaxDim = useRef(1)
  const currentScale = useRef(1)
  const isCentered = useRef(false)

  // Blue body + green glow/wireframe
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uRippleStrength: { value: 0.08 },
    uRippleFrequency: { value: 8.0 },
    uColor: { value: new THREE.Color(0x3b82f6) },
    uGlowColor: { value: new THREE.Color(0x10b981) },
  }), [])

  const wireUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uRippleStrength: { value: 0.08 },
    uRippleFrequency: { value: 8.0 },
    uWireColor: { value: new THREE.Color(0x34d399) },
  }), [])

  // One-time setup: apply materials + center the model (but NOT scale)
  useEffect(() => {
    if (!clonedScene || isCentered.current) return

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: { ...uniforms },
          vertexShader: rippleVertexShader,
          fragmentShader: rippleFragmentShader,
          side: THREE.DoubleSide,
        })
        child.material = shaderMat
        materialRef.current = shaderMat

        const wireGeo = new THREE.WireframeGeometry(child.geometry)
        const wireMat = new THREE.ShaderMaterial({
          uniforms: { ...wireUniforms },
          vertexShader: wireVertexShader,
          fragmentShader: wireFragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
        const wireLines = new THREE.LineSegments(wireGeo, wireMat)
        child.add(wireLines)
        wireMaterialRef.current = wireMat
      }
    })

    // Center the model
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    clonedScene.position.sub(center)
    baseMaxDim.current = Math.max(size.x, size.y, size.z)
    isCentered.current = true

    // Set initial scale
    const targetScale = (viewport.height * 1.6) / baseMaxDim.current
    clonedScene.scale.setScalar(targetScale)
    currentScale.current = targetScale
  }, [clonedScene, uniforms, wireUniforms, viewport.height])

  // Smoothly update scale + rotation + uniforms every frame
  useFrame((state) => {
    if (!logoRef.current || !clonedScene) return

    const time = state.clock.elapsedTime
    const vp = state.viewport

    // Smoothly lerp scale based on current viewport size
    const targetScale = (vp.height * 1.6) / baseMaxDim.current
    currentScale.current += (targetScale - currentScale.current) * 0.08
    clonedScene.scale.setScalar(currentScale.current)

    logoRef.current.rotation.y = time * 0.15

    const mouseVec = new THREE.Vector2(
      mouse.current.x * vp.width * 0.5,
      mouse.current.y * vp.height * 0.5
    )

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uMouse.value.copy(mouseVec)
    }
    if (wireMaterialRef.current) {
      wireMaterialRef.current.uniforms.uTime.value = time
      wireMaterialRef.current.uniforms.uMouse.value.copy(mouseVec)
    }
  })

  return (
    <group ref={logoRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

function LogoScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#dbeafe" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#3b82f6" />
      <directionalLight position={[-5, 3, 5]} intensity={1.0} color="#10b981" />
      <pointLight position={[0, 0, 8]} intensity={0.8} color="#34d399" />
      <RippleLogo mouse={mouse} />
    </>
  )
}

function LogoFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 animate-pulse" />
    </div>
  )
}

export function RippleLogo3D({ className = '' }: { className?: string }) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  if (hasError || !isClient) {
    return <LogoFallback />
  }

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: false }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        onError={() => setHasError(true)}
        fallback={<LogoFallback />}
      >
        <React.Suspense fallback={null}>
          <LogoScene mouse={mouseRef} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/logo.glb')
