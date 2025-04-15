 # Three.js Integration Guide

This document outlines potential integration points and implementation strategies for adding Three.js 3D visualizations to the Beans Coffee Shop website.

## Overview

Three.js can be used to create immersive, interactive 3D elements that enhance the user experience on the long scrolling page. This guide provides suggestions for where and how to implement Three.js features, while leaving the specific creative implementations to you.

## Integration Points

### 1. Hero Section Background

**Implementation Idea:** Create an ambient, animated 3D scene as the background for the hero section.

**Suggested Approach:**
- Full-screen Three.js canvas positioned as background with z-index below content
- Low-polygon stylized coffee beans, cup, or steam elements
- Subtle camera movements responding to scroll or mouse position
- Color palette matching the site's branding

**Code Structure:**
```jsx
// components/three/HeroBackground.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroBackground() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    // Canvas setup
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Scene setup
    const scene = new THREE.Scene()
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    
    // Your custom 3D objects will go here
    // For example:
    // - Floating coffee beans
    // - Animated steam particles
    // - Coffee cup with ripple effect
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Update animations here
      // Example: rotate coffee beans, animate steam particles
      
      renderer.render(scene, camera)
    }
    animate()
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Optional: Parallax effect on mouse move
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      
      // Adjust camera or scene objects based on mouse position
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      // Dispose of Three.js resources
    }
  }, [])
  
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}
```

**Integration in Hero Section:**
```jsx
// components/sections/Hero.jsx
import HeroBackground from '../three/HeroBackground'

export default function Hero() {
  return (
    <section id="hero" className="h-screen relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 h-full flex items-center justify-center">
        {/* Hero content */}
      </div>
    </section>
  )
}
```

### 2. Coffee Bean Transformation

**Implementation Idea:** Create an interactive 3D model showing the transformation of coffee beans through the production process.

**Suggested Approach:**
- Interactive 3D model of coffee beans that transform as the user scrolls
- Stages: Green bean → Roasted bean → Ground coffee → Brewed coffee
- Color and shape changes based on scroll position or user interaction
- Optional particle effects for roasting process

**Code Structure:**
```jsx
// components/three/BeanTransformation.jsx
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useScrollPosition from '../../hooks/useScrollPosition'

export default function BeanTransformation() {
  const canvasRef = useRef(null)
  const [transformationStage, setTransformationStage] = useState(0)
  const scrollPosition = useScrollPosition()
  
  useEffect(() => {
    // Similar Three.js setup as before
    
    // Load 3D models
    const loader = new GLTFLoader()
    
    // You can either load different models for each stage
    // or modify materials/geometry of a single model
    
    // Example approach:
    // 1. Load base coffee bean model
    // 2. Create different materials for each stage
    // 3. Switch materials based on transformation stage
    
    // Track scroll position to determine transformation stage
    const processSectionElement = document.getElementById('process')
    const processSectionTop = processSectionElement?.offsetTop || 0
    const processSectionHeight = processSectionElement?.offsetHeight || 0
    
    // Update stage based on scroll position
    if (scrollPosition > processSectionTop) {
      const scrollPercentage = (scrollPosition - processSectionTop) / processSectionHeight
      
      if (scrollPercentage < 0.25) {
        setTransformationStage(0) // Green bean
      } else if (scrollPercentage < 0.5) {
        setTransformationStage(1) // Roasted bean
      } else if (scrollPercentage < 0.75) {
        setTransformationStage(2) // Ground coffee
      } else {
        setTransformationStage(3) // Brewed coffee
      }
    }
    
    // Update 3D model based on transformation stage
    // This will depend on your specific implementation
    
  }, [scrollPosition, transformationStage])
  
  return <canvas ref={canvasRef} className="w-full h-full" />
}
```

**Integration in Process Section:**
```jsx
// components/sections/Process.jsx
import BeanTransformation from '../three/BeanTransformation'

export default function Process() {
  return (
    <section id="process" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10">From Bean to Cup</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-[400px] relative">
            <BeanTransformation />
          </div>
          
          <div>
            {/* Process description content */}
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 3. Interactive Coffee Cup Customizer

**Implementation Idea:** Allow users to visualize their coffee choices with a 3D cup that changes based on selected options.

**Suggested Approach:**
- 3D model of coffee cup that changes appearance based on selections
- Liquid level, color changes based on coffee type
- Add-ins visualization (cream, milk, sugar)
- Steam particles adjusting based on temperature selection
- Cup size changes

**Code Structure:**
```jsx
// components/three/CoffeeCustomizer.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function CoffeeCustomizer({ 
  coffeeType = 'espresso',
  temperature = 'hot',
  additions = [],
  size = 'medium'
}) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    // Three.js setup as in previous examples
    
    // Load coffee cup model
    
    // Apply changes based on props
    // - coffeeType affects liquid color
    // - temperature affects steam particles
    // - additions add visual elements
    // - size changes cup scale
    
    // Add interactive controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 3
    controls.maxDistance = 8
    
    // Animate with controls update
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
    
    return () => {
      controls.dispose()
      // Other cleanup
    }
  }, [coffeeType, temperature, additions, size])
  
  return <canvas ref={canvasRef} className="w-full h-full" />
}
```

**Integration in Menu Section:**
```jsx
// components/sections/Menu.jsx
import { useState } from 'react'
import CoffeeCustomizer from '../three/CoffeeCustomizer'

