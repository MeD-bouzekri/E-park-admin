import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import FacilitiesTable from '../components/FacilitiesTable';
import { api } from '../lib/api';
import { useMunicipalityId } from '../MunicipalityProvider';
export default function Facilities(){
  const [facilities,setFacilities]=useState([]); const [live,setLive]=useState(0);
  const municipalityId = useMunicipalityId();
  useEffect(()=>{
    if (!municipalityId) return;
    Promise.all([api.facilities(municipalityId), api.zones(municipalityId)]).then(([f,z])=>{ setFacilities(f); const cap=z.reduce((s,a)=>s+a.capacity,0); const occ=z.reduce((s,a)=>s+(a.occupied||0),0); setLive(cap?Math.round(occ/cap*100):0); });
  },[municipalityId]);
  return (<Layout live={live}><FacilitiesTable facilities={facilities}/></Layout>);
}
