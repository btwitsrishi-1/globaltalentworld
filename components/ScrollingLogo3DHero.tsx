'use client'

import React, { Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RippleLogo3D = dynamic(
  () => import('@/components/ui/ripple-logo-3d').then(mod => ({ default: mod.RippleLogo3D })),
  { ssr: false }
)

const FloatingElements = dynamic(
  () => import('@/components/ui/floating-elements').then(mod => ({ default: mod.FloatingElements })),
  { ssr: false }
)

const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-lines').then(mod => ({ default: mod.ShaderAnimation })),
  { ssr: false }
)

const GodRays = dynamic(
  () => import('@paper-design/shaders-react').then(mod => ({ default: mod.GodRays })),
  { ssr: false }
)

const LiveTicker = dynamic(
  () => import('@/components/ui/live-ticker').then(mod => ({ default: mod.LiveTicker })),
  { ssr: false }
)

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-3xl bg-blue-500/10 animate-pulse" />
    </div>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 1,
      ease: EASE,
    },
  }),
}

export function ScrollingLogo3DHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Shader lines — deepest background layer */}
      <div className="absolute inset-0 z-0 opacity-30">
        <ShaderAnimation />
      </div>

      {/* Cinematic background overlay with scroll zoom */}
      <motion.div
        className="absolute inset-0 bg-[#060608]/40"
        style={{ scale: bgScale }}
      />

      {/* Layered radial gradients — depth effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(6,182,212,0.04),transparent_40%)]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Animated gradient orb — slow drift */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating 3D elements — background */}
      <Suspense fallback={null}>
        <FloatingElements className="absolute inset-0 z-0 opacity-50" />
      </Suspense>

      {/* God rays — atmospheric light streaks */}
      <div className="absolute inset-0 z-[2] opacity-40 pointer-events-none">
        <Suspense fallback={null}>
          <GodRays
            colorBack="#00000000"
            colors={["#3b82f640", "#10b98140", "#60a5fa30", "#06b6d430"]}
            colorBloom="#3b82f6"
            offsetX={0.85}
            offsetY={-1}
            intensity={0.5}
            spotty={0.45}
            midSize={10}
            midIntensity={0}
            density={0.38}
            bloom={0.3}
            speed={0.5}
            scale={1.6}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </Suspense>
      </div>

      {/* 3D Ripple Logo — center hero */}
      <div className="absolute inset-0 z-10" style={{ filter: 'drop-shadow(0 0 60px rgba(59,130,246,0.35)) drop-shadow(0 0 120px rgba(59,130,246,0.15))' }}>
        <Suspense fallback={<HeroFallback />}>
          <RippleLogo3D className="w-full h-full" />
        </Suspense>
      </div>

      {/* Hero Content with scroll parallax */}
      <motion.div
        className="relative z-20 text-center max-w-6xl mx-auto px-6"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
            The future of talent
          </span>
        </motion.div>

        {/* Title — slide-up reveal */}
        <div className="mb-8">
          <motion.div
            custom={0.4}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="mb-2"
          >
            <span className="text-fluid-hero font-display font-bold tracking-tight text-gradient-subtle block">
              Global
            </span>
          </motion.div>
          <motion.div
            custom={0.6}
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <span className="text-fluid-hero font-display font-bold tracking-tight text-gradient block">
              Talent World
            </span>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="text-base sm:text-lg md:text-xl text-white/50 max-w-xl mx-auto font-light leading-relaxed mb-14"
        >
          Where exceptional minds meet extraordinary opportunities.
          <br className="hidden sm:block" />
          Connect globally. Grow endlessly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/signup"
            className="btn-embossed-primary group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white text-sm font-medium rounded-full"
          >
            Join Now
            <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </Link>
          <Link
            href="/careers"
            className="btn-embossed-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white/60 text-sm font-medium rounded-full border border-white/[0.08] hover:text-white/80"
          >
            Explore Careers
          </Link>
        </motion.div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-10 flex justify-center"
        >
          <LiveTicker />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/15">Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 text-white/15" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060608] to-transparent z-20 pointer-events-none" />

      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#060608]/50 to-transparent z-20 pointer-events-none" />
    </section>
  )
}
