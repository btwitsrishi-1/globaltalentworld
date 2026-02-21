'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform vec2  iResolution;
  uniform float iTime;
  uniform vec2  iMouse;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec2 mouse = (iMouse          - 0.5 * iResolution.xy) / iResolution.y;

    float t = iTime * 0.3;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float mouseDist = length(uv - mouse);
    float bloom     = smoothstep(0.4, 0.0, mouseDist);

    float petals     = 5.0 + sin(t) * 2.0;
    float petalShape = sin(a * petals + r * 2.0);
    petalShape = pow(abs(petalShape), 0.5);

    float flow    = sin(r * 10.0 - t * 2.0);
    float pattern = mix(petalShape, flow, 0.5) + bloom * 0.5;

    vec3 color1         = vec3(0.8, 0.1, 0.5);
    vec3 color2         = vec3(0.2, 0.4, 0.9);
    vec3 highlightColor = vec3(1.0);

    vec3 finalColor = mix(
      color1,
      color2,
      smoothstep(0.5, 0.8, r + random(vec2(t, t)) * 0.1)
    ) * pattern;
    finalColor += highlightColor * pow(pattern, 10.0) * (1.0 + bloom);

    // alpha: only show the petal shapes, transparent outside
    float alpha = clamp(pattern * 0.85, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export default function DigitalPetalsShader({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const clock = new THREE.Clock()

    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.iResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)
    onResize()

    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(
        e.clientX,
        container.clientHeight - e.clientY,
      )
    }
    window.addEventListener('mousemove', onMouseMove)

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      renderer.setAnimationLoop(null)
      renderer.domElement.parentNode?.removeChild(renderer.domElement)
      material.dispose()
      mesh.geometry.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  )
}
