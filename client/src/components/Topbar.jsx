export default function Topbar(){
  return (<div className="flex items-center gap-3"><div className="flex-1 max-w-xl"><div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm"><span className="text-slate-400">🔎</span><input className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400" placeholder="Search zones, facilities, plates..."/></div></div><button className="btn">Export</button><div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-900 grid place-items-center font-semibold">OP</div></div>);
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-card">
            <span className="text-dashboard-blue/40">🔍</span>
            <input className="w-full bg-transparent outline-none text-dashboard-blue placeholder-dashboard-blue/50" placeholder="Search zones, facilities, plates..."/>
          </div>
        </div>
        <button className="btn">Export</button>
        <div className="h-9 w-9 rounded-full bg-dashboard-lightgreen text-dashboard-green grid place-items-center font-semibold">OP</div>
      </div>
    );
}
