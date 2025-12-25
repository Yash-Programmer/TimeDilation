import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileTabBar from './MobileTabBar';
import { ToastProvider } from '../common/Toast';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isSimulatorPage = location.pathname === '/simulator';

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      <ToastProvider />
      <Navbar />

      <main className={`flex-grow ${isHomePage ? '' : isSimulatorPage ? 'pt-20' : 'pt-32'}`}>
        {children}
      </main>

      <MobileTabBar />
    </div>
  );
};

export default Layout;
