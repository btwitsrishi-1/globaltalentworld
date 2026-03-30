"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;
    vec3 color = vec3(0.0);
    for(int j = 0; j < 3; j++){
      for(int i = 0; i < 5; i++){
        color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01*float(j) + float(i)*0.01) * 5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
      }
    }
    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { width, height } = useRef({ width: 1, height: 1 }).current

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(width, height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame(({ size }) => {
    uniforms.time.value += 0.05
    uniforms.resolution.value.set(size.width, size.height)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function ShaderAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1]}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  )
}
