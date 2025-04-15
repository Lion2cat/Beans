import { useEffect, useRef } from 'react'

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright and floral with notes of citrus and jasmine',
    price: '$18.99',
    image: '/images/ethiopian.jpg' // 使用现有图片作为占位符
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich and balanced with hints of chocolate and nuts',
    price: '$16.99',
    image: '/images/colombian.jpg' // 使用现有图片作为占位符
  },
  {
    id: 3,
    name: 'Kenyan AA',
    description: 'Bold and fruity with a wine-like acidity',
    price: '$19.99',
    image: '/images/kenyan.jpg' // 使用现有图片作为占位符
  }
]

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      
      // 获取卡片的边界矩形
      const rect = cardRef.current.getBoundingClientRect()
      
      // 计算鼠标在卡片上的相对位置
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // 计算移动比例
      const moveX = (x / rect.width - 0.5) * 10
      const moveY = (y / rect.height - 0.5) * 10
      
      // 应用3D效果
      cardRef.current.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) scale3d(1.02, 1.02, 1.02)`
    }
    
    const handleMouseLeave = () => {
      if (!cardRef.current) return
      
      // 重置卡片位置
      cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`
    }
    
    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    }
    
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])
  
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
    transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
    marginTop: index % 2 === 0 ? '0' : '30px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transform: 'scale(1)',
    transition: 'transform 0.5s ease'
  }
  
  const contentStyle: React.CSSProperties = {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  }
  
  const titleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: '1.5rem',
    color: '#5d342f',
    fontWeight: 'bold'
  }
  
  const descStyle: React.CSSProperties = {
    margin: '0 0 20px 0',
    color: '#666',
    lineHeight: 1.6,
    flexGrow: 1
  }
  
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  }
  
  const priceStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#5d342f'
  }
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#a05c4a',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease'
  }
  
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#85493d'
    e.currentTarget.style.transform = 'translateY(-2px)'
  }
  
  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#a05c4a'
    e.currentTarget.style.transform = 'translateY(0)'
  }
  
  const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.transform = 'scale(1.1)'
  }
  
  const handleImageLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.transform = 'scale(1)'
  }
  
  return (
    <div ref={cardRef} style={cardStyle}>
      <div style={{ overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={imageStyle}
          onMouseOver={handleImageHover}
          onMouseOut={handleImageLeave}
        />
      </div>
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>
        <p style={descStyle}>{product.description}</p>
        <div style={footerStyle}>
          <span style={priceStyle}>{product.price}</span>
          <button 
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

const FeaturedProducts = () => {
  const sectionRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      // 获取部分的边界
      const rect = sectionRef.current.getBoundingClientRect()
      
      // 检查部分是否在视口中
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // 计算滚动进度
        const scrollProgress = 1 - (rect.top / window.innerHeight)
        
        // 查找所有卡片
        const cards = sectionRef.current.querySelectorAll('.product-card')
        
        // 为每个卡片应用动画
        cards.forEach((card, index) => {
          const delay = index * 0.1
          const translateY = Math.max(0, 50 * (1 - Math.min(1, scrollProgress - delay)))
          const opacity = Math.min(1, Math.max(0, (scrollProgress - delay) * 2))
          
          if (card instanceof HTMLElement) {
            card.style.transform = `translateY(${translateY}px)`
            card.style.opacity = opacity.toString()
          }
        })
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始调用
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  const sectionStyle: React.CSSProperties = {
    padding: '80px 0',
    backgroundColor: 'rgba(250, 246, 242, 0.8)',
    position: 'relative',
    overflow: 'hidden'
  }
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  }
  
  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    marginBottom: '60px',
    color: '#5d342f',
    position: 'relative'
  }
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px'
  }
  
  return (
    <section ref={sectionRef} style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Our Featured Beans</h2>
        <div style={gridStyle}>
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card"
              style={{
                opacity: 0,
                transform: 'translateY(50px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 