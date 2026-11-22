import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { QRVerifyModal } from '../shared/QRVerifyModal';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { studentProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          onOpenQR={() => setIsQrModalOpen(true)}
          className="hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]"
        />

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative w-72 max-w-[80vw] bg-white dark:bg-navy-900 z-10 shadow-2xl h-full flex flex-col"
              >
                <Sidebar
                  onOpenQR={() => {
                    setMobileMenuOpen(false);
                    setIsQrModalOpen(true);
                  }}
                  className="w-full h-full border-r-0"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      <Footer />

      {/* Student QR Digital Pass Modal */}
      <QRVerifyModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        student={studentProfile}
      />
    </div>
  );
};
