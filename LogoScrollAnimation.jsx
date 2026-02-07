import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ScrollControls, useScroll, Environment, Center } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Logo component with auto-centering and scroll animations
function Logo({ scrollData }) {
  const logoRef = useRef();
  const { scene } = useGLTF('/logo.glb');
  const [bbox, setBbox] = useState(null);
  const { viewport } = useThree();

  // Calculate bounding box for auto-centering and scaling
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Calculate scale to fit viewport (80% of viewport height)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = (viewport.height * 0.8) / maxDim;

      setBbox({ size, center, scale });
    }
  }, [scene, viewport]);

  useFrame((state) => {
    if (!logoRef.current || !scrollData) return;

    const scroll = scrollData.offset; // 0 to 1

    // Section 1: 0 to 0.33 - Initial centered state with slow spin
    // Section 2: 0.33 to 0.66 - Move to right and shrink
    // Section 3: 0.66 to 1.0 - Rotate to profile view and recede

    if (scroll < 0.33) {
      // Section 1: Large, centered, spinning
      const t = scroll / 0.33; // Normalize to 0-1 within section

      logoRef.current.position.x = gsap.utils.interpolate(0, 0, t);
      logoRef.current.position.y = gsap.utils.interpolate(0, 0, t);
      logoRef.current.position.z = gsap.utils.interpolate(0, 0, t);
      logoRef.current.rotation.y = state.clock.elapsedTime * 0.3; // Slow spin
      logoRef.current.rotation.x = 0;
      logoRef.current.scale.setScalar(gsap.utils.interpolate(1, 1, t));

    } else if (scroll < 0.66) {
      // Section 2: Slide right, shrink for About Us text
      const t = (scroll - 0.33) / 0.33;

      logoRef.current.position.x = gsap.utils.interpolate(0, viewport.width * 0.3, gsap.parseEase("power2.inOut")(t));
      logoRef.current.position.y = gsap.utils.interpolate(0, viewport.height * 0.1, gsap.parseEase("power2.inOut")(t));
      logoRef.current.position.z = gsap.utils.interpolate(0, -1, gsap.parseEase("power2.inOut")(t));
      logoRef.current.rotation.y = gsap.utils.interpolate(
        state.clock.elapsedTime * 0.3,
        Math.PI * 0.5,
        gsap.parseEase("power2.inOut")(t)
      );
      logoRef.current.scale.setScalar(gsap.utils.interpolate(1, 0.6, gsap.parseEase("power2.inOut")(t)));

    } else {
      // Section 3: Rotate to 45° profile, move to background
      const t = (scroll - 0.66) / 0.34;

      logoRef.current.position.x = gsap.utils.interpolate(
        viewport.width * 0.3,
        viewport.width * 0.25,
        gsap.parseEase("power2.inOut")(t)
      );
      logoRef.current.position.y = gsap.utils.interpolate(
        viewport.height * 0.1,
        -viewport.height * 0.2,
        gsap.parseEase("power2.inOut")(t)
      );
      logoRef.current.position.z = gsap.utils.interpolate(-1, -3, gsap.parseEase("power2.inOut")(t));
      logoRef.current.rotation.y = gsap.utils.interpolate(
        Math.PI * 0.5,
        Math.PI * 0.75,
        gsap.parseEase("power2.inOut")(t)
      );
      logoRef.current.rotation.x = gsap.utils.interpolate(
        0,
        -Math.PI * 0.15,
        gsap.parseEase("power2.inOut")(t)
      );
      logoRef.current.scale.setScalar(gsap.utils.interpolate(0.6, 0.4, gsap.parseEase("power2.inOut")(t)));
    }
  });

  if (!bbox) return null;

  return (
    <Center>
      <primitive
        ref={logoRef}
        object={scene}
        scale={bbox.scale}
      />
    </Center>
  );
}

// Scene component
function Scene() {
  const scroll = useScroll();

  return (
    <>
      {/* Premium lighting setup */}
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
      />
      <pointLight position={[0, 5, 5]} intensity={0.5} />

      {/* Logo with scroll data */}
      <Logo scrollData={scroll} />
    </>
  );
}

// UI Overlays
function UIOverlay({ scrollProgress }) {
  return (
    <>
      {/* About Us Section - Appears in section 2 */}
      <div
        className="about-section"
        style={{
          position: 'absolute',
          left: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '40%',
          opacity: scrollProgress > 0.33 && scrollProgress < 0.66
            ? Math.min((scrollProgress - 0.33) / 0.1, 1)
            : scrollProgress >= 0.66
            ? Math.max(1 - (scrollProgress - 0.66) / 0.1, 0)
            : 0,
          transition: 'opacity 0.3s ease',
          color: '#ffffff',
          pointerEvents: scrollProgress > 0.33 && scrollProgress < 0.66 ? 'auto' : 'none',
        }}
      >
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          About Us
        </h2>
        <p style={{
          fontSize: '1.2rem',
          lineHeight: '1.8',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          We are a forward-thinking company dedicated to innovation and excellence.
          Our mission is to deliver exceptional solutions that transform businesses
          and create lasting value for our clients.
        </p>
      </div>

      {/* Contact Section - Appears in section 3 */}
      <div
        className="contact-section"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: scrollProgress >= 0.66 ? Math.min((scrollProgress - 0.66) / 0.1, 1) : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: scrollProgress >= 0.66 ? 'auto' : 'none',
        }}
      >
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '2rem',
          color: '#ffffff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Let's Connect
        </h2>
        <button
          style={{
            padding: '1.2rem 3rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
          }}
          onClick={() => alert('Contact form would open here')}
        >
          Contact Us
        </button>
      </div>

      {/* Fixed Contact Button (always visible) */}
      <button
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#ffffff',
          background: 'rgba(102, 126, 234, 0.9)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(118, 75, 162, 0.9)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(102, 126, 234, 0.9)';
          e.target.style.transform = 'translateY(0)';
        }}
        onClick={() => alert('Contact form would open here')}
      >
        Get in Touch
      </button>

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff',
          fontSize: '0.9rem',
          opacity: scrollProgress < 0.1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>Scroll to explore</div>
        <div style={{
          width: '2px',
          height: '30px',
          background: 'rgba(255, 255, 255, 0.5)',
          margin: '0 auto',
          animation: 'scroll-bounce 2s infinite'
        }} />
      </div>
    </>
  );
}

// Main component
export default function LogoScrollAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.5; }
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>

      {/* Professional gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          zIndex: -1,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ScrollControls pages={3} damping={0.2}>
          <Scene />
        </ScrollControls>
      </Canvas>

      <UIOverlay scrollProgress={scrollProgress} />

      {/* Scroll listener for UI updates */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '300vh',
          pointerEvents: 'none',
        }}
        onScroll={(e) => {
          const progress = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
          setScrollProgress(progress);
        }}
      />
    </div>
  );
}

// Preload the logo model
useGLTF.preload('/logo.glb');
