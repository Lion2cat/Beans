import { BrowserRouter as Router } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import FeaturedProducts from './components/sections/FeaturedProducts'

function App() {
  // 保存Three.js场景的引用
  const canvasRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // 设置初始滚动位置
  const scrollPosRef = useRef(0)

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
    const particlesCnt = 5000
    const posArray = new Float32Array(particlesCnt * 3)
    
    // 生成随机分布的粒子
    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    // 创建粒子材质
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color('#a05c4a'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    
    // 创建粒子系统
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // 处理滚动事件
    const handleScroll = () => {
      scrollPosRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    }

    // 动画循环
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return
      
      // 根据滚动位置为粒子动画设置速度
      const scrollSpeed = scrollPosRef.current * 0.1
      particlesRef.current.rotation.y += 0.001 + scrollSpeed * 0.01
      particlesRef.current.rotation.x += 0.0005 + scrollSpeed * 0.005
      
      // 相机随滚动移动
      const targetZ = 20 - scrollPosRef.current * 5
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05
      
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
    
    // 开始动画循环
    animate()
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement)
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

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
            <Hero />
            <FeaturedProducts />
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
