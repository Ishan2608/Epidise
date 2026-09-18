import './DiscoverHeader.css';

export default function DiscoverHeader() {
  return (
    <div className="discover-header">
      <div className="header-titles">
        <h1>Book Your Dermatology Appointment</h1>
        <p>Connect with certified dermatologists from the comfort of your home.</p>
      </div>
      
      <div className="global-search-container">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input 
          type="text" 
          placeholder="Search for your preferred Dermatologist" 
          className="global-search-input"
        />
      </div>
    </div>
  );
}
