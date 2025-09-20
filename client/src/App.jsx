import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Zones from './pages/Zones';
import Facilities from './pages/Facilities';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { MunicipalityProvider } from './MunicipalityProvider';

export default function App() {
	return (
		<MunicipalityProvider slug="demo">
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/zones" element={<Zones />} />
				<Route path="/facilities" element={<Facilities />} />
				<Route path="/transactions" element={<Transactions />} />
				<Route path="/alerts" element={<Alerts />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
		</MunicipalityProvider>
	);
}
