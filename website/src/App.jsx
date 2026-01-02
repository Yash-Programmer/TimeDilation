import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/navigation/Layout';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Proposal from './pages/Proposal';
import Learn from './pages/Learn';
import Supplementary from './pages/Supplementary';
import Team from './pages/Team';
import Help from './pages/Help';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import CustomCursor from './components/common/CustomCursor';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/supplementary" element={<Supplementary />} />
          <Route path="/team" element={<Team />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

