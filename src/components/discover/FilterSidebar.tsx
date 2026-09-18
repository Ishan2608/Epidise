import './FilterSidebar.css';

interface FilterProps {
  userLocation: string;
  setUserLocation: (val: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (val: string) => void;
  maxFee: number;
  setMaxFee: (val: number) => void;
  genderFilter: string;                    // <-- Add this
  setGenderFilter: (val: string) => void;  // <-- Add this
}

export default function FilterSidebar({ 
  userLocation, 
  setUserLocation, 
  specialtyFilter, 
  setSpecialtyFilter, 
  maxFee, 
  setMaxFee,
  genderFilter, setGenderFilter
}: FilterProps) {
  
  return (
    <div className="filter-sidebar">
      
      {/* Gender Filter (Visual Only for now) */}
      <div className="filter-group">
        <div className="filter-header">
          <h4>Gender</h4>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="filter-options">
          <label className="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Male" 
              checked={genderFilter === 'Male'} 
              onChange={(e) => setGenderFilter(e.target.value)} 
            /> Male
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Female" 
              checked={genderFilter === 'Female'} 
              onChange={(e) => setGenderFilter(e.target.value)} 
            /> Female
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Any" 
              checked={genderFilter === 'Any'} 
              onChange={(e) => setGenderFilter(e.target.value)} 
            /> Any
          </label>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <h4>Price Range</h4>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="filter-content">
          <input 
            type="range" 
            min="100" 
            max="1500" 
            step="100"
            value={maxFee} 
            onChange={(e) => setMaxFee(Number(e.target.value))}
            className="range-slider"
          />
          <div className="range-labels">
            <span>₹100</span>
            <span>₹{maxFee}</span>
            <span>₹1500</span>
          </div>
        </div>
      </div>

      {/* Cities / Location Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <h4>Cities / Postal Code</h4>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="filter-content">
          <button className="search-near-me-btn">Search Near Me</button>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="e.g. 440012 or Dehradun" 
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />
            <button className="add-btn">Add</button>
          </div>
          {/* Active Tag */}
          {userLocation && (
            <div className="active-tags">
              <span className="tag">
                {userLocation} <i className="fa-solid fa-xmark" onClick={() => setUserLocation('')}></i>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <h4>Speciality</h4>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="filter-content">
          <div className="search-input-wrapper">
            <select 
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="specialty-select"
            >
              <option value="">All Specialties</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Trichology">Trichology</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
