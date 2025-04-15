import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';

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
    borderRadius: '50%',
    backgroundColor: selectedRegion === region.id ? '#5d342f' : '#a05c4a',
    border: '3px solid #fff',
    transform: `translate(-50%, -50%) scale(${mapLoaded ? 1 : 0})`,
    transformOrigin: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selectedRegion === region.id ? '0 0 0 8px rgba(93, 52, 47, 0.3)' : '0 4px 15px rgba(0,0,0,0.25)',
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Coffee Bean Origins</h1>
        <p style={{ color: '#666', maxWidth: '500px' }}>
          Explore our interactive map to discover the unique coffee growing regions around the world
          and learn about the distinctive characteristics of each region's beans.
        </p>
      </div>

      <motion.div
        ref={constraintsRef}
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          style={mapContainerStyle}
          initial={{ x: 0, y: 0 }}
          animate={{ x: x.get(), y: y.get() }}
        >
          {regions.map((region) => (
            <motion.div
              key={region.id}
              className="region-marker"
              style={markerStyle(region)}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedRegion(region.id)}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ color: 'white', fontWeight: 'bold', fontSize: '10px' }}
              >
                {region.name.charAt(0)}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
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

export default MapPage;