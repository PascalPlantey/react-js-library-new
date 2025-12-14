import { useState, useCallback } from "react";

/**
 * useControlled - Hook pour gérer un état contrôlé ou non contrôlé dans un composant React
 * 
 * @param {any} controlledValue - La valeur contrôlée (prop).
 * @param {any} defaultValue - La valeur par défaut si non contrôlé.
 * @param {function} onChange - Callback appelé lors du changement (optionnel).
 * @returns [value, setValue]
 */
const useControlled = (controlledValue, defaultValue, onChange) => {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (newValue) => {
      if (isControlled) {
        onChange && onChange(newValue);
      } else {
        setUncontrolledValue(newValue);
        onChange && onChange(newValue);
      }
    },
    [isControlled, onChange]
  );

  return [value, setValue];
};

export default useControlled;