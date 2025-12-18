import React, { useEffect, useRef } from 'react';

export const useFocusTrap = <T extends HTMLElement>(onClose: () => void): React.RefObject<T> => {
  const ref = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const focusableElements = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (firstElement) {
        firstElement.focus();
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
          return;
        }

        if (event.key === 'Tab' && focusableElements.length > 1) {
          // Only trap focus if it's currently inside the modal.
          // This is important because the listener is on the document.
          if (!ref.current?.contains(document.activeElement)) {
            return;
          }

          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };
      
      // Attach listener to the document to reliably catch 'Escape' key presses
      // regardless of which element inside the modal has focus.
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [onClose]);

  return ref;
};