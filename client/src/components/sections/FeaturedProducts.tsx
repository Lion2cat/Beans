import { useEffect, useRef, useState, useCallback } from 'react'

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
  const imageRef = useRef<HTMLImageElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      Object.assign(cardRef.current.style, hoverStyles);
    }
    if (imageRef.current) {
      Object.assign(imageRef.current.style, imageHoverStyle);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.boxShadow = '';
    }
    if (imageRef.current) {
      imageRef.current.style.transform = '';
    }
  };
  
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    opacity: isActive ? 1 : 0.8
  }
  
  const hoverStyles = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
  }
  
  const imageContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    position: 'relative'
  }
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '330px',
    objectFit: 'contain',
    transition: 'transform 0.8s ease',
    padding: '10px'
  }
  
  const imageHoverStyle = {
    transform: 'scale(1.05)'
  }
  
  const contentStyle: React.CSSProperties = {
    padding: '15px 20px'
  }
  
  const productTitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#3a3a3a'
  }
  
  const descStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.4'
  }
  
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eee',
    padding: '12px 20px',
    backgroundColor: '#f9f9f9'
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
  
  return (
    <div ref={cardRef} style={cardStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div style={imageContainerStyle}>
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          style={imageStyle}
        />
      </div>
      <div style={contentStyle}>
        <h3 style={productTitleStyle}>{product.name}</h3>
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
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [entryDirection, setEntryDirection] = useState<'up' | 'down'>('down')
  const titleRef = useRef<HTMLHeadingElement>(null)
  
  const handleMouse = useCallback((event: MouseEvent) => {
    if (sectionRef.current) {
      const { clientX, clientY } = event
      const rect = sectionRef.current.getBoundingClientRect()
      setCursorPosition({
        x: clientX - rect.left,
        y: clientY - rect.top
      })
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      // Get section boundaries
      const rect = sectionRef.current.getBoundingClientRect()
      
      // Check if section is in the viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Calculate scroll progress
        const scrollProgress = 1 - (rect.top / window.innerHeight)
        
        // Determine active product
        const cardHeight = window.innerHeight * 0.7
        const triggerPoint = window.innerHeight * 0.5
        
        if (scrollProgress < 0.3) {
          setActiveIndex(-1)
        } else {
          // Calculate position of each product card
          const cards = document.querySelectorAll('.product-card')
          cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect()
            const cardCenter = cardRect.top + cardRect.height / 2
            
            // If card center is close to viewport center, activate that card
            if (Math.abs(cardCenter - triggerPoint) < cardHeight / 2) {
              setActiveIndex(index)
            }
          })
        }

        // Set visibility and determine entry direction for animations
        setIsVisible(true)
        if (rect.top > window.innerHeight / 2) {
          setEntryDirection('down')
        } else {
          setEntryDirection('up')
        }
      } else {
        if (rect.top > window.innerHeight) {
          setIsVisible(false)
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Add a subtle effect to the title when scrolling from map
  useEffect(() => {
    const handleTitleEffect = () => {
      if (titleRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const progress = 1 - (rect.top / window.innerHeight)
        
        if (progress > 0 && progress < 1) {
          titleRef.current.style.transform = `translateY(${(1 - progress) * 30}px)`
          titleRef.current.style.opacity = `${Math.min(1, progress * 2)}`
        }
      }
    }
    
    window.addEventListener('scroll', handleTitleEffect)
    return () => window.removeEventListener('scroll', handleTitleEffect)
  }, [])
  
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    padding: '80px 0 80px 0',
    backgroundColor: '#f7f5f3',
    position: 'relative',
    overflow: 'hidden'
  }
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  }
  
  const titleContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '50px',
    position: 'relative',
    zIndex: 2
  }
  
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#5d342f',
    margin: '0',
    fontFamily: '"Playfair Display", serif',
    position: 'relative',
    transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
    willChange: 'transform, opacity'
  }
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    position: 'relative',
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : entryDirection === 'down' ? 50 : -50}px)`,
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  }
  
  const cursorBlobStyle: React.CSSProperties = {
    position: 'absolute',
    top: cursorPosition.y,
    left: cursorPosition.x,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    pointerEvents: 'none'
  }

  // Decorative background elements that enhance the transition
  const decorativeElementStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    left: '0',
    width: '100%',
    height: '100px',
    background: 'linear-gradient(to bottom, rgba(251,247,243,1) 0%, rgba(247,245,243,0) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease',
  }
  
  return (
    <section ref={sectionRef} style={sectionStyle}>
      {/* Decorative transition element */}
      <div style={decorativeElementStyle} />
      
      <div style={containerStyle}>
        <div style={titleContainerStyle}>
          <h2 ref={titleRef} style={sectionTitleStyle}>Our Featured Beans</h2>
        </div>
        <div style={gridStyle}>
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
              isActive={activeIndex === -1 || activeIndex === index}
            />
          ))}
        </div>
      </div>
      <div style={cursorBlobStyle}></div>
    </section>
  )
}

export default FeaturedProducts 