export default function Menu() {
  const [coffeeType, setCoffeeType] = useState('espresso')
  const [temperature, setTemperature] = useState('hot')
  const [additions, setAdditions] = useState([])
  const [size, setSize] = useState('medium')
  
  return (
    <section id="menu" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10">Our Menu</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-[500px] bg-white rounded-lg shadow-lg p-4">
            <CoffeeCustomizer 
              coffeeType={coffeeType}
              temperature={temperature}
              additions={additions}
              size={size}
            />
          </div>
          
          <div>
            {/* Coffee selection controls */}
            {/* Type, temperature, additions, size selectors */}
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Performance Considerations

When implementing Three.js, keep these performance tips in mind:

1. **Optimize 3D Models:**
   - Use low-poly models when possible
   - Compress textures to appropriate sizes
   - Use Level of Detail (LOD) for complex models

2. **Render Management:**
   - Only render when in viewport
   - Reduce animation complexity on mobile
   - Use `requestAnimationFrame` for smooth animations

3. **Loading Strategy:**
   - Implement a loading screen or progressive loading
   - Load 3D assets asynchronously
   - Consider using compressed formats like DRACO or GLTF

4. **Memory Management:**
   - Dispose of unused geometries, materials, and textures
   - Clean up event listeners and animations on component unmount
   - Use object pooling for particle effects

## Implementation Example for Long Scrolling

Here's a strategy for integrating Three.js with the long scrolling design:

```jsx
// hooks/useThreeJsScroll.js
import { useEffect, useState } from 'react'

export default function useThreeJsScroll(targetRef) {
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return
      
      const rect = targetRef.current.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      
      // Calculate how far through the section we've scrolled
      // 0 = just entering, 1 = just leaving
      let progress = 0
      
      if (sectionTop <= 0 && sectionTop >= -sectionHeight + viewportHeight) {
        progress = Math.abs(sectionTop) / (sectionHeight - viewportHeight)
      } else if (sectionTop > 0) {
        progress = 0
      } else {
        progress = 1
      }
      
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])
  
  return scrollProgress
}
```

Using this hook to animate Three.js elements based on scroll:

```jsx
// components/sections/About.jsx
import { useRef } from 'react'
import useThreeJsScroll from '../../hooks/useThreeJsScroll'
import GlobeVisualization from '../three/GlobeVisualization'

export default function About() {
  const sectionRef = useRef(null)
  const scrollProgress = useThreeJsScroll(sectionRef)
  
  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-20">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl font-bold mb-10">Our Story</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {/* About content */}
          </div>
          
          <div className="h-[400px] relative">
            <GlobeVisualization scrollProgress={scrollProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Mobile Considerations

For mobile devices, consider these adjustments:

1. **Reduced Complexity:**
   - Fewer particles
   - Simpler geometries
   - Lower resolution textures

2. **Alternative Views:**
   - Provide static images as fallbacks when needed
   - Consider disabling some effects on low-end devices
   - Use device detection to adjust complexity

3. **Touch Interaction:**
   - Replace hover effects with touch events
   - Ensure 3D controls work with touch gestures
   - Make interactive elements larger for touch targets

## Next Steps for Implementation

1. **Set Up Environment:**
   - Install Three.js and related packages:
     ```
     npm install three @react-three/fiber @react-three/drei
     ```

2. **Create Base Components:**
   - Set up reusable Three.js canvas components
   - Create scroll-reactive hooks for animation control

3. **Model Preparation:**
   - Prepare or source 3D models for coffee beans, cups, etc.
   - Optimize models for web (reduce polygon count, compress textures)

4. **Progressive Integration:**
   - Start with one section (e.g., hero background)
   - Test performance and user experience
   - Add additional 3D elements as you refine the implementation

5. **Performance Testing:**
   - Test on various devices and browsers
   - Optimize based on performance measurements
   - Consider fallbacks for older browsers

## Conclusion

This guide provides a starting point for implementing Three.js in your coffee shop website. The specific creative implementation is left to you, allowing for artistic freedom while maintaining the technical structure needed for a smooth user experience.

Remember that 3D elements should enhance the user experience without overwhelming it—subtle, thoughtful implementations will create the most impressive results.