import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import Layout from './components/navigation/Layout';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Learn from './pages/Learn';
import Supplementary from './pages/Supplementary';
import Team from './pages/Team';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/supplementary" element={<Supplementary />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
