'use client'

import dynamic from 'next/dynamic'

const WebGLShader = dynamic(
  () => import('@/components/ui/web-gl-shader').then((mod) => ({ default: mod.WebGLShader })),
  { ssr: false }
)

export function WebGLShaderBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
      <WebGLShader className="w-full h-full" />
    </div>
  )
}
