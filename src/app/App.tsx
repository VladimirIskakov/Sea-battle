import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, Game, FleetDeployment} from '@/pages';

function App() {
  return (
    <Router basename="/Sea-battle/">
      <div className="app">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/game" element={<Game />} />
          <Route path="/fleetdep" element={<FleetDeployment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;