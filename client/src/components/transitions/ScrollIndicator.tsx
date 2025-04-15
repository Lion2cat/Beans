import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  targetSectionId: string;
  text?: string;
  isVisible: boolean;
  position?: 'top' | 'bottom';
  color?: string;
}

/**
 * ScrollIndicator component - Provides a visual indicator to guide users to scroll
 * to the next section of the page
 */
const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  targetSectionId, 
  text = 'Scroll for more', 
  isVisible = true,
  position = 'bottom',
  color = '#5C3D2E'
}) => {
  const handleClick = () => {
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="scroll-indicator"
      style={{
        position: 'absolute',
        [position]: position === 'bottom' ? '60px' : '30px',
        left: '45%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5,
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(3px)',
        padding: '8px 15px',
        borderRadius: '20px',
      }}
      initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : position === 'bottom' ? 20 : -20
      }}
      transition={{ delay: 0.3, duration: 0.5 }}
      whileHover={{ y: position === 'bottom' ? 5 : -5 }}
      onClick={handleClick}
    >
      {text && (
        <p style={{
          fontSize: '0.9rem',
          color: color,
          margin: '0 0 8px 0',
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic'
        }}>
          {text}
        </p>
      )}
      <motion.div
        animate={{ 
          y: position === 'bottom' ? [0, 10, 0] : [0, -10, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut" 
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            transform: position === 'top' ? 'rotate(180deg)' : 'none' 
          }}
        >
          <path 
            d="M7 10L12 15L17 10" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator; 