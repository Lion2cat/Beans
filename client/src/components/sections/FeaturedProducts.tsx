import { useEffect, useRef, useState } from 'react'

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright and floral with notes of citrus and jasmine',
    price: '$18.99',
    image: '/images/ethiopian.jpg'
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich and balanced with hints of chocolate and nuts',
    price: '$16.99',
    image: '/images/colombian.jpg'
  },
  {
    id: 3,
    name: 'Kenyan AA',
    description: 'Bold and fruity with a wine-like acidity',
    price: '$19.99',
    image: '/images/kenyan.jpg'
  }
]

const ProductCard = ({ product, index, isActive }: { product: typeof products[0]; index: number; isActive: boolean }) => {
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
    borderRadius: '0',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.8s ease-out',
    transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
    height: '100%',
    opacity: isActive ? 1 : 0.4,
    display: 'flex',
    flexDirection: 'column'
  }
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    transform: 'scale(1)',
    transition: 'transform 0.8s ease'
  }
  
  const contentStyle: React.CSSProperties = {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  }
  
  const titleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: '1.8rem',
    color: '#5d342f',
    fontWeight: '500',
    fontFamily: '"Playfair Display", serif',
    letterSpacing: '0.5px'
  }
  
  const descStyle: React.CSSProperties = {
    margin: '0 0 20px 0',
    color: '#666',
    lineHeight: 1.6,
    flexGrow: 1,
    fontSize: '1rem',
    fontWeight: '300'
  }
  
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '15px',
    borderTop: '1px solid rgba(0,0,0,0.05)'
  }
  
  const priceStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#5d342f'
  }
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#a05c4a',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    letterSpacing: '1px',
    fontWeight: '500',
    textTransform: 'uppercase'
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
    e.currentTarget.style.transform = 'scale(1.05)'
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
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      // 获取部分的边界
      const rect = sectionRef.current.getBoundingClientRect()
      
      // 检查部分是否在视口中
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // 计算滚动进度
        const scrollProgress = 1 - (rect.top / window.innerHeight)
        
        // 确定激活的产品
        const cardHeight = window.innerHeight * 0.7
        const triggerPoint = window.innerHeight * 0.5
        
        if (scrollProgress < 0.3) {
          setActiveProductIndex(null)
        } else {
          // 计算每个产品卡片的位置
          const cards = document.querySelectorAll('.product-card')
          cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect()
            const cardCenter = cardRect.top + cardRect.height / 2
            
            // 如果卡片中心点接近视口中心，激活该卡片
            if (Math.abs(cardCenter - triggerPoint) < cardHeight / 2) {
              setActiveProductIndex(index)
            }
          })
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始调用
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  const sectionStyle: React.CSSProperties = {
    padding: '120px 0 80px 0',
    backgroundColor: '#faf6f2',
    position: 'relative',
    overflow: 'hidden'
  }
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
    position: 'relative'
  }
  
  const titleContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '80px',
    position: 'relative'
  }
  
  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    color: '#5d342f',
    fontFamily: '"Playfair Display", serif',
    fontWeight: '600',
    letterSpacing: '1px',
    display: 'inline-block',
    position: 'relative'
  }
  
  const titleUnderlineStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-10px',
    left: '10%',
    width: '80%',
    height: '1px',
    backgroundColor: '#a05c4a',
    opacity: 0.5
  }
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
    position: 'relative'
  }
  
  return (
    <section ref={sectionRef} style={sectionStyle}>
      <div style={containerStyle}>
        <div style={titleContainerStyle}>
          <h2 ref={titleRef} style={titleStyle}>
            Our Featured Beans
            <span style={titleUnderlineStyle}></span>
          </h2>
        </div>
        <div style={gridStyle}>
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              <ProductCard 
                product={product} 
                index={index} 
                isActive={activeProductIndex === index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 