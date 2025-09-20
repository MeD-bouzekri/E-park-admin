import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ZonesList from '../components/ZonesList';
import AlertsList from '../components/AlertsList';
import { api } from '../lib/api';
export default function Dashboard(){
  const [summary,setSummary]=useState(null);
  const [zones,setZones]=useState([]);
  const [alerts,setAlerts]=useState([]);
  const [municipalityId, setMunicipalityId] = useState(null);

  useEffect(() => {
    api.getMunicipalityId('demo').then(id => {
      setMunicipalityId(id);
    });
  }, []);

  useEffect(() => {
    if (!municipalityId) return;
    api.summary(municipalityId).then(setSummary);
    api.zones(municipalityId).then(setZones);
    api.alerts(municipalityId).then(d => setAlerts(d.items || []));
  }, [municipalityId]);
  const live = summary?.occupancyPct || 0;
  return (
    <Layout live={live}>
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Occupancy"
          value={`${summary?.occupancyPct ?? 0}%`}
          subtitle={`${summary?.activeSessions ?? 0} / ${summary?.totalCapacity ?? 0} spots`}
          className="bg-gradient-to-br from-[#22C55E] to-[#059669] text-white"
        />
        <StatCard
          title="Revenue (today)"
          value={`${(summary?.revenueToday||0).toLocaleString('en-DZ')} DA`}
          subtitle="Across all zones"
          className="bg-gradient-to-br from-[#38BDF8] to-[#0F172A] text-white"
        />
        <StatCard
          title="Open Alerts"
          value={summary?.openAlerts ?? 0}
          subtitle="Needs attention"
          className="bg-gradient-to-br from-[#F97316] to-[#F43F5E] text-white"
        />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-5">
          <div className="text-lg font-semibold mb-3">Live Map</div>
          <div className="grid place-items-center h-[360px] rounded-xl border border-slate-100 text-slate-500">Map placeholder – integrate Leaflet/Mapbox</div>
          <div className="mt-3 flex gap-2">
            <span className="badge bg-emerald-100 text-emerald-700">Many spots</span>
            <span className="badge bg-amber-100 text-amber-700">Few</span>
            <span className="badge bg-rose-100 text-rose-700">Full</span>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-lg font-semibold mb-3">Zones</div>
          <ZonesList zones={zones} />
        </div>
      </div>
      <div className="mt-6">
        <div className="text-lg font-semibold mb-3">Alerts</div>
        <AlertsList alerts={alerts} />
      </div>
    </Layout>
  );
}
