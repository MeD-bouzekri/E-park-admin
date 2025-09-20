import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TransactionsTable from '../components/TransactionsTable';
import { api } from '../lib/api';
import { useMunicipalityId } from '../MunicipalityProvider';
export default function Transactions(){
  const [items,setItems]=useState([]); const [live,setLive]=useState(0);
  const municipalityId = useMunicipalityId();
  useEffect(()=>{
    if (!municipalityId) return;
    Promise.all([api.payments(municipalityId), api.zones(municipalityId)]).then(([p,z])=>{ setItems(p.items||[]); const cap=z.reduce((s,a)=>s+a.capacity,0); const occ=z.reduce((s,a)=>s+(a.occupied||0),0); setLive(cap?Math.round(occ/cap*100):0); });
  },[municipalityId]);
  return (<Layout live={live}><TransactionsTable items={items}/></Layout>);
}
