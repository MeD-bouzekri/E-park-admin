import ProgressBar from './ProgressBar';
export default function FacilitiesTable({ facilities=[] }){
  return (<div className="card p-5"><div className="mb-4 text-lg font-semibold">Facilities</div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="text-sm text-slate-500"><th className="py-2">Name</th><th className="py-2">Zone</th><th className="py-2">Occupancy</th><th className="py-2">Price</th><th className="py-2">Sensors</th><th className="py-2">Health</th><th className="py-2">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{facilities.map(f=>(<tr key={f._id} className="text-sm"><td className="py-3 font-medium">{f.name}</td><td>{f.zone?.name || '-'}</td><td className="w-72"><ProgressBar value={Math.round((f.occupied||0)/Math.max(1,f.capacity)*100)} /><div className="mt-1 text-xs text-slate-400">{f.occupied||0}/{f.capacity} spots</div></td><td>{f.pricePerHour} DA/h</td><td>{f.sensorCount || 0}</td><td><span className={`badge ${f.health==='warn'?'bg-amber-100 text-amber-700':f.health==='error'?'bg-rose-100 text-rose-700':'bg-emerald-100 text-emerald-700'}`}>{f.health?.toUpperCase?.()}</span></td><td><div className="flex gap-2"><button className="btn">Edit</button><button className="btn">Disable</button><button className="btn text-rose-600">Delete</button></div></td></tr>))}</tbody></table></div></div>);
    return (
      <div className="p-5 rounded-xl bg-[#F8FAFC] shadow-card">
        <div className="mb-4 text-lg font-semibold text-dashboard-blue">Facilities</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-dashboard-blue/60">
                <th className="py-2">Name</th>
                <th className="py-2">Zone</th>
                <th className="py-2">Occupancy</th>
                <th className="py-2">Price</th>
                <th className="py-2">Sensors</th>
                <th className="py-2">Health</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {facilities.map(f => (
                <tr key={f._id} className="text-sm">
                  <td className="py-3 font-medium text-dashboard-blue">{f.name}</td>
                  <td>{f.zone?.name || '-'}</td>
                  <td className="w-72">
                    <ProgressBar value={Math.round((f.occupied||0)/Math.max(1,f.capacity)*100)} />
                    <div className="mt-1 text-xs text-dashboard-blue/40">{f.occupied||0}/{f.capacity} spots</div>
                  </td>
                  <td>{f.pricePerHour} DA/h</td>
                  <td>{f.sensorCount || 0}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${f.health==='warn'?'bg-[#F97316]/20 text-[#F97316]':f.health==='error'?'bg-[#F43F5E]/20 text-[#F43F5E]':'bg-dashboard-lightgreen text-dashboard-green'}`}>{f.health?.toUpperCase?.()}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn">Edit</button>
                      <button className="btn">Disable</button>
                      <button className="btn text-dashboard-red">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
