'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform vec2  iResolution;
  uniform float iTime;

  void mainImage(out vec4 O, in vec2 fragCoord) {
    O = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 b = vec2(0.0, 0.2);
    vec2 p;

    vec2 center = iResolution.xy * 0.5;
    float dist   = distance(fragCoord, center);
    float radius  = min(iResolution.x, iResolution.y) * 0.5;

    // Dim the center so the 3D logo reads cleanly
    float centerDim = smoothstep(radius * 0.3, radius * 0.5, dist);

    for (int i = 0; i < 20; i++) {
      float fi = float(i) + 1.0;

      float c  = cos(fi); float s  = sin(fi);
      mat2 R   = mat2(c,  -s,  s,  c);

      float c2 = cos(fi + 33.0); float s2 = sin(fi + 33.0);
      mat2 R2  = mat2(c2, -s2, s2, c2);

      vec2 coord     = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
      vec2 frac_coord = fract(coord * R2) - 0.5;
      p = R * frac_coord;
      vec2 clamped_p  = clamp(p, -b, b);

      float len = length(clamped_p - p);
      if (len > 0.0) {
        vec4 star = 1e-3 / len * (cos(p.y / 0.1 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
        O += star;
      }
    }

    // Tint slightly blue to match the site palette
    O.rgb = mix(O.rgb, vec3(0.15, 0.35, 1.0), 0.18);

    // Dim the dead center so the spinning logo is the focal point
    O.rgb = mix(O.rgb * 0.25, O.rgb, centerDim);
  }

  void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
  }
`

export function LightUpShader({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const clock  = new THREE.Clock()

    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true })
    const mesh     = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.iResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)
    onResize()

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    })

    return () => {
      window.removeEventListener('resize', onResize)
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
