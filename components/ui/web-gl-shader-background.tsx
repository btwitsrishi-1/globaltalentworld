'use client'

import dynamic from 'next/dynamic'
import { useVisible } from '@/hooks/use-visible'
import { useDeviceConfig } from '@/lib/device-context'

const WebGLShader = dynamic(
  () => import('@/components/ui/web-gl-shader').then((mod) => ({ default: mod.WebGLShader })),
  { ssr: false }
)

export function WebGLShaderBackground() {
  const { ref, visible } = useVisible()
  const { enableWebGLShaderBg } = useDeviceConfig()

  if (!enableWebGLShaderBg) return null

  return (
    <div ref={ref} className="absolute inset-0 z-0 pointer-events-none opacity-30">
      {visible && <WebGLShader className="w-full h-full" />}
    </div>
  )
}
