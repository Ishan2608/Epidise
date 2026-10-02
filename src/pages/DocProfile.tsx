import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import './doc.css';

interface DoctorProfileData {
  primary_practice_name: string | null;
  specialization: string;
  area_of_specialization: string | null;
  years_experience: number;
  languages: string[] | null;
  consultation_fee: number;
  rating_average: number;
  rating_count: number;
  city: string | null;
  is_active: boolean;
  kyc_status: string;
  profile_completed: boolean;
}

interface UserProfileData {
  full_name: string | null;
  profile_picture_url: string | null;
}

export default function DocProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [doctorData, setDoctorData] = useState<DoctorProfileData | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data: doctorRow } = await supabase
        .from('doctors')
        .select('primary_practice_name, specialization, area_of_specialization, years_experience, languages, consultation_fee, rating_average, rating_count, city, is_active, kyc_status, profile_completed')
        .eq('user_id', user.id)
        .single();

      const { data: userRow } = await supabase
        .from('users')
        .select('full_name, profile_picture_url')
        .eq('id', user.id)
        .single();

      setDoctorData(doctorRow);
      setUserData(userRow);
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="doc-page">
        <div className="doc-card">
          <p className="doc-subtitle">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const displayName = userData?.full_name ? `Dr. ${userData.full_name}` : 'Dr. Unknown';
  const kycDone = doctorData?.kyc_status === 'verified';
  const profileDone = doctorData?.profile_completed === true;

  return (
    <div className="doc-page">
      <div className="doc-card">
        <div className="doc-profile-header">
          {userData?.profile_picture_url ? (
            <img src={userData.profile_picture_url} alt={displayName} className="doc-profile-avatar" />
          ) : (
            <div className="doc-profile-avatar-placeholder">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
          )}
          <div>
            <h1 className="doc-heading">{displayName}</h1>
            <p className="doc-subtitle">
              {doctorData?.specialization || 'Specialization not set'}
              {doctorData?.area_of_specialization ? ` & ${doctorData.area_of_specialization}` : ''}
            </p>
          </div>
        </div>

        {(!kycDone || !profileDone) && (
          <div className="doc-section">
            <h3 className="doc-section-heading">Finish setting up your account</h3>

            {!kycDone && (
              <div className="doc-onboarding-item">
                <div>
                  <p className="doc-onboarding-title">Complete KYC Verification</p>
                  <p className="doc-subtitle">Confirms your identity and medical credentials.</p>
                </div>
                <button className="doc-secondary-btn" onClick={() => navigate('/for-doctors/kyc')}>
                  Start KYC
                </button>
              </div>
            )}

            {!profileDone && (
              <div className="doc-onboarding-item">
                <div>
                  <p className="doc-onboarding-title">Complete Practice Profile</p>
                  <p className="doc-subtitle">Specialization, languages, fee and city — needed to appear on Discover.</p>
                </div>
                <button className="doc-secondary-btn" onClick={() => navigate('/for-doctors/profile-setup')}>
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        )}

        <div className="doc-status-row">
          <span className={kycDone ? 'doc-status doc-status-verified' : 'doc-status doc-status-review'}>
            <i className="fa-solid fa-shield-halved"></i> KYC: {doctorData?.kyc_status ?? 'not_started'}
          </span>
          <span className={doctorData?.is_active ? 'doc-status doc-status-verified' : 'doc-status doc-status-review'}>
            <i className="fa-solid fa-circle"></i> {doctorData?.is_active ? 'Accepting appointments' : 'On holiday'}
          </span>
        </div>

        <div className="doc-section">
          <h3 className="doc-section-heading">Practice Details</h3>
          <div className="doc-form-grid">
            <div>
              <p className="doc-subtitle">Experience</p>
              <p>{doctorData?.years_experience ?? 0} years</p>
            </div>
            <div>
              <p className="doc-subtitle">Consultation Fee</p>
              <p>{doctorData?.consultation_fee ? `₹${doctorData.consultation_fee}` : 'Not set'}</p>
            </div>
            <div>
              <p className="doc-subtitle">City</p>
              <p>{doctorData?.city || 'Not set'}</p>
            </div>
            <div>
              <p className="doc-subtitle">Languages</p>
              <p>{doctorData?.languages?.join(', ') || 'Not set'}</p>
            </div>
            <div>
              <p className="doc-subtitle">Rating</p>
              <p>{doctorData?.rating_average ?? 0} ({doctorData?.rating_count ?? 0} reviews)</p>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h3 className="doc-section-heading">Upcoming Appointments</h3>
          <p className="doc-subtitle">Appointment booking data isn't wired up yet.</p>
        </div>

        {profileDone && (
          <button className="doc-secondary-btn" onClick={() => navigate('/for-doctors/profile-setup')}>
            Edit Practice Profile
          </button>
        )}
      </div>
    </div>
  );
}
