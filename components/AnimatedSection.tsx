import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  stagger = 100,
  delay = 0,
}) => {
  const [setRef, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={setRef} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        // CSS transition for smooth entry
        const transitionProperties = 'opacity 700ms cubic-bezier(0.21, 1.02, 0.73, 1), transform 700ms cubic-bezier(0.21, 1.02, 0.73, 1)';
        
        const element = child as React.ReactElement<any>;

        // Ensure we don't crash if the child has no style prop
        const existingStyle = element.props.style || {};

        const style = {
          ...existingStyle,
          transition: transitionProperties,
          transitionDelay: `${delay + index * stagger}ms`,
          opacity: isVisible ? 1 : 0,
          // Fade Up effect: Moves from 24px down to 0px
          transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        };

        return React.cloneElement(element, { style });
      })}
    </div>
  );
};

export default AnimatedSection;