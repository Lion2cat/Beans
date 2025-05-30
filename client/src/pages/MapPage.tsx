import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { createGlobalStyle } from 'styled-components';
import ScrollIndicator from '../components/transitions/ScrollIndicator';

interface CoffeeRegion {
  id: string;
  name: string;
  description: string;
  altitude: string;
  varieties: string[];
  process: string;
  flavors: string[];
  location: {
    top: string;
    left: string;
  };
  image: string;
}

const MapPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [translatePosition, setTranslatePosition] = useState({ x: 0, y: 0 })
  const [scrolled, setScrolled] = useState(false)
  const [autoMoveDirection, setAutoMoveDirection] = useState({ x: 0.2, y: 0.1 })
  const [targetAutoMoveDirection, setTargetAutoMoveDirection] = useState({ x: 0.2, y: 0.1 })
  const lastDirectionChangeRef = useRef(Date.now())
  const animationRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapPosition, setMapPosition] = useState({ x: -250, y: -250 })
  const mapBoundsRef = useRef({ 
    minX: -500, maxX: 0, 
    minY: -500, maxY: 0 
  })

  // Sample coffee regions data with more detailed information
  const regions: CoffeeRegion[] = [
    {
      id: 'ethiopian-yirgacheffe',
      name: 'Ethiopian Yirgacheffe',
      description: 'Bright and floral with notes of citrus and jasmine',
      altitude: '1800-2300',
      varieties: ['Gesha', 'Ethiopian Heirloom'],
      process: 'Washed',
      flavors: ['Red flowers', 'Kiwi fruit', 'Dark berries', 'Melon', 'Peach'],
      location: { top: '35%', left: '58%' },
      image: '/images/ethiopian-farm.jpg'
    },
    {
      id: 'colombian-highlands',
      name: 'Colombian Highlands',
      description: 'Rich and balanced with hints of chocolate and nuts',
      altitude: '1500-2000',
      varieties: ['Caturra', 'Typica', 'Bourbon'],
      process: 'Washed',
      flavors: ['Chocolate', 'Caramel', 'Citrus', 'Berry'],
      location: { top: '53%', left: '28%' },
      image: '/images/ethiopian-farm.jpg'
    },
    {
      id: 'brazilian-cerrado',
      name: 'Brazilian Cerrado',
      description: 'Sweet with nutty notes and low acidity',
      altitude: '800-1300',
      varieties: ['Mundo Novo', 'Bourbon', 'Catuai'],
      process: 'Natural',
      flavors: ['Nuts', 'Chocolate', 'Caramel', 'Red Apple'],
      location: { top: '60%', left: '35%' },
      image: '/images/ethiopian-farm.jpg'
    },
    {
      id: 'kenyan-plateaus',
      name: 'Kenyan Plateaus',
      description: 'Bold and wine-like with pronounced acidity',
      altitude: '1700-2200',
      varieties: ['SL28', 'SL34', 'Ruiru 11'],
      process: 'Washed',
      flavors: ['Blackcurrant', 'Tomato', 'Blackberry', 'Citrus'],
      location: { top: '45%', left: '65%' },
      image: '/images/ethiopian-farm.jpg'
    },
    {
      id: 'guatemalan-antigua',
      name: 'Guatemalan Antigua',
      description: 'Complex with chocolate and spice notes',
      altitude: '1500-1800',
      varieties: ['Bourbon', 'Caturra', 'Catuai'],
      process: 'Washed',
      flavors: ['Chocolate', 'Spice', 'Red Apple', 'Citrus'],
      location: { top: '47%', left: '24%' },
      image: '/images/ethiopian-farm.jpg'
    },
  ];

  // Load the map with a slight delay to ensure smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Close region detail when user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.region-marker') && !target.closest('.region-detail')) {
        setSelectedRegion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find the selected region data
  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '90vh',
    overflow: 'hidden',
    background: '#faf6f2',
    marginBottom: '50px'
  };

  const mapContainerStyle: React.CSSProperties = {
    width: '200%',
    height: '200%',
    position: 'relative',
    backgroundImage: 'url("/images/coffee-map-bg.jpg")',
    backgroundColor: '#e8d7c3', // Fallback color if image is not available
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
    transition: mapLoaded ? 'opacity 0.6s ease' : 'none',
    opacity: mapLoaded ? 1 : 0,
  };

  const markerStyle = (region: CoffeeRegion): React.CSSProperties => ({
    position: 'absolute',
    top: region.location.top,
    left: region.location.left,
    width: selectedRegion === region.id ? '45px' : '35px',
    height: selectedRegion === region.id ? '45px' : '35px',
    borderRadius: '0',
    backgroundColor: selectedRegion === region.id ? '#5d342f' : '#a05c4a',
    border: '3px solid #fff',
    transform: `translate(-50%, -50%) scale(${mapLoaded ? 1 : 0}) rotate(15deg)`,
    transformOrigin: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selectedRegion === region.id 
      ? '0 0 0 8px rgba(93, 52, 47, 0.3), 4px 4px 8px rgba(0,0,0,0.2)' 
      : '4px 4px 8px rgba(0,0,0,0.2)',
    zIndex: selectedRegion === region.id ? 3 : 2,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  });

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    zIndex: 5,
    opacity: mapLoaded ? 1 : 0,
    transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    maxWidth: '40%'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontFamily: '"Playfair Display", serif',
    color: '#5d342f',
    margin: '0 0 10px 0',
  };

  const detailCardStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20%',
    right: '2rem',
    transform: selectedRegion ? 'translateY(-50%)' : 'translateY(-50%) translateX(100%)',
    width: '350px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: 0,
    overflow: 'hidden',
    zIndex: 10,
    transition: 'transform 0.5s ease',
    opacity: selectedRegion ? 1 : 0
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  const infoStyle: React.CSSProperties = {
    padding: '20px',
  };

  const regionNameStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontFamily: '"Playfair Display", serif',
    color: '#5d342f',
    marginBottom: '0.5rem',
    fontWeight: 600
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '1rem'
  };

  const flavorCardStyle: React.CSSProperties = {
    background: '#fff8f4',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
  };

  const flavorTitleStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#5d342f',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transform: 'rotate(90deg)',
    transformOrigin: 'left bottom',
    position: 'absolute',
    left: '-10px',
    top: '-10px',
    fontWeight: 'bold'
  };

  const flavorListStyle: React.CSSProperties = {
    marginLeft: '30px',
    color: '#3a3a3a',
    lineHeight: 1.6
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '5px'
  };

  const infoLabelStyle: React.CSSProperties = {
    flexBasis: '80px',
    fontSize: '0.9rem',
    color: '#777',
  };

  const infoValueStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '0.9rem',
    color: '#333',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#a05c4a',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderRadius: '4px',
    width: '100%',
    marginTop: '15px'
  };

  useEffect(() => {
    // Check if page has been scrolled to this section
    const handleScroll = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
        setScrolled(isVisible)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Parallax effect for title and description
  useEffect(() => {
    const handleParallax = () => {
      if (titleRef.current && descriptionRef.current && mapRef.current) {
        const mapRect = mapRef.current.getBoundingClientRect()
        const progress = 1 - (mapRect.top / window.innerHeight)
        
        if (progress > 0 && progress < 2) {
          titleRef.current.style.transform = `translateY(${progress * -15}px)`
          descriptionRef.current.style.transform = `translateY(${progress * -10}px)`
        }
      }
    }
    
    window.addEventListener('scroll', handleParallax)
    return () => window.removeEventListener('scroll', handleParallax)
  }, [])

  // Calculate map boundaries when loaded
  useEffect(() => {
    if (mapLoaded && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // 设置更合理的边界值，使地图可以居中显示
      mapBoundsRef.current = {
        minX: -containerWidth,
        maxX: 0,
        minY: -containerHeight,
        maxY: 0
      };
      
      // 初始化到地图中央位置
      const centerX = -containerWidth / 2;
      const centerY = -containerHeight / 2;
      x.set(centerX);
      y.set(centerY);
      setMapPosition({ x: centerX, y: centerY });
    }
  }, [mapLoaded]);

  // Smooth auto-move effect using requestAnimationFrame
  useEffect(() => {
    const animateMapMovement = () => {
      // 仅在非拖动状态下移动
      if (!isDragging) {
        // Calculate new position with bounds checking
        const newX = Math.max(
          mapBoundsRef.current.minX,
          Math.min(mapBoundsRef.current.maxX, x.get() + autoMoveDirection.x)
        );
        const newY = Math.max(
          mapBoundsRef.current.minY,
          Math.min(mapBoundsRef.current.maxY, y.get() + autoMoveDirection.y)
        );
        
        // Update position with smooth animation
        x.set(newX);
        y.set(newY);
        
        // Update React state
        setMapPosition({ x: newX, y: newY });
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animateMapMovement);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateMapMovement);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, autoMoveDirection]);

  // Handle dragging interaction
  const handleDragStart = () => {
    setIsDragging(true);
    // 暂停方向变化
    setAutoMoveDirection({ x: 0, y: 0 });
    setTargetAutoMoveDirection({ x: 0, y: 0 });
  };

  const handleDrag = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    // 拖动时只更新位置，不应用自动移动
    const currentX = x.get();
    const currentY = y.get();
    
    // Update the map position as it's being dragged
    const newX = Math.max(
      mapBoundsRef.current.minX,
      Math.min(mapBoundsRef.current.maxX, currentX + info.delta.x)
    );
    const newY = Math.max(
      mapBoundsRef.current.minY,
      Math.min(mapBoundsRef.current.maxY, currentY + info.delta.y)
    );
    
    x.set(newX);
    y.set(newY);
    
    // Update React state for the animate property
    setMapPosition({ x: newX, y: newY });
  };

  const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // When user releases, ensure position is within bounds
    const newX = Math.max(
      mapBoundsRef.current.minX,
      Math.min(mapBoundsRef.current.maxX, x.get())
    );
    const newY = Math.max(
      mapBoundsRef.current.minY,
      Math.min(mapBoundsRef.current.maxY, y.get())
    );
    
    x.set(newX);
    y.set(newY);
    
    // Update the state for React rendering
    setMapPosition({ x: newX, y: newY });
    
    // 设置极缓慢的移动速度，根据用户拖动方向
    if (Math.abs(info.velocity.x) > 0 || Math.abs(info.velocity.y) > 0) {
      // 使用非常小的乘数，确保移动极其缓慢
      const velocityFactor = 0.002; // 极缓慢
      setAutoMoveDirection({
        x: info.velocity.x > 0 ? velocityFactor : (info.velocity.x < 0 ? -velocityFactor : 0),
        y: info.velocity.y > 0 ? velocityFactor : (info.velocity.y < 0 ? -velocityFactor : 0)
      });
      
      // 确保目标方向与当前方向一致，避免突然变化
      setTargetAutoMoveDirection({
        x: info.velocity.x > 0 ? velocityFactor : (info.velocity.x < 0 ? -velocityFactor : 0),
        y: info.velocity.y > 0 ? velocityFactor : (info.velocity.y < 0 ? -velocityFactor : 0)
      });
    } else {
      // 无明显方向时保持微小移动
      setAutoMoveDirection({ x: 0.002, y: 0.001 });
      setTargetAutoMoveDirection({ x: 0.002, y: 0.001 });
    }
  };

  return (
    <div 
      ref={mapRef}
      className="map-page-container"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FBF7F3',
        transition: 'opacity 0.6s ease',
      }}
    >
      <div 
        className="map-content"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2,
          pointerEvents: 'none',
          width: '100%',
          padding: '0 20px',
          opacity: scrolled ? 1 : 0.3,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <h2 
          ref={titleRef}
          style={{
            fontSize: '3rem',
            color: '#5C3D2E',
            marginBottom: '1rem',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            letterSpacing: '1px',
            opacity: scrolled ? 1 : 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 1s ease',
            willChange: 'opacity, transform',
          }}
        >
          Our Growing Regions
        </h2>
        <p 
          ref={descriptionRef}
          style={{
            fontSize: '1.2rem',
            color: '#6F5E53',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontFamily: '"Lora", serif',
            opacity: scrolled ? 1 : 0,
            transform: 'translateY(15px)',
            transition: 'opacity 0.8s ease 0.2s, transform 1s ease 0.2s',
            willChange: 'opacity, transform',
          }}
        >
          Explore the regions where we source our premium coffee beans. 
          Each location imparts unique flavors based on soil, altitude, and climate.
        </p>
      </div>

      <motion.div
        ref={containerRef}
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          style={mapContainerStyle}
          initial={{ x: -250, y: -250 }} // 初始位置设为中心
          animate={{ 
            x: mapPosition.x,
            y: mapPosition.y
          }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          transition={{
            type: "tween",
            duration: 0.8, // 更慢的过渡
            ease: "linear" // 线性缓动，更平滑
          }}
        >
          {regions.map((region) => (
            <motion.div
              key={region.id}
              className="region-marker"
              style={markerStyle(region)}
              whileHover={{ scale: 1.2, rotate: 0 }}
              onClick={() => setSelectedRegion(region.id)}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '10px',
                  transform: 'rotate(-15deg)',
                  pointerEvents: 'none'
                }}
              >
                {region.name.charAt(0)}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Use the reusable ScrollIndicator component */}
      <ScrollIndicator 
        targetSectionId="products-section"
        isVisible={scrolled}
        text="Discover our products"
        position="bottom"
        color="#5C3D2E"
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '8rem',
          left: '2rem',
          padding: '1.2rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          zIndex: 10,
          maxWidth: '280px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: mapLoaded ? 1 : 0,
          y: mapLoaded ? 0 : 20
        }}
        transition={{ delay: 0.6, duration: 0.6 }}
        whileHover={{ 
          y: -5, 
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
        }}
      >
        <motion.p 
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1rem',
            color: '#5d342f',
            margin: 0,
            fontStyle: 'italic'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Drag to explore coffee regions. Click on markers to learn more.
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {selectedRegion && (
          <motion.div 
            style={detailCardStyle}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="region-detail"
          >
            {selectedRegionData && (
              <>
                <motion.img 
                  src={selectedRegionData.image} 
                  alt={selectedRegionData.name} 
                  style={imageStyle}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  style={infoStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 style={regionNameStyle}>{selectedRegionData.name}</h3>
                  <p style={descriptionStyle}>{selectedRegionData.description}</p>
                  
                  <motion.div 
                    style={flavorCardStyle}
                    whileHover={{ 
                      boxShadow: '0 10px 20px rgba(160, 92, 74, 0.15)',
                      y: -5 
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <span style={flavorTitleStyle}>FLAVOR</span>
                      <ul style={flavorListStyle}>
                        {selectedRegionData.flavors.map((flavor, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            {flavor}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  
                  <motion.h4 
                    style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#5d342f' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Info
                  </motion.h4>
                  
                  {[
                    { label: 'Altitude', value: selectedRegionData.altitude },
                    { label: 'Varietal', value: selectedRegionData.varieties.join(', ') },
                    { label: 'Process', value: selectedRegionData.process }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      style={infoRowStyle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <span style={infoLabelStyle}>{item.label}</span>
                      <span style={infoValueStyle}>{item.value}</span>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      style={{
                        ...buttonStyle,
                        flex: 1,
                        marginRight: '10px'
                      }}
                      whileHover={{ 
                        backgroundColor: '#85493d',
                        y: -3,
                        boxShadow: '0 5px 15px rgba(160, 92, 74, 0.3)' 
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = `/beans?region=${selectedRegionData.id}`}
                    >
                      View Beans
                    </motion.button>
                    <motion.button
                      style={{
                        ...buttonStyle,
                        backgroundColor: 'transparent',
                        color: '#a05c4a',
                        border: '1px solid #a05c4a',
                        flex: 1,
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(160, 92, 74, 0.1)',
                        y: -3
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRegion(null)}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MapStyles = createGlobalStyle`
  .map-page-container {
    position: relative;
    z-index: 1;
  }
  
  .map-wrapper {
    cursor: grab;
    position: relative;
    transition: transform 0.1s ease-out;
    will-change: transform;
  }
  
  .map-wrapper:active {
    cursor: grabbing;
  }
  
  .region-marker {
    position: absolute;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%) rotate(15deg);
    border-radius: 0;
    background-color: #A05C4A;
    border: 2px solid #FFFFFF;
    box-shadow: 4px 4px 8px rgba(0,0,0,0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    z-index: 2;
  }
  
  .region-marker:hover {
    transform: translate(-50%, -50%) scale(1.1) rotate(0deg);
    box-shadow: 6px 6px 12px rgba(0,0,0,0.2);
    background-color: #5d342f;
  }
  
  .region-marker::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border-radius: 0;
    transform: translate(-50%, -50%) scale(0) rotate(-15deg);
    background-color: rgba(160, 92, 74, 0.2);
    transition: transform 0.6s ease;
  }
  
  .region-marker:hover::after {
    transform: translate(-50%, -50%) scale(1) rotate(-15deg);
  }
  
  /* Animation for entry/exit */
  @keyframes fadeInMap {
    from {
      opacity: 0;
      transform: translateY(30px) rotate(15deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(15deg);
    }
  }
  
  .region-marker {
    animation: fadeInMap 1.2s ease forwards;
  }
`

export default MapPage;