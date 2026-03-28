import { createContext, useContext } from 'react';

export const BrandContext = createContext<boolean>(true);

export function useShowBrand(): boolean {
  return useContext(BrandContext);
}
