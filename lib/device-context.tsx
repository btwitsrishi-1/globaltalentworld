"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { detectDeviceTier, type DeviceTier } from "@/hooks/use-device-tier"

/**
 * Per-tier performance configuration.
 * Components read these flags instead of hard-coding behaviour.
 */
export interface DeviceConfig {
  tier: DeviceTier

  // WebGL canvases
  enableShaderBackground: boolean  // shader-lines behind hero
  enableFloatingElements: boolean  // 8 floating wireframe shapes
  enableGodRays: boolean           // atmospheric light rays
  enableRippleLogo: boolean        // 3D ripple logo (hero center)
  enableNavbarLogo3D: boolean      // spinning 3D logo in navbar
  enableWebGLShaderBg: boolean     // below-fold WebGL shader section

  // Animation fidelity
  enableLenisSmooth: boolean       // Lenis smooth scroll RAF loop
  enableMarquee: boolean           // testimonial marquee scroll
  enable3DTilt: boolean            // 3D tilt on feature cards
  enablePageTransition: boolean    // clipPath circle reveal

  // Rendering quality
  maxDpr: number                   // max device pixel ratio for canvases
  floatingShapeCount: number       // how many shapes to render (0-8)
}

const CONFIGS: Record<DeviceTier, DeviceConfig> = {
  low: {
    tier: "low",
    enableShaderBackground: false,
    enableFloatingElements: false,
    enableGodRays: false,
    enableRippleLogo: true,       // keep the hero centerpiece
    enableNavbarLogo3D: false,    // replace with CSS logo
    enableWebGLShaderBg: false,
    enableLenisSmooth: false,
    enableMarquee: false,         // static cards instead
    enable3DTilt: false,
    enablePageTransition: false,  // simple fade only
    maxDpr: 1,
    floatingShapeCount: 0,
  },
  mid: {
    tier: "mid",
    enableShaderBackground: false, // drop background shader
    enableFloatingElements: true,
    enableGodRays: true,
    enableRippleLogo: true,
    enableNavbarLogo3D: false,    // still too expensive for 32px
    enableWebGLShaderBg: false,
    enableLenisSmooth: true,
    enableMarquee: true,
    enable3DTilt: true,
    enablePageTransition: true,
    maxDpr: 1.5,
    floatingShapeCount: 4,        // half the shapes
  },
  high: {
    tier: "high",
    enableShaderBackground: true,
    enableFloatingElements: true,
    enableGodRays: true,
    enableRippleLogo: true,
    enableNavbarLogo3D: true,
    enableWebGLShaderBg: true,
    enableLenisSmooth: true,
    enableMarquee: true,
    enable3DTilt: true,
    enablePageTransition: true,
    maxDpr: 2,
    floatingShapeCount: 8,
  },
}

const DeviceContext = createContext<DeviceConfig>(CONFIGS.high)

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DeviceConfig>(CONFIGS.high)

  useEffect(() => {
    const tier = detectDeviceTier()
    setConfig(CONFIGS[tier])

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[DeviceTier] ${tier.toUpperCase()}`,
        `color: ${tier === "high" ? "#10b981" : tier === "mid" ? "#f59e0b" : "#ef4444"}; font-weight: bold;`,
        CONFIGS[tier]
      )
    }
  }, [])

  return (
    <DeviceContext.Provider value={config}>{children}</DeviceContext.Provider>
  )
}

export function useDeviceConfig(): DeviceConfig {
  return useContext(DeviceContext)
}
