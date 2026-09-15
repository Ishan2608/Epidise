// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/global/NavBar';
import Footer from './components/global/Footer';

import Home from './pages/Home';
import Discover from './pages/Discover';
import DocSignUp from './pages/DocSignUp';
import Contact from './pages/Contact';
import DocProfile from './pages/DocProfile';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/for-doctors" element={<DocSignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor-profile" element={<DocProfile />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
