import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AlertsList from '../components/AlertsList';
import { api } from '../lib/api';
import { useMunicipalityId } from '../MunicipalityProvider';
export default function Alerts(){
  const [alerts,setAlerts]=useState([]); const [live,setLive]=useState(0);
  const municipalityId = useMunicipalityId();
  useEffect(()=>{
    if (!municipalityId) return;
    Promise.all([api.alerts(municipalityId), api.zones(municipalityId)]).then(([a,z])=>{ setAlerts(a.items||[]); const cap=z.reduce((s,a)=>s+a.capacity,0); const occ=z.reduce((s,a)=>s+(a.occupied||0),0); setLive(cap?Math.round(occ/cap*100):0); });
  },[municipalityId]);
  return (<Layout live={live}><div className="text-2xl font-semibold mb-4">Alerts</div><AlertsList alerts={alerts}/></Layout>);
}
