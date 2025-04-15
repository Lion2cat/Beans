import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  previousSectionId?: string;
  currentSectionId: string;
  nextSectionId?: string;
  isVisible: boolean;
  scrollProgress: number;
}

/**
 * SectionTransition component - Creates decorative transitions between page sections
 * This component handles specific transition effects between different sections
 */
const SectionTransition: React.FC<SectionTransitionProps> = ({
  previousSectionId,
  currentSectionId,
  nextSectionId,
  isVisible,
  scrollProgress
}) => {
  // Get transition styles based on the sections that are being connected
  const getTransitionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s ease',
    };

    // Map to Products transition
    if (currentSectionId === 'map-section' && nextSectionId === 'products-section') {
      return {
        ...baseStyle,
        bottom: '-60px',
        height: '120px',
        backgroundImage: 'linear-gradient(to bottom, #FBF7F3, #f7f5f3)',
      };
    }
    
    // Products from Map transition
    if (currentSectionId === 'products-section' && previousSectionId === 'map-section') {
      return {
        ...baseStyle,
        top: '-60px',
        height: '120px',
        backgroundImage: 'linear-gradient(to top, #f7f5f3, #FBF7F3)',
      };
    }
    
    // Hero to About transition
    if (currentSectionId === 'hero-section' && nextSectionId === 'about-section') {
      return {
        ...baseStyle,
        bottom: '-40px',
        height: '80px',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
      };
    }
    
    // Default transition
    return {
      ...baseStyle,
      display: 'none',
    };
  };

  // Special decorative elements for specific transitions
  const getDecorativeElement = () => {
    if (currentSectionId === 'map-section' && nextSectionId === 'products-section') {
      return (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            width: '100px',
            height: '50px',
            background: 'url("/images/coffee-beans-divider.png") no-repeat center center',
            backgroundSize: 'contain',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: scrollProgress > 0.7 ? 1 : 0,
            y: scrollProgress > 0.7 ? 0 : -10
          }}
          transition={{ duration: 0.5 }}
        />
      );
    }
    
    return null;
  };

  return (
    <div style={getTransitionStyle()}>
      {getDecorativeElement()}
    </div>
  );
};

export default SectionTransition; 