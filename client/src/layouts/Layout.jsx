import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/Shared/PageTransition.jsx";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container-app py-6">
        {/* AnimatePresence + PageTransition wrapper */}
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
