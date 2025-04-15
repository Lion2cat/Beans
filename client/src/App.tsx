import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import FeaturedProducts from './components/sections/FeaturedProducts'
import VineyardMap from './components/pages/VineyardMap'
import MapPage from './pages/MapPage'
import TransitionManager from './components/transitions/TransitionManager'

// Create wrapper components with smooth transitions
const SectionWrapper = ({ children, id }: { children: React.ReactNode, id: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [fullVisibility, setFullVisibility] = useState(false)
  const [prevSection, setPrevSection] = useState<string | null>(null)
  const [nextSection, setNextSection] = useState<string | null>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section comes into view
        if (entry.isIntersecting) {
          setIsVisible(true)
          setIsInView(true)
          
          // Allow a small delay before triggering full visibility for animations
          setTimeout(() => {
            setFullVisibility(true)
          }, 300)
        } else {
          setIsInView(false)
          if (entry.boundingClientRect.top > 0) {
            // Only reset full visibility when scrolling up past the section
            setFullVisibility(false)
          }
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.7, 1]
      }
    )
    
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how far the section is through the viewport
      // From -1 (completely below viewport) to 1 (completely above viewport)
      // 0 means the section is centered in viewport
      const viewportProgress = 1 - (rect.top + rect.height/2) / (windowHeight/2)
      setScrollProgress(Math.max(-1, Math.min(1, viewportProgress)))

      // Determine which sections are adjacent to this one
      const allSections = Array.from(document.querySelectorAll('.section-container'))
      const currentIndex = allSections.findIndex(section => section === sectionRef.current)
      
      if (currentIndex > 0) {
        setPrevSection(allSections[currentIndex - 1].id)
      }
      
      if (currentIndex < allSections.length - 1) {
        setNextSection(allSections[currentIndex + 1].id)
      }
    }
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initialize on mount
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Connector styles based on sections
  const getConnectorStyles = (): React.CSSProperties => {
    // Special connector between map and products
    if ((id === 'map-section' && nextSection === 'products-section') || 
        (id === 'products-section' && prevSection === 'map-section')) {
      return {
        position: 'absolute',
        height: '120px',
        width: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage: id === 'map-section' ? 
          'linear-gradient(to bottom, #FBF7F3, #f7f5f3)' : 
          'linear-gradient(to top, #f7f5f3, #FBF7F3)',
        ...(id === 'map-section' ? { bottom: '-60px' } : { top: '-60px' }),
        opacity: isInView ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }
    }
    return {}
  }
  
  return (
    <div 
      ref={sectionRef}
      id={id}
      className={`section-container ${isVisible ? 'visible' : ''} ${isInView ? 'in-view' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 40}px) scale(${isVisible ? 1 : 0.98})`,
        transition: 'opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
        willChange: 'opacity, transform',
        position: 'relative',
        zIndex: 2,
        // Apply subtle parallax effect based on scroll progress with proper typing
        ...(scrollProgress !== 0 && { 
          ['--scroll-progress' as string]: scrollProgress 
        }),
        ...(fullVisibility && id === 'products-section' && {
          ['--reveal-products' as string]: 1
        }),
        ...(fullVisibility && id === 'map-section' && {
          ['--reveal-map' as string]: 1
        }),
      }}
      data-scroll-progress={scrollProgress.toFixed(2)}
    >
      {/* Visual connector between sections */}
      {(id === 'map-section' || id === 'products-section') && (
        <div style={getConnectorStyles()}>
          {/* Create decorative beans element for map-to-products transition */}
          {id === 'map-section' && nextSection === 'products-section' && (
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              width: '100px',
              height: '50px',
              background: 'url("/images/coffee-beans-divider.png") no-repeat center center',
              backgroundSize: 'contain',
              opacity: scrollProgress > 0.7 ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }} />
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Create basic page components with smooth transitions
const Home = () => {
  useEffect(() => {
    // Add smooth scroll behavior to body
    document.body.style.scrollBehavior = 'smooth'
    
    // Add styles for section-container
    const style = document.createElement('style')
    style.textContent = `
      .section-container {
        position: relative;
        overflow: hidden;
        transition: transform 0.5s ease-out;
      }
      
      .section-container.in-view {
        z-index: 5;
      }
      
      .section-container::after {
        content: '';
        position: 'absolute';
        width: '100%';
        height: '50px';
        bottom: 0;
        left: 0;
        pointer-events: none;
      }
      
      /* Smooth scroll for section links */
      a[href^="#"] {
        scroll-behavior: smooth;
        cursor: pointer;
      }
      
      /* Create a smooth motion effect between sections */
      html {
        scroll-behavior: smooth;
      }
      
      /* Special transitions between sections */
      #map-section + #products-section {
        margin-top: -60px; /* Negative margin creates overlap */
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.body.style.scrollBehavior = ''
      document.head.removeChild(style)
    }
  }, [])
  
  return (
    <div className="home-page">
      <Header />
      
      <SectionWrapper id="hero-section">
        <Hero />
      </SectionWrapper>
      
      <SectionWrapper id="map-section">
        <MapPage />
      </SectionWrapper>
      
      <SectionWrapper id="products-section">
        <FeaturedProducts />
      </SectionWrapper>
      
      {/* Global transition manager */}
      <TransitionManager />
    </div>
  )
}

const About = () => <div>About Page</div>
const Products = () => <div>Products Page</div>
const ProductDetail = () => <div>Product Detail Page</div>
const Cart = () => <div>Cart Page</div>
const Checkout = () => <div>Checkout Page</div>
const Contact = () => <div>Contact Page</div>
const NotFound = () => <div>Page Not Found</div>

function App() {
  // 保存Three.js场景的引用
  const canvasRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // 保存滚动位置和鼠标位置
  const scrollPosRef = useRef(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  
  // 当前活跃部分
  const [activeSection, setActiveSection] = useState('hero')
  
  // 初始化Three.js场景
  useEffect(() => {
    if (!canvasRef.current) return

    // 创建场景
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    camera.position.z = 20
    cameraRef.current = camera

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    canvasRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 创建颗粒效果
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCnt = 3500 // Increased particle count for more immersive effect
    const posArray = new Float32Array(particlesCnt * 3)
    
    // 生成分布在三维空间中的粒子
    for (let i = 0; i < particlesCnt * 3; i += 3) {
      // 创建更广泛的分布模式
      posArray[i] = (Math.random() - 0.5) * 100     // x - wider spread
      posArray[i + 1] = (Math.random() - 0.5) * 100 // y - wider spread
      posArray[i + 2] = (Math.random() - 0.5) * 80  // z
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    // 创建粒子材质
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color('#a05c4a'),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
    
    // 创建粒子系统
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // 处理滚动事件
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(1, scrollPosition / maxScroll)
      
      scrollPosRef.current = progress
      
      // 根据滚动位置设置活跃部分
      const heroSection = document.getElementById('hero-section')
      const mapSection = document.getElementById('map-section')
      const productsSection = document.getElementById('products-section')
      
      if (heroSection && mapSection && productsSection) {
        const heroRect = heroSection.getBoundingClientRect()
        const mapRect = mapSection.getBoundingClientRect()
        const productsRect = productsSection.getBoundingClientRect()
        
        const viewportHeight = window.innerHeight
        
        if (heroRect.top <= 0 && heroRect.bottom >= viewportHeight / 3) {
          setActiveSection('hero')
        } else if (mapRect.top <= viewportHeight / 3 && mapRect.bottom >= viewportHeight / 3) {
          setActiveSection('map')
        } else if (productsRect.top <= viewportHeight / 3) {
          setActiveSection('featured')
        }
      }
    }
    
    // 处理鼠标移动事件，用于视差效果
    const handleMouseMove = (e: MouseEvent) => {
      // 将鼠标位置规格化到 -0.5 到 0.5 之间
      setMouseX((e.clientX / window.innerWidth) - 0.5)
      setMouseY((e.clientY / window.innerHeight) - 0.5)
    }

    // 动画循环
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return
      
      // 根据滚动位置为粒子动画设置速度
      const scrollSpeed = scrollPosRef.current * 0.3 // Increased for more dynamic movement
      
      // 不同部分呈现不同的动画效果 - smoother transitions between sections
      if (activeSection === 'hero') {
        particlesRef.current.rotation.y += 0.0007 + scrollSpeed * 0.004
        particlesRef.current.rotation.x += 0.0003 + scrollSpeed * 0.002
      } else if (activeSection === 'map') {
        particlesRef.current.rotation.y += 0.001 + scrollSpeed * 0.004
        particlesRef.current.rotation.z += 0.0003 + scrollSpeed * 0.002
      } else if (activeSection === 'featured') {
        particlesRef.current.rotation.y += 0.0012 + scrollSpeed * 0.005
        particlesRef.current.rotation.z += 0.0004 + scrollSpeed * 0.003
      }
      
      // 对粒子应用缓慢的波浪效果
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = performance.now() * 0.0002 // Slightly faster wave movement
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]
        
        // 添加微小的波浪运动 - more organic movement
        positions[i] = x + Math.sin(time + x * 0.05) * 0.04
        positions[i + 1] = y + Math.sin(time + y * 0.05) * 0.04
        positions[i + 2] = z + Math.sin(time + z * 0.05) * 0.04
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      // 相机随鼠标移动产生微妙的视差效果 - amplified for more noticeable effect
      const targetX = mouseX * 3
      const targetY = -mouseY * 3
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.03
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.03
      
      // 相机随滚动移动 - 提供更平滑的过渡 - smoother transition between sections
      let targetZ = 20
      if (activeSection === 'map') {
        targetZ = 18 - scrollPosRef.current * 3
      } else if (activeSection === 'featured') {
        targetZ = 15 - scrollPosRef.current * 4
      } else {
        targetZ = 20 - scrollPosRef.current * 2
      }
      
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05 // Faster camera movement
      
      // 渲染场景
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // 处理窗口大小变化
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      // 更新相机
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      
      // 更新渲染器
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    // 添加事件监听器
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    // 开始动画循环
    animate()
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement)
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeSection])

  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Three.js容器 */}
        <div
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        
        {/* 页面内容 */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/beans" element={<Products />} />
              <Route path="/beans/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/origins" element={<VineyardMap />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
