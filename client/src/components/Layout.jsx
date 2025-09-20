import Topbar from './Topbar';
import Sidebar from './Sidebar';
export default function Layout({ children, live=0 }){
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-dashboard-blue flex flex-col">
      <header className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 justify-start flex-1">
            <img src="/logo.svg" className="h-12 w-12" alt="Logo" />
            <span className="font-extrabold text-3xl text-[#22C55E] border-2 border-[#22C55E] rounded-xl px-3 py-1 bg-white shadow-card">E-park</span>
            <span className="ml-2 text-xl font-semibold text-dashboard-blue/60">Operator</span>
          </div>
          <div className="text-dashboard-blue/60 text-sm">demo</div>
        </div>
      </header>
      <div className="flex flex-1 w-full">
        <Sidebar liveOccupancy={live}/>
        <main className="flex-1 px-6">
          <div className="rounded-2xl bg-white p-4 shadow-card max-w-7xl mx-auto">
            <div className="mb-4 flex items-center justify-end">
              <Topbar/>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
