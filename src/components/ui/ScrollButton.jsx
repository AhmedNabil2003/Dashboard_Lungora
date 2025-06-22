import { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    mainRef.current = mainElement;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = mainElement;
      
      if (scrollTop > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setAtBottom(true);
      } else {
        setAtBottom(false);
      }
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = () => {
    if (!mainRef.current) return;
    
    if (atBottom) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      mainRef.current.scrollTo({ 
        top: mainRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <button
      onClick={scrollTo}
      className={`fixed right-6 bottom-6 z-[1000] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-400 ${
        visible ? 'opacity-100' : 'opacity-0'
      } bg-blue-500 text-white hover:bg-blue-600`}
      aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
    >
      {atBottom ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
    </button>
  );
};

export default ScrollButton;