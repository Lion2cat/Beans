import { useEffect, useRef } from 'react'

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      
      // 计算滚动进度
      const rect = heroRef.current.getBoundingClientRect()
      const scrollProgress = 1 - (rect.bottom / window.innerHeight)
      
      // 应用视差效果
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        if (heroRef.current.querySelector('.hero-content')) {
          const content = heroRef.current.querySelector('.hero-content') as HTMLElement
          content.style.transform = `translateY(${scrollProgress * 50}px)`
          content.style.opacity = `${1 - scrollProgress}`
        }
        
        if (heroRef.current.querySelector('.hero-image')) {
          const image = heroRef.current.querySelector('.hero-image') as HTMLElement
          image.style.transform = `scale(${1 + scrollProgress * 0.2}) translateY(${scrollProgress * -30}px)`
        }
      }
    }
    
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll)
    
    // 初始调用一次确保状态正确
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const heroStyle: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }

  const bgImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#5d342f',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2
  }

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3,
    textAlign: 'center',
    color: 'white',
    padding: '0 20px',
    maxWidth: '800px',
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
  }

  const headingStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
    marginBottom: '20px',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  }

  const paragraphStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    marginBottom: '30px',
    maxWidth: '600px',
    margin: '0 auto 30px',
    lineHeight: 1.5
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#a05c4a',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    fontSize: '1rem',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }

  return (
    <section ref={heroRef} style={heroStyle}>
      <div className="hero-image" style={bgImageStyle}>
        <img 
          src="/images/hero-bg.jpg" 
          alt="Coffee beans background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
      <div style={overlayStyle} />
      <div className="hero-content" style={contentStyle}>
        <h1 style={headingStyle}>INTRANSIGENT</h1>
        <p style={paragraphStyle}>
          Experience the finest coffee beans from around the world, 
          carefully selected and roasted to perfection.
        </p>
        <button 
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#85493d'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#a05c4a'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Explore Our Menu
        </button>
      </div>
    </section>
  )
}

export default Hero 