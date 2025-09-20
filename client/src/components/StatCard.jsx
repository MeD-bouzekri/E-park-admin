export default function StatCard({ title, value, subtitle, className = "bg-white" }){
  return (
    <div className={`p-5 rounded-xl shadow-card ${className}`}>
      <div className="text-dashboard-blue/60 text-sm">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-dashboard-blue">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-dashboard-blue/40">{subtitle}</div>}
    </div>
  );
}
