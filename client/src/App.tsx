import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import FeaturedProducts from './components/sections/FeaturedProducts'
import VineyardMap from './components/pages/VineyardMap'
import MapPage from './pages/MapPage'

// Create basic page components 
const Home = () => (
  <>
    <Hero />
    <MapPage />
    <FeaturedProducts />
  </>
)

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
    const particlesCnt = 3000
    const posArray = new Float32Array(particlesCnt * 3)
    
    // 生成分布在三维空间中的粒子
    for (let i = 0; i < particlesCnt * 3; i += 3) {
      // 创建更广泛的分布模式
      posArray[i] = (Math.random() - 0.5) * 80     // x
      posArray[i + 1] = (Math.random() - 0.5) * 80 // y
      posArray[i + 2] = (Math.random() - 0.5) * 80 // z
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    // 创建粒子材质
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
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
      const heroSection = document.querySelector('section:first-child')
      const featuredSection = document.querySelector('section:nth-child(2)')
      
      if (heroSection && featuredSection) {
        const heroRect = heroSection.getBoundingClientRect()
        const featuredRect = featuredSection.getBoundingClientRect()
        
        if (heroRect.bottom > 0) {
          setActiveSection('hero')
        } else if (featuredRect.bottom > 0) {
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
      const scrollSpeed = scrollPosRef.current * 0.2
      
      // 不同部分呈现不同的动画效果
      if (activeSection === 'hero') {
        particlesRef.current.rotation.y += 0.0005 + scrollSpeed * 0.003
        particlesRef.current.rotation.x += 0.0002 + scrollSpeed * 0.001
      } else if (activeSection === 'featured') {
        particlesRef.current.rotation.y += 0.001 + scrollSpeed * 0.004
        particlesRef.current.rotation.z += 0.0003 + scrollSpeed * 0.002
      }
      
      // 对粒子应用缓慢的波浪效果
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = performance.now() * 0.0001
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]
        
        // 添加微小的波浪运动
        positions[i] = x + Math.sin(time + x * 0.05) * 0.03
        positions[i + 1] = y + Math.sin(time + y * 0.05) * 0.03
        positions[i + 2] = z + Math.sin(time + z * 0.05) * 0.03
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      // 相机随鼠标移动产生微妙的视差效果
      const targetX = mouseX * 2
      const targetY = -mouseY * 2
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02
      
      // 相机随滚动移动
      const targetZ = 20 - (activeSection === 'featured' ? 5 : 0) - scrollPosRef.current * 3
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.03
      
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
