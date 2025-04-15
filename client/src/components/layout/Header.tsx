import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
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
  
  // 动态样式
  const getBackgroundOpacity = () => {
    return Math.min(0.9, scrollProgress * 2)
  }
  
  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: `${20 - scrollProgress * 10}px 0`,
    backgroundColor: `rgba(255, 255, 255, ${getBackgroundOpacity()})`,
    backdropFilter: 'blur(8px)',
    boxShadow: scrollProgress > 0.05 ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'padding 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
  }
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
  
  const logoStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: scrollProgress > 0.1 ? '#5d342f' : 'white',
    textDecoration: 'none',
    textShadow: scrollProgress > 0.1 ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)',
    transition: 'color 0.3s ease, text-shadow 0.3s ease',
    position: 'relative'
  }
  
  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  }
  
  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: scrollProgress > 0.1 ? '#5d342f' : 'white',
    fontWeight: 500,
    fontSize: '1rem',
    position: 'relative',
    padding: '5px 0',
    textShadow: scrollProgress > 0.1 ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.3)',
    transition: 'color 0.3s ease, text-shadow 0.3s ease'
  }
  
  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    fontWeight: 'bold'
  }
  
  const mobileNavBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: scrollProgress > 0.1 ? '#5d342f' : 'white',
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
    height: '3px',
    width: `${scrollProgress * 100}%`,
    backgroundColor: '#a05c4a',
    transition: 'width 0.1s ease-out'
  }
  
  // 生成伪随机链接色调变化，基于滚动位置
  const getLinkHoverColor = (index: number) => {
    const baseHue = 10 // 基本色调
    const variation = (scrollProgress * 10) + (index * 5) // 基于滚动和链接索引的变化
    return `hsl(${baseHue + variation}, 60%, 45%)`
  }
  
  // 媒体查询效果通过JavaScript模拟
  useEffect(() => {
    const handleResize = () => {
      const mobileNav = document.querySelector('.mobile-nav-btn') as HTMLElement
      const desktopNav = document.querySelector('.desktop-nav') as HTMLElement
      
      if (window.innerWidth < 768) {
        if (mobileNav) mobileNav.style.display = 'block'
        if (desktopNav) desktopNav.style.display = isMenuOpen ? 'flex' : 'none'
      } else {
        if (mobileNav) mobileNav.style.display = 'none'
        if (desktopNav) desktopNav.style.display = 'flex'
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // 初始调用
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen])
  
  const navLinks = [
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]
  
  return (
    <header style={headerStyle}>
      <div style={progressBarStyle}></div>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          Beans
          <span 
            style={{
              position: 'absolute',
              bottom: '-3px',
              left: 0,
              width: '100%',
              height: '2px',
              background: scrollProgress > 0.1 ? '#a05c4a' : 'white',
              transform: `scaleX(${scrollProgress > 0.5 ? 1 : scrollProgress * 2})`,
              transformOrigin: 'left',
              transition: 'transform 0.3s ease, background-color 0.3s ease'
            }}
          />
        </Link>
        
        {/* 桌面导航 */}
        <nav className="desktop-nav" style={navStyle}>
          {navLinks.map((link, index) => (
            <Link 
              key={link.path}
              to={link.path}
              style={link.path === window.location.pathname ? activeLinkStyle : linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = getLinkHoverColor(index)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = scrollProgress > 0.1 ? '#5d342f' : 'white'
              }}
            >
              {link.label}
              <span 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: '0',
                  height: '2px',
                  backgroundColor: '#a05c4a',
                  transition: 'width 0.3s ease, left 0.3s ease',
                }}
                className="link-underline"
                onMouseEnter={(e) => {
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.style.width = '100%'
                    e.currentTarget.style.left = '0'
                  }
                }}
                onMouseLeave={(e) => {
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.style.width = '0'
                    e.currentTarget.style.left = '50%'
                  }
                }}
              />
            </Link>
          ))}
        </nav>
        
        {/* 移动导航按钮 */}
        <button 
          className="mobile-nav-btn"
          style={mobileNavBtnStyle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* 移动导航菜单 */}
      {isMenuOpen && (
        <div 
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: '#5d342f',
                textDecoration: 'none',
                padding: '10px',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5ede6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
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