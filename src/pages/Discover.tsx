import { useState, useRef } from 'react';
import { useDiscoverDoctors } from "../hooks/useDiscoverDoctors";
import DiscoverHeader from '../components/discover/DiscoverHeader';
import FilterSidebar from '../components/discover/FilterSidebar';
import DoctorCard from '../components/discover/DoctorCard';
import BookingPanel from '../components/discover/BookingPanel';
import './Discover.css'; 

export default function Discover() {
  const { 
    doctors, 
    loading, 
    userLocation, 
    setUserLocation,
    specialtyFilter,
    setSpecialtyFilter,
    maxFee,
    setMaxFee,
    genderFilter,
    setGenderFilter,
    languageFilter, setLanguageFilter
  } = useDiscoverDoctors();
  
  // UI State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Ref for mobile auto-scroll to the booking panel
  const bookingPanelRef = useRef<HTMLDivElement>(null);

  const handleDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc);
    // Smooth scroll only triggers when the panel is stacked vertically (900px or below)
    if (window.innerWidth <= 900 && bookingPanelRef.current) {
      bookingPanelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="discover-layout">
      {/* Top Search & Header */}
      <div className="discover-header-area">
        <DiscoverHeader />
        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle-btn"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Filters</span>
        </button>
      </div>

      <div className="discover-grid">
        {/* Left Column: Filters */}
        <aside className={`discover-filters ${isMobileFilterOpen ? 'open' : ''}`}>
          <button className="filter-close-btn" onClick={() => setIsMobileFilterOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
            <span>Close</span>
          </button>
          <FilterSidebar 
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            specialtyFilter={specialtyFilter}
            setSpecialtyFilter={setSpecialtyFilter}
            maxFee={maxFee}
            setMaxFee={setMaxFee}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            languageFilter={languageFilter}
            setLanguageFilter={setLanguageFilter}
          />
        </aside>

        {/* Overlay for mobile filter drawer */}
        {isMobileFilterOpen && (
          <div className="filter-overlay" onClick={() => setIsMobileFilterOpen(false)}></div>
        )}

        {/* Middle Column: Doctor List */}
        <main className="discover-list">
          {loading ? (
            <p>Loading specialists...</p>
          ) : (
            doctors.map((doc: any) => (
              <DoctorCard 
                key={doc.id} 
                doctor={doc} 
                onSelect={() => handleDoctorSelect(doc)} 
                isSelected={selectedDoctor?.id === doc.id}
              />
            ))
          )}
        </main>

        {/* Right Column: Scheduling */}
        <aside className="discover-booking" ref={bookingPanelRef}>
          {selectedDoctor ? (
            <BookingPanel doctor={selectedDoctor} />
          ) : (
            <div className="empty-booking-state glass-bg">
              <p>Select a doctor to view available slots</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
