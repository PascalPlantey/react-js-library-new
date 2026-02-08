import { useState, useCallback } from "react";
import usePrev from "./usePrev";

/**
 * useControlled - Hook pour gérer un état contrôlé ou non contrôlé dans un composant React
 * 
 * @param {any} controlledValue - La valeur contrôlée (prop).
 * @param {any} defaultValue - La valeur par défaut si non contrôlé.
 * @param {function} onChange - Callback appelé lors du changement (optionnel).
 * @returns {[any, function]} Un tableau contenant la valeur actuelle et une fonction pour la mettre à jour.
 */
const useControlled = (controlledValue, defaultValue, onChange) => {
  const isControlled = controlledValue !== undefined;
  const [wasControlled, isFirstRender] = usePrev(isControlled);

  if (!isFirstRender && wasControlled !== isControlled)
    console.warn(
      `useControlled: Le composant est passé de ${wasControlled ? 'contrôlé' : 'non contrôlé'} à ${isControlled ? 'contrôlé' : 'non contrôlé'}. ` +
      `Cela peut entraîner des comportements inattendus.`
    );

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (newValue) => {
      if (!isControlled)
        setUncontrolledValue(newValue);
      if (onChange)
        onChange(newValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
};

export default useControlled;