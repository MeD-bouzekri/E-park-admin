import { NavLink } from 'react-router-dom';
const NavItem = ({to,children}) => (<NavLink to={to} className={({isActive})=>`sidebar-link ${isActive?'active':''}`}>{children}</NavLink>);
export default function Sidebar({ liveOccupancy=0 }){
  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-1 mt-4">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/zones">Zones</NavItem>
        <NavItem to="/facilities">Facilities</NavItem>
        <NavItem to="/transactions">Transactions</NavItem>
        <NavItem to="/alerts">Alerts</NavItem>
        <NavItem to="/settings">Settings</NavItem>
      </nav>
  {/* Removed copyright for cleaner UI */}
    </aside>
  );
}
