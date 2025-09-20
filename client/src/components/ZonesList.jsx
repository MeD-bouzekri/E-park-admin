import ProgressBar from './ProgressBar';
export default function ZonesList({ zones=[] }){
  return (<div className="space-y-4">{zones.map(z=>(<div key={z._id} className="card p-5"><div className="flex items-start justify-between"><div><div className="font-semibold">{z.name}</div><div className="text-sm text-slate-500">{z.code} · {z.capacity} cap</div></div><span className="badge bg-emerald-100 text-emerald-700">{Math.round((z.occupied||0)/Math.max(1,z.capacity)*100)}% occupied</span></div><div className="mt-3"><ProgressBar value={Math.round((z.occupied||0)/Math.max(1,z.capacity)*100)} /></div><div className="mt-2 text-xs text-slate-400">Revenue today: {z.revenueToday?.toLocaleString?.('en-DZ') || 0} DA</div></div>))}</div>);
    return (
      <div className="space-y-4">
        {zones.map(z => (
          <div key={z._id} className="p-5 rounded-xl bg-white shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-dashboard-blue">{z.name}</div>
                <div className="text-sm text-dashboard-blue/60">{z.code} · {z.capacity} cap</div>
              </div>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-dashboard-lightgreen text-dashboard-green">
                {Math.round((z.occupied||0)/Math.max(1,z.capacity)*100)}% occupied
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={Math.round((z.occupied||0)/Math.max(1,z.capacity)*100)} />
            </div>
            <div className="mt-2 text-xs text-dashboard-blue/40">
              Revenue today: {z.revenueToday?.toLocaleString?.('en-DZ') || 0} DA
            </div>
          </div>
        ))}
      </div>
    );
}
