import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import Planets from "./pages/Planets";
import Remedies from "./pages/Remedies";
import Rashis from "./pages/Rashis";
import Nakshatras from "./pages/Nakshatras";
import Testimonials from "./pages/Testimonials";

/** Scroll to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/rashis" element={<Rashis />} />
            <Route path="/nakshatras" element={<Nakshatras />} />
            <Route path="/testimonials" element={<Testimonials />} />
            {/* Fallback: unknown routes go home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
