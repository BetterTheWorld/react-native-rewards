import { useEffect, useRef } from 'react';
import type { RewardsTypes } from '../../types/modules';

interface UseResetEnv {
  keys: RewardsTypes['keys'];
}

export function useResetEnv({ keys }: UseResetEnv) {
  const previousKeysRef = useRef<RewardsTypes['keys'] | null>(null);

  const reset = () => {
    // Reset your app here
  };

  useEffect(() => {
    const previousKeys = previousKeysRef.current;
    let keysChanged = false;

    if (previousKeys) {
      for (const key in keys) {
        if (keys[key as keyof RewardsTypes['keys']] !== process.env[key]) {
          keysChanged = true;
          break;
        }
      }
    }

    if (keysChanged || !previousKeys) {
      // Llama a tu método reset aquí
      reset();
    }

    // Actualiza el ref para la próxima comparación
    previousKeysRef.current = keys;

    // Opcional: Actualiza process.env con las nuevas claves
    Object.entries(keys).forEach(([key, value]) => {
      process.env[key] = value;
    });
  }, [keys]);
}
