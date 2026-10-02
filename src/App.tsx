// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import DoctorRoute from './routes/DoctorRoute';
import PatientRoute from './routes/PatientRoute';
import NavBar from './components/global/NavBar';
import Footer from './components/global/Footer';

import Home from './pages/Home';
import Discover from './pages/Discover';
import DocSignUp from './pages/DocSignUp';
import DocKYC from './pages/DocKYC';
import DocProfileSetup from './pages/DocProfileSetup';
import DocProfile from './pages/DocProfile';
import Contact from './pages/Contact';

export default function App() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/for-doctors" element={<DocSignUp />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<DoctorRoute />}>
          <Route path="/for-doctors/kyc" element={<DocKYC />} />
          <Route path="/for-doctors/profile-setup" element={<DocProfileSetup />} />
          <Route path="/doctor-profile" element={<DocProfile />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
