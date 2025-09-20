export default function AlertsList({ alerts=[] }){
  return (<div className="space-y-4">{alerts.map(a=>(<div key={a._id} className="card p-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${a.severity==='high'?'bg-rose-500':a.severity==='med'?'bg-amber-500':'bg-emerald-500'}`} /><div><div className="font-medium">{a.title}</div><div className="text-sm text-slate-500">{a.category || 'sensor'} · {a.timeAgo || 'just now'}</div></div></div><button className="btn">Acknowledge</button></div>))}</div>);
    return (
      <div className="space-y-4">
        {alerts.map(a => (
          <div key={a._id} className="p-4 rounded-xl bg-white shadow-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${a.severity==='high'?'bg-dashboard-red':a.severity==='med'?'bg-dashboard-orange':'bg-dashboard-green'}`} />
              <div>
                <div className="font-medium text-dashboard-blue">{a.title}</div>
                <div className="text-sm text-dashboard-blue/60">{a.category || 'sensor'} · {a.timeAgo || 'just now'}</div>
              </div>
            </div>
            <button className="btn">Acknowledge</button>
          </div>
        ))}
      </div>
    );
}
