"use client"

export type DeviceTier = "low" | "mid" | "high"

/**
 * Detects device capability tier based on hardware signals.
 *
 * LOW  — mobile / integrated GPU / <=4 cores / <=4GB RAM
 *        -> disable WebGL backgrounds, simplify animations, no Lenis
 *
 * MID  — average laptop / 4-8 cores / moderate GPU
 *        -> reduce WebGL canvases, keep hero logo, simplify shaders
 *
 * HIGH — desktop / dedicated GPU / 8+ cores / 8GB+ RAM
 *        -> full experience
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high" // SSR default

  let score = 0

  // ── CPU cores ──────────────────────────────────────────────
  const cores = navigator.hardwareConcurrency || 4
  if (cores >= 8) score += 2
  else if (cores >= 4) score += 1
  // else 0

  // ── Device memory (Chrome/Edge only) ──────────────────────
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (mem !== undefined) {
    if (mem >= 8) score += 2
    else if (mem >= 4) score += 1
    // else 0
  } else {
    // Unknown memory — assume mid-range
    score += 1
  }

  // ── Touch / mobile heuristic ──────────────────────────────
  const isMobile =
    "ontouchstart" in window &&
    /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent)
  if (isMobile) score -= 1

  // ── Screen resolution (high-res = needs more GPU) ─────────
  const pixels = window.screen.width * window.screen.height * (window.devicePixelRatio || 1)
  if (pixels > 6_000_000) score -= 1 // 4K+ display needs more GPU work

  // ── GPU detection via WebGL renderer ──────────────────────
  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension(
        "WEBGL_debug_renderer_info"
      )
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext)
          .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          .toLowerCase()

        // Known weak GPUs
        const weakGPU =
          /intel|mesa|swiftshader|llvmpipe|virtualbox|microsoft basic/i.test(
            renderer
          ) && !/iris xe|iris plus/i.test(renderer)

        // Known strong GPUs
        const strongGPU = /nvidia|radeon|geforce|rtx|gtx|rx\s?\d/i.test(
          renderer
        )

        if (strongGPU) score += 2
        else if (weakGPU) score -= 1
      }
    }
  } catch {
    // WebGL unavailable — conservative
    score -= 1
  }

  // ── Connection quality (slow = likely low-end device) ─────
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
    score -= 1
  }

  // ── Map score → tier ──────────────────────────────────────
  if (score >= 4) return "high"
  if (score >= 2) return "mid"
  return "low"
}
