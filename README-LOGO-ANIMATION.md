# 3D Logo Scroll Animation

A professional React Three Fiber component that creates a Spaceedu-inspired 3D scroll animation for your business logo.

## Features

- **Auto-Centering Logo**: Automatically calculates bounding box and scales your logo to fit perfectly
- **Smooth Scroll Animations**: Three distinct scroll sections with fluid GSAP-interpolated transitions
- **Premium Lighting**: Studio environment with spotlights for metallic, professional look
- **Responsive UI Overlays**: About Us section and Contact button with smooth fade transitions
- **Professional Gradient Background**: Clean business aesthetic instead of space theme

## Installation

Install the required dependencies:

```bash
npm install
```

The following packages have been added to your package.json:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three` - 3D library
- `gsap` - Animation library for smooth interpolation

## Setup

1. **Place your 3D logo file** in the `public` folder as `logo.glb`
   - Supported formats: `.glb` (recommended), `.gltf`
   - The component will automatically center and scale it

2. **Import and use the component**:

```jsx
import LogoScrollAnimation from './LogoScrollAnimation';

function App() {
  return <LogoScrollAnimation />;
}
```

## Animation Sequence

### Section 1 (Scroll 0-33%)
- Logo is large and centered
- Slow continuous Y-axis rotation
- Ideal for initial brand presentation

### Section 2 (Scroll 33-66%)
- Logo slides to the right side
- Scales down to 60% size
- "About Us" text fades in on the left
- Smooth easing with `power2.inOut`

### Section 3 (Scroll 66-100%)
- Logo rotates to 45° profile view
- Moves to background (z: -3)
- Further scales to 40%
- "Let's Connect" section with Contact button appears

## Customization

### Change Background Gradient

Edit line 254 in `LogoScrollAnimation.jsx`:

```jsx
background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
```

### Adjust Animation Timing

Modify the scroll section ranges in the `useFrame` hook (lines 52-92):
- Change `0.33` and `0.66` to different values for faster/slower section transitions

### Lighting Adjustments

Modify the lighting setup (lines 112-130):
- Change `Environment preset` from "studio" to "sunset", "dawn", "night", etc.
- Adjust spotlight positions and intensities
- Add more lights for different effects

### Logo Scaling

Change the viewport percentage in line 42:

```jsx
const scale = (viewport.height * 0.8) / maxDim; // Change 0.8 to adjust size
```

### Animation Easing

The component uses GSAP's easing functions. Available easings:
- `power2.inOut` (current - smooth)
- `power3.inOut` (more aggressive)
- `elastic.out` (bouncy)
- `back.out` (slight overshoot)

Change on lines 67, 68, 72, etc.

## Different Logo File

If your logo has a different name, update line 321:

```jsx
useGLTF.preload('/logo.glb'); // Change filename here
```

And line 21:

```jsx
const { scene } = useGLTF('/logo.glb'); // Change filename here
```

## Troubleshooting

### Logo doesn't appear
- Ensure `logo.glb` is in the `public` folder
- Check browser console for loading errors
- Verify the file is a valid GLB/GLTF file

### Logo is too small/large
- The component auto-scales, but you can adjust the multiplier on line 42
- Check your model's scale in Blender (should be around 1-10 units)

### Scroll doesn't work
- Make sure the component fills the viewport (100vh)
- Check that ScrollControls pages prop is set to 3
- Verify no parent elements have `overflow: hidden`

### Performance issues
- Optimize your 3D model (reduce polygon count)
- Use Draco compression for the GLB file
- Consider using lower quality environment maps

## Model Optimization

For best performance, optimize your logo.glb:

1. **In Blender**:
   - Keep poly count under 10k triangles
   - Use simple materials (PBR Standard)
   - Bake complex materials to textures

2. **Draco Compression**:
   ```bash
   npm install -g gltf-pipeline
   gltf-pipeline -i logo.glb -o logo.glb -d
   ```

3. **Texture Optimization**:
   - Keep textures under 2048x2048
   - Use .jpg for color maps
   - Use .png only for alpha channels

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 15+)
- Mobile: ✅ Responsive (may need performance optimization)

## Credits

- Built with React Three Fiber and Three.js
- Inspired by Spaceedu's scroll animation style
- Uses GSAP for smooth interpolation
