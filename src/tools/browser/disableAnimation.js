/**
 * Disables CSS transitions and animations on all elements by injecting a style tag.
 * https://github.com/pacocoursey/next-themes/blob/main/packages/next-themes/src/index.tsx#L285
 * 
 * This function creates and appends a style element to the document head that prevents
 * all CSS transitions on every element in the DOM, including pseudo-elements (::before, ::after).
 * 
 * @returns {Function} A cleanup function that removes the injected style tag and re-enables animations.
 *                     The cleanup function forces a style recalculation and waits for the next tick
 *                     before removing the style element to ensure proper browser rendering.
 * 
 * @example
 * const enableAnimations = disableAnimation();
 * // Perform operations without animations
 * enableAnimations(); // Re-enable animations
 */
const disableAnimation = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => { document.head.removeChild(css); }, 1);
  };
};

export default disableAnimation;