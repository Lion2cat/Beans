import React, { useEffect, useState, useRef } from 'react';
import SectionTransition from './SectionTransition';
import ScrollIndicator from './ScrollIndicator';

interface SectionData {
  id: string;
  element: HTMLElement;
  inView: boolean;
  progress: number;
  nextSectionId?: string;
  prevSectionId?: string;
}

/**
 * TransitionManager component - Manages all transitions between sections
 * Automatically detects sections with class 'section-container' and adds appropriate transitions
 */
const TransitionManager: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(-1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Set up intersection observer to detect when sections are in view
  useEffect(() => {
    const sectionElements = document.querySelectorAll('.section-container');
    const sectionsArray: SectionData[] = Array.from(sectionElements).map((element, index) => {
      const id = element.id || `section-${index}`;
      return {
        id,
        element: element as HTMLElement,
        inView: false,
        progress: 0,
        nextSectionId: index < sectionElements.length - 1 ? 
          sectionElements[index + 1].id || `section-${index + 1}` : undefined,
        prevSectionId: index > 0 ? 
          sectionElements[index - 1].id || `section-${index - 1}` : undefined
      };
    });
    
    setSections(sectionsArray);
    
    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          
          setSections(prevSections => 
            prevSections.map(section => {
              if (section.id === sectionId) {
                return { 
                  ...section, 
                  inView: entry.isIntersecting,
                };
              }
              return section;
            })
          );
          
          if (entry.isIntersecting) {
            const index = sectionsArray.findIndex(section => section.id === sectionId);
            if (index !== -1) {
              setCurrentSectionIndex(index);
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-10% 0px"
      }
    );
    
    // Observe all sections
    sectionsArray.forEach(section => {
      observerRef.current?.observe(section.element);
    });
    
    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Calculate scroll progress for each section
  useEffect(() => {
    const handleScroll = () => {
      setSections(prevSections => 
        prevSections.map(section => {
          const rect = section.element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate how far the section is through the viewport
          // From 0 (just entered viewport) to 1 (just exited viewport)
          let progress = 0;
          
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            progress = 1 - (rect.top + rect.height/2) / (windowHeight/2);
            progress = Math.max(0, Math.min(1, progress));
          } else if (rect.top > windowHeight) {
            progress = 0;
          } else if (rect.bottom < 0) {
            progress = 1;
          }
          
          return { ...section, progress };
        })
      );
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections.length]);
  
  // If no sections detected, don't render anything
  if (sections.length === 0) {
    return null;
  }
  
  return (
    <>
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          {/* Add transitions between sections */}
          <SectionTransition
            currentSectionId={section.id}
            nextSectionId={section.nextSectionId}
            previousSectionId={section.prevSectionId}
            isVisible={section.inView}
            scrollProgress={section.progress}
          />
          
          {/* Add scroll indicators where appropriate */}
          {section.nextSectionId && section.inView && section.progress < 0.8 && (
            section.id !== 'hero-section' && (
              <ScrollIndicator
                targetSectionId={section.nextSectionId}
                isVisible={section.inView}
                text={
                  section.id === 'about-section' ? 'See our products' :
                  section.id === 'map-section' ? 'Discover our products' :
                  'Continue exploring'
                }
              />
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default TransitionManager; 