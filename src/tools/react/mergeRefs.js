
/**
 * Merges multiple refs into a single ref callback function.
 * 
 * @param {...(Function|Object)} refs - React refs to merge. Can be callback functions or ref objects with a `current` property.
 * @returns {Function} A ref callback function that assigns the node to all provided refs.
 * 
 * @example
 * // Usage with multiple refs
 * const ref1 = useRef();
 * const ref2 = React.createRef();
 * const mergedRef = mergeRefs(ref1, ref2, (node) => console.log(node));
 * 
 * <div ref={mergedRef} />
 */
const mergeRefs = (...refs) => node =>
    refs.forEach(ref => {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    });

export default mergeRefs;