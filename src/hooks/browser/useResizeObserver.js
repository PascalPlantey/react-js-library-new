import { useEffect } from "react";

/**
 * Custom React hook that attaches a ResizeObserver to a referenced DOM element.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref object pointing to the DOM element to observe.
 * @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} callback - 
 *   Callback function to be executed when the observed element is resized.
 *
 * @returns {void}
 */
const useResizeObserver = (ref, callback) =>
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.ResizeObserver(callback);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);

export default useResizeObserver;