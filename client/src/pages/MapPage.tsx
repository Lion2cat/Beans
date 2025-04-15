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
      image: '/images/colombian-farm.jpg'
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
      image: '/images/brazilian-farm.jpg'
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
      image: '/images/kenyan-farm.jpg'
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
      image: '/images/guatemalan-farm.jpg'
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
    height: '100vh',
    overflow: 'hidden',
    background: '#faf6f2',
  };

  const mapContainerStyle: React.CSSProperties = {
    width: '200%',
    height: '200%',
    position: 'relative',
    backgroundImage: 'url("/images/coffee-map-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: mapLoaded ? 'opacity 0.6s ease' : 'none',
    opacity: mapLoaded ? 1 : 0,
  };

  const markerStyle = (region: CoffeeRegion): React.CSSProperties => ({
    position: 'absolute',
    top: region.location.top,
    left: region.location.left,
    width: selectedRegion === region.id ? '30px' : '22px',
    height: selectedRegion === region.id ? '30px' : '22px',
    borderRadius: '50%',
    backgroundColor: selectedRegion === region.id ? '#5d342f' : '#a05c4a',
    border: '2px solid #fff',
    transform: `translate(-50%, -50%) scale(${mapLoaded ? 1 : 0})`,
    transformOrigin: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selectedRegion === region.id ? '0 0 0 5px rgba(93, 52, 47, 0.3)' : '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: selectedRegion === region.id ? 3 : 2,
    transition: 'all 0.3s ease',
  });

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    zIndex: 5,
    opacity: mapLoaded ? 1 : 0,
    transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontFamily: '"Playfair Display", serif',
    color: '#5d342f',
    margin: '0 0 10px 0',
  };

  const detailCardStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
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
    left: '15px',
    top: '45px',
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

      <div style={{
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
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        borderRadius: '8px'
      }}>
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '1rem',
          color: '#5d342f',
          marginBottom: '1rem',
          fontStyle: 'italic'
        }}>
          Drag to explore coffee regions. Click on markers to learn more.
        </p>
      </div>

      <AnimatePresence>
        <div style={detailCardStyle}>
          {selectedRegionData && (
            <>
              <img 
                src={selectedRegionData.image} 
                alt={selectedRegionData.name} 
                style={imageStyle} 
              />
              <div style={infoStyle}>
                <h3 style={regionNameStyle}>{selectedRegionData.name}</h3>
                <p style={descriptionStyle}>{selectedRegionData.description}</p>
                
                <div style={flavorCardStyle}>
                  <div style={{ position: 'relative' }}>
                    <span style={flavorTitleStyle}>FLAVOR</span>
                    <ul style={flavorListStyle}>
                      {selectedRegionData.flavors.map((flavor, idx) => (
                        <li key={idx}>{flavor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#5d342f' }}>Info</h4>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Altitude</span>
                  <span style={infoValueStyle}>{selectedRegionData.altitude}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Varietal</span>
                  <span style={infoValueStyle}>{selectedRegionData.varieties.join(', ')}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Process</span>
                  <span style={infoValueStyle}>{selectedRegionData.process}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      marginRight: '10px'
                    }}
                    onClick={() => window.location.href = `/beans?region=${selectedRegionData.id}`}
                  >
                    View Beans
                  </button>
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: 'transparent',
                      color: '#a05c4a',
                      border: '1px solid #a05c4a',
                      flex: 1,
                    }}
                    onClick={() => setSelectedRegion(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default MapPage;