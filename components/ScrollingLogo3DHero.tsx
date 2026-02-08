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

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-3xl bg-blue-500/10 animate-pulse" />
    </div>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.5 + i * 0.04,
      duration: 1,
      ease: EASE,
    },
  }),
}

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 1.2,
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

  const line1 = 'Global'
  const line2 = 'Talent World'

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic background with scroll zoom */}
      <motion.div
        className="absolute inset-0 bg-[#060608]"
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

      {/* 3D Ripple Logo — center */}
      <div className="absolute inset-0 z-10">
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
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
            The future of talent
          </span>
        </motion.div>

        {/* Title — letter-by-letter reveal with 3D perspective */}
        <div className="mb-8" style={{ perspective: '1000px' }}>
          {/* Line 1: "Global" */}
          <div className="overflow-hidden mb-2">
            <motion.div
              custom={0}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center"
            >
              {line1.split('').map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-fluid-hero font-bold tracking-tight text-gradient-subtle inline-block"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>
          {/* Line 2: "Talent World" */}
          <div className="overflow-hidden">
            <motion.div
              custom={1}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center gap-[0.3em]"
            >
              {line2.split(' ').map((word, wi) => (
                <span key={`w-${wi}`} className={`inline-flex ${wi > 0 ? 'ml-[0.3em]' : ''}`}>
                  {word.split('').map((char, ci) => (
                    <motion.span
                      key={`l2-${wi}-${ci}`}
                      custom={line1.length + wi * 3 + ci}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-fluid-hero font-bold tracking-tight text-gradient inline-block"
                      style={{ transformOrigin: 'center bottom' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/35 max-w-xl mx-auto font-light leading-relaxed mb-14"
        >
          Where exceptional minds meet extraordinary opportunities.
          <br className="hidden sm:block" />
          Connect globally. Grow endlessly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Trusted by — inline below CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-x-6 gap-y-2"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/15 mr-2">Trusted by</span>
          {['Stripe', 'Vercel', 'Linear', 'Notion'].map((co) => (
            <span key={co} className="text-white/15 text-xs font-medium tracking-wide">{co}</span>
          ))}
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
