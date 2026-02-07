'use client'

import dynamic from 'next/dynamic'

const LogoScrollAnimation = dynamic(() => import('../../LogoScrollAnimation'), {
  ssr: false,
})

export default function LogoTestPage() {
  return <LogoScrollAnimation />
}
