# Long Scrolling Page Implementation Guide

This document provides technical guidance for implementing the long scrolling page design for the Beans Coffee Shop website.

## Overview

The long scrolling design creates a continuous, flowing experience where users navigate by scrolling rather than clicking between pages. This approach works well for storytelling and creating an immersive experience.

## Key Technical Approaches

### 1. Section-Based Architecture

Organize the page into distinct sections that flow into each other:

```jsx
// pages/index.js
import Head from 'next/head'
import Layout from '../components/layout/Layout'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Featured from '../components/sections/Featured'
import Menu from '../components/sections/Menu'
import Process from '../components/sections/Process'
import Subscription from '../components/sections/Subscription'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Beans Coffee Shop</title>
        <meta name="description" content="Modern coffee shop with quality brews" />
      </Head>
      
      <main className="overflow-hidden">
        <Hero />
        <About />
        <Featured />
        <Menu />
        <Process />
        <Subscription />
        <Contact />
      </main>
    </Layout>
  )
}
```

### 2. Smooth Scrolling

Enable smooth scrolling between sections:

```css
/* styles/globals.css */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

For more controlled scrolling, use a library like `react-scroll` or implement your own using the `window.scrollTo` method with smooth behavior.

### 3. Intersection Observer for Visibility Detection

Detect when sections enter the viewport to trigger animations or effects:

```jsx
// hooks/useIntersection.js
import { useState, useEffect, useRef } from 'react'

export default function useIntersection(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, {
      root: null,
      threshold: 0.1,
      ...options
    })
    
    const currentRef = ref.current
    
    if (currentRef) {
      observer.observe(currentRef)
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options])
  
  return [ref, isVisible]
}
```

Using the hook in a section component:

```jsx
// components/sections/About.jsx
import { motion } from 'framer-motion'
import useIntersection from '../../hooks/useIntersection'

export default function About() {
  const [ref, isVisible] = useIntersection({ threshold: 0.2 })
  
  return (
    <section id="about" className="min-h-screen py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-10">Our Story</h2>
          {/* Section content */}
        </motion.div>
      </div>
    </section>
  )
}
```

### 4. Parallax Scrolling Effects

Create depth and visual interest with parallax effects:

```jsx
// hooks/useScrollPosition.js
import { useState, useEffect } from 'react'

export default function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return scrollPosition
}
```

Using the hook for a parallax effect:

```jsx
// components/sections/Hero.jsx
import useScrollPosition from '../../hooks/useScrollPosition'

export default function Hero() {
  const scrollPosition = useScrollPosition()
  
  return (
    <section className="h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-bg.jpg')",
          transform: `translateY(${scrollPosition * 0.5}px)`
        }}
      />
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Beans Coffee Shop</h1>
          <p className="text-xl mb-8">Crafting the perfect brew since 2023</p>
          <button className="bg-primary px-8 py-3 rounded-full text-lg font-medium">
            Explore Menu
          </button>
        </div>
      </div>
    </section>
  )
}
```

### 5. Sticky Navigation

Create a navigation bar that sticks to the top and highlights the current section:

```jsx
// components/layout/Navigation.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Process', href: '#process' },
  { label: 'Subscribe', href: '#subscription' },
  { label: 'Contact', href: '#contact' }
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      // Set navbar background when scrolled
      setIsScrolled(window.scrollY > 50)
      
      // Find the current section
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(`#${section.id}`)
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md text-dark' : 'bg-transparent text-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl font-bold">Beans</div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition-colors ${activeSection === item.href ? 'text-primary' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            {/* Implement mobile menu toggle */}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 6. Progress Indicator

Add a visual scroll progress indicator:

```jsx
// components/layout/ScrollProgress.jsx
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollProgress = (scrollPosition / totalHeight) * 100
      setProgress(scrollProgress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-primary transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

### 7. Performance Optimization

Long scrolling pages can have performance implications. Implement these techniques:

```jsx
// Lazy loading images
import Image from 'next/image'

<Image 
  src="/images/coffee-product.jpg"
  alt="Coffee Product"
  width={500}
  height={300}
  loading="lazy"
/>

// Component lazy loading
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

### 8. Mobile Responsiveness

Ensure the long scrolling experience works well on mobile:

```jsx
// Responsive section heights
<section className="min-h-screen md:h-screen py-16 md:py-0">
  {/* Content */}
</section>

// Responsive typography
<h1 className="text-4xl md:text-6xl font-bold">Beans Coffee</h1>
```

## Reserved Space for Three.js Integration

When implementing Three.js for visual elements, consider these integration points:

### Canvas Integration

Create a component for Three.js canvas that can be used in your sections:

```jsx
// components/three/ThreeCanvas.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeCanvas() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    // This will be implemented by you later
    // Basic Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    
    // ... your Three.js implementation
    
    return () => {
      // Cleanup
    }
  }, [])
  
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}
```

Add this canvas to a section or as a background element:

```jsx
// components/sections/Hero.jsx
import ThreeCanvas from '../three/ThreeCanvas'

export default function Hero() {
  return (
    <section className="h-screen relative">
      <ThreeCanvas />
      <div className="relative z-10">
        {/* Content */}
      </div>
    </section>
  )
}
```

## Testing the Scrolling Experience

To ensure a good user experience, test these aspects:

1. **Scroll Performance**: Monitor frame rate during scrolling
2. **Section Transitions**: Ensure smooth transitions between sections
3. **Animation Triggers**: Verify animations trigger at the right scroll positions
4. **Mobile Experience**: Test on various device sizes
5. **Accessibility**: Ensure the page is navigable with keyboard and screen readers

Use the browser's performance tools to identify and fix any performance bottlenecks in the scrolling experience. 