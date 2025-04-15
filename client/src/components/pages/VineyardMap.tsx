import { useRef, useState, useEffect } from 'react'

interface VineyardLocation {
  id: number
  name: string
  description: string
  x: number
  y: number
  image: string
}

const vineyardLocations: VineyardLocation[] = [
  {
    id: 1,
    name: 'Ethiopian Highland',
    description: 'High-altitude farms producing bright, floral coffee with distinctive citrus notes.',
    x: 35,
    y: 20,
    image: '/images/ethiopian-farm.jpg'
  },
  {
    id: 2,
    name: 'Colombian Mountains',
    description: 'Nestled in the Andes, these farms produce balanced beans with chocolate and caramel notes.',
    x: 60,
    y: 45,
    image: '/images/colombian-farm.jpg'
  },
  {
    id: 3,
    name: 'Kenyan Plateaus',
    description: 'Rich volcanic soil creating bold, wine-like beans with berry undertones.',
    x: 15,
    y: 65,
    image: '/images/kenyan-farm.jpg'
  },
  {
    id: 4,
    name: 'Brazilian Estate',
    description: 'Vast farms producing nutty, low-acidity beans with a sweet finish.',
    x: 75,
    y: 30,
    image: '/images/brazilian-farm.jpg'
  },
  {
    id: 5,
    name: 'Indonesian Islands',
    description: 'Tropical climate yielding earthy, full-bodied coffee with herbal notes.',
    x: 45,
    y: 80,
    image: '/images/indonesian-farm.jpg'
  }
]

const VineyardMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [activeFarm, setActiveFarm] = useState<VineyardLocation | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  // Load the initial state with a slight delay to ensure smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle mouse and touch events for dragging
  useEffect(() => {
    if (!mapRef.current || !mapContainerRef.current) return
    
    const mapElement = mapRef.current
    
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      isDraggingRef.current = true
      lastPositionRef.current = { x: e.clientX, y: e.clientY }
      mapElement.style.cursor = 'grabbing'
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      
      const deltaX = e.clientX - lastPositionRef.current.x
      const deltaY = e.clientY - lastPositionRef.current.y
      lastPositionRef.current = { x: e.clientX, y: e.clientY }
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
    }
    
    const handleMouseUp = () => {
      isDraggingRef.current = false
      mapElement.style.cursor = 'grab'
    }
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        isDraggingRef.current = true
        lastPositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return
      
      const deltaX = e.touches[0].clientX - lastPositionRef.current.x
      const deltaY = e.touches[0].clientY - lastPositionRef.current.y
      lastPositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
    }
    
    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Calculate new scale factor
      const delta = -e.deltaY * 0.005
      const newScale = Math.max(0.5, Math.min(2, scale + delta))
      
      setScale(newScale)
    }
    
    // Add event listeners
    mapElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    mapElement.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    mapContainerRef.current.addEventListener('wheel', handleWheel)
    
    // Cleanup
    return () => {
      mapElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      mapElement.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      
      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('wheel', handleWheel)
      }
    }
  }, [scale])
  
  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    background: '#faf6f2',
    cursor: 'grab'
  }
  
  const mapStyle: React.CSSProperties = {
    width: '200%',
    height: '200%',
    position: 'relative',
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: mapLoaded ? 'transform 0.2s ease' : 'none',
    backgroundImage: 'url("/images/coffee-map-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transformOrigin: 'center'
  }
  
  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    fontSize: '2.5rem',
    fontFamily: '"Playfair Display", serif',
    color: '#5d342f',
    zIndex: 10,
    opacity: mapLoaded ? 1 : 0,
    transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  }
  
  const legendStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '2rem',
    left: '2rem',
    padding: '1rem 1.5rem',
    background: 'white',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    maxWidth: '280px',
    opacity: mapLoaded ? 1 : 0,
    transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  }
  
  const instructionStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1rem',
    color: '#5d342f',
    marginBottom: '1rem',
    fontStyle: 'italic'
  }
  
  const farmCardStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '2rem',
    transform: activeFarm ? 'translateY(-50%)' : 'translateY(-50%) translateX(100%)',
    width: '350px',
    background: 'white',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: 0,
    overflow: 'hidden',
    zIndex: 10,
    transition: 'transform 0.5s ease',
    opacity: activeFarm ? 1 : 0
  }
  
  const farmImageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  }
  
  const farmContentStyle: React.CSSProperties = {
    padding: '1.5rem'
  }
  
  const farmTitleStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.8rem',
    color: '#5d342f',
    marginBottom: '0.5rem'
  }
  
  const farmDescriptionStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '1rem'
  }
  
  const farmButtonStyle: React.CSSProperties = {
    backgroundColor: '#a05c4a',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
  
  const getLocationPinStyle = (location: VineyardLocation): React.CSSProperties => {
    const isActive = activeFarm?.id === location.id
    
    return {
      position: 'absolute',
      left: `${location.x}%`,
      top: `${location.y}%`,
      width: isActive ? '30px' : '20px',
      height: isActive ? '30px' : '20px',
      borderRadius: '50%',
      backgroundColor: isActive ? '#5d342f' : '#a05c4a',
      transform: `translate(-50%, -50%) scale(${mapLoaded ? 1 : 0})`,
      transition: 'transform 0.5s ease, background-color 0.3s ease, width 0.3s ease, height 0.3s ease',
      cursor: 'pointer',
      boxShadow: isActive ? '0 0 0 5px rgba(93, 52, 47, 0.3)' : 'none',
      zIndex: isActive ? 2 : 1
    }
  }
  
  const handleLocationClick = (location: VineyardLocation) => {
    setActiveFarm(prevFarm => prevFarm?.id === location.id ? null : location)
  }
  
  const handleCloseCard = () => {
    setActiveFarm(null)
  }
  
  return (
    <div ref={mapContainerRef} style={containerStyle}>
      <h1 style={titleStyle}>Coffee Bean Origins</h1>
      
      <div ref={mapRef} style={mapStyle}>
        {/* Location pins */}
        {vineyardLocations.map(location => (
          <div
            key={location.id}
            style={getLocationPinStyle(location)}
            onClick={() => handleLocationClick(location)}
            title={location.name}
          />
        ))}
      </div>
      
      <div style={legendStyle}>
        <p style={instructionStyle}>
          Drag to explore coffee regions. Zoom with scroll wheel.
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Our coffee beans are sourced from the finest farms across the globe.
          Click on markers to learn about each origin.
        </p>
      </div>
      
      {/* Farm info card */}
      <div style={farmCardStyle}>
        {activeFarm && (
          <>
            <img src={activeFarm.image} alt={activeFarm.name} style={farmImageStyle} />
            <div style={farmContentStyle}>
              <h3 style={farmTitleStyle}>{activeFarm.name}</h3>
              <p style={farmDescriptionStyle}>{activeFarm.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  style={farmButtonStyle}
                  onClick={() => window.location.href = `/beans?origin=${activeFarm.name.toLowerCase().replace(' ', '-')}`}
                >
                  View Beans
                </button>
                <button 
                  style={{ ...farmButtonStyle, backgroundColor: 'transparent', color: '#a05c4a' }}
                  onClick={handleCloseCard}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VineyardMap 