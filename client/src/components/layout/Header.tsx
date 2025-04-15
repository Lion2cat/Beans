import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Logo方块的数量
const CUBE_COUNT = 4

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredCube, setHoveredCube] = useState<number | null>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY
      
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (lastScrollY.current > 50) {
            setScrolled(true)
          } else {
            setScrolled(false)
          }
          ticking.current = false
        })
        
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  useEffect(() => {
    const handleResize = () => {
      const mobileNav = document.querySelector('.mobile-nav-btn') as HTMLElement
      const desktopNav = document.querySelector('.desktop-nav') as HTMLElement
      
      if (window.innerWidth < 768) {
        if (mobileNav) mobileNav.style.display = 'block'
        if (desktopNav) desktopNav.style.display = menuOpen ? 'flex' : 'none'
      } else {
        if (mobileNav) mobileNav.style.display = 'none'
        if (desktopNav) desktopNav.style.display = 'flex'
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // 初始调用
    
    return () => window.removeEventListener('resize', handleResize)
  }, [menuOpen])
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = scrollPosition / maxScroll
      
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 为Logo添加鼠标移动交互
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return
      
      const rect = logoRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // 将鼠标位置转换为-15到15度之间的旋转值
      const rotateX = 15 - (y / rect.height) * 30
      const rotateY = (x / rect.width) * 30 - 15
      
      // 应用3D旋转效果
      logoRef.current.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
    
    const handleMouseLeave = () => {
      if (!logoRef.current) return
      logoRef.current.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)'
    }
    
    const logo = logoRef.current
    if (logo) {
      logo.addEventListener('mousemove', handleMouseMove)
      logo.addEventListener('mouseleave', handleMouseLeave)
    }
    
    return () => {
      if (logo) {
        logo.removeEventListener('mousemove', handleMouseMove)
        logo.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])
  
  // 动态样式
  const getBackgroundOpacity = () => {
    return Math.min(0.9, scrollProgress * 2)
  }
  
  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    padding: '1rem 2rem',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: scrolled 
      ? 'rgba(255, 255, 255, 0.6)' 
      : 'rgba(255, 255, 255, 0)',
    backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
    boxShadow: scrolled 
      ? '0 4px 15px rgba(0, 0, 0, 0.05)' 
      : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: scrolled ? '#333' : '#fff',
  }
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  }
  
  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '1px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.3s ease',
    transform: scrolled ? 'scale(0.9)' : 'scale(1)',
    transformOrigin: 'left center',
  }
  
  const navStyle = {
    display: 'flex',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  }
  
  const navLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 500,
    position: 'relative' as const,
    padding: '0.5rem 0',
    transition: 'all 0.3s ease',
  }
  
  const linkHoverStyle = {
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      backgroundColor: '#a05c4a',
      transition: 'width 0.3s ease',
    },
    '&:hover::after': {
      width: '100%',
    },
    '&:hover': {
      color: '#a05c4a',
    },
  }
  
  const burgerStyle = {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
    cursor: 'pointer',
    zIndex: 1001,
  }
  
  const mobileMenuStyle = {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: '70%',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    zIndex: 1000,
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
  }
  
  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    position: 'relative',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  }
  
  const logoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '3px',
    width: '40px',
    height: '40px',
    transition: 'transform 0.3s ease',
    transformStyle: 'preserve-3d',
    willChange: 'transform'
  }
  
  const getLogoItemStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredCube === index
    const colors = ['#a05c4a', '#85493d', '#5d342f', '#3d261e']
    
    return {
      backgroundColor: colors[index],
      width: '100%',
      height: '100%',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
      opacity: isHovered ? 0.8 : 1
    }
  }
  
  const logoTextStyle: React.CSSProperties = {
    marginLeft: '12px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: scrollProgress > 0.05 ? '#5d342f' : 'white',
    textTransform: 'uppercase',
    fontFamily: '"Playfair Display", serif',
    transition: 'color 0.3s ease',
    textShadow: scrollProgress < 0.05 ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
  }
  
  const activeLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    fontWeight: 'bold'
  }
  
  const mobileNavBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: scrollProgress > 0.05 ? '#5d342f' : 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    display: 'none',
    transition: 'color 0.3s ease'
  }
  
  const progressBarStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    width: `${scrollProgress * 100}%`,
    backgroundColor: '#a05c4a',
    transition: 'width 0.1s ease-out'
  }
  
  // 生成伪随机链接色调变化，基于滚动位置
  const getLinkHoverColor = (index: number) => {
    return scrollProgress > 0.05 ? '#a05c4a' : '#f8d0c0'
  }
  
  const navLinks = [
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]
  
  return (
    <header ref={headerRef} style={headerStyle}>
      <div style={progressBarStyle}></div>
      <div style={containerStyle}>
        <Link to="/" style={logoContainerStyle}>
          <div ref={logoRef} style={logoGridStyle}>
            {Array.from({ length: CUBE_COUNT }).map((_, index) => (
              <div 
                key={index}
                style={getLogoItemStyle(index)}
                onMouseEnter={() => setHoveredCube(index)}
                onMouseLeave={() => setHoveredCube(null)}
              />
            ))}
          </div>
          <span style={logoTextStyle}>Beans</span>
        </Link>
        
        {/* 桌面导航 */}
        <nav style={navStyle as any}>
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              style={{ ...navLinkStyle, ...linkHoverStyle } as any}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* 移动导航按钮 */}
        <div style={burgerStyle as any} onClick={toggleMenu}>
          <span>Menu</span>
        </div>
      </div>
      
      {/* 移动导航菜单 */}
      {menuOpen && (
        <div style={mobileMenuStyle as any}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{ ...navLinkStyle, ...linkHoverStyle } as any}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header 