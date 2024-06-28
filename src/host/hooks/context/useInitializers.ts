import { useResetEnv } from '../config/useResetEnv';
import { useTokenInit } from '../token/useTokenInit';

export const useInitializers = () => {
  useTokenInit();
  useResetEnv();
  return null;
};
