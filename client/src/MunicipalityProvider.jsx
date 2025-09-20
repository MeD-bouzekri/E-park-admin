import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './lib/api';

const MunicipalityContext = createContext();

export function MunicipalityProvider({ slug = 'demo', children }) {
  const [municipalityId, setMunicipalityId] = useState(null);
  useEffect(() => {
    api.getMunicipalityId(slug).then(setMunicipalityId);
  }, [slug]);
  return (
    <MunicipalityContext.Provider value={municipalityId}>
      {children}
    </MunicipalityContext.Provider>
  );
}

export function useMunicipalityId() {
  return useContext(MunicipalityContext);
}
