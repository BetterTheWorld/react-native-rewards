import { useResetEnv } from '../config/useResetEnv';
import { useTokenInit } from '../token/useTokenInit';

export const useInitializers = () => {
  useTokenInit({ automatic: true });
  useResetEnv();
  return null;
};
