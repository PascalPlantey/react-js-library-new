import { useBoolean } from "../utils";

/**
 * Custom React hook that returns a function to force a component re-render.
 * Utilizes the `useBoolean` hook's toggle method to trigger a state change.
 *
 * @returns {Function} A function that, when called, forces the component to re-render.
 */
const useRender = () => {
  const { toggle : render } = useBoolean();

  return render;
};

export default useRender;
