import './DoctorCard.css';

export default function DoctorCard({ doctor, onSelect, isSelected }: { doctor: any, onSelect: () => void, isSelected: boolean }) {
  const displayName = doctor.primary_practice_name || 'Dr. ' + doctor.id.substring(0, 5).toUpperCase();
  const specialty = doctor.specialization + (doctor.area_of_specialization ? ` & ${doctor.area_of_specialization}` : '');
  const languages = doctor.languages?.length ? doctor.languages.join(', ') : 'English';
  
  return (
    <div className={`doctor-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      
      {/* Top Section: Avatar & Info */}
      <div className="doctor-info-section">
        <div className="avatar-container">
          {doctor.profile_picture_url ? (
            <img src={doctor.profile_picture_url} alt={displayName} className="doctor-avatar" />
          ) : (
            <div className="avatar-placeholder">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
          )}
        </div>
        
        <div className="doctor-details">
          <h3 className="doctor-name">{displayName}</h3>
          <p className="doctor-specialty">{specialty}</p>
          
          <div className="doctor-meta">
            <span className="meta-item">
              <i className="fa-solid fa-briefcase medical-icon"></i> {doctor.years_experience || 0} yrs exp
            </span>
            <span className="meta-item">
              <i className="fa-solid fa-location-dot medical-icon"></i> {doctor.postal_code || 'Online'}
            </span>
            <span className="meta-item">
              <i className="fa-solid fa-comments medical-icon"></i> {languages}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Stats & Action Button */}
      <div className="doctor-action-section">
        <div className="doctor-stats">
          <div className="doctor-rating">
            ⭐ {doctor.rating_average || 'New'}
          </div>
          <div className="doctor-fee">
            <strong>₹{doctor.consultation_fee}</strong> / session
          </div>
        </div>
        <button className="view-slots-btn">
          View Slots
        </button>
      </div>

    </div>
  );
}
