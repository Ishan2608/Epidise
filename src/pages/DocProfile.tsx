import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import './doc.css';

const EPIDISE_APP_URL = 'REPLACE_WITH_APP_LINK';

interface DoctorProfileData {
  id: string;
  isavailable: boolean;
  specialization: string;
  area_of_specialization: string | null;
  years_experience: number;
  languages: string[] | null;
  consultation_fee: number;
  rating_average: number;
  rating_count: number;
  city: string | null;
  postal_code: string | null;
  is_active: boolean;
  kyc_status: string;
  profile_completed: boolean;
  registration_number: string | null;
}

interface AppointmentRow {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  symptoms: string | null;
  patientName: string;
}

interface UserProfileData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  profile_picture_url: string | null;
}

export default function DocProfile() {
  const { user, refresh, signOut } = useAuthStore();
  const navigate = useNavigate();

  const [doctorData, setDoctorData] = useState<DoctorProfileData | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  async function loadProfile() {
    if (!user) return;

    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('id, specialization, area_of_specialization, years_experience, languages, consultation_fee, rating_average, rating_count, city, postal_code, is_active, isavailable, kyc_status, profile_completed, registration_number')
      .eq('user_id', user.id)
      .single();

    const { data: userRow } = await supabase
      .from('users')
      .select('full_name, phone, profile_picture_url')
      .eq('id', user.id)
      .single();

    setDoctorData(doctorRow);
    setUserData(userRow ? { ...userRow, email: user.email ?? null } : null);

    if (doctorRow) {
      if (doctorRow.isavailable) {
        setHasSchedule(true);
      } else {
        const { data: availabilityRows } = await supabase
          .from('weekly_availability')
          .select('id')
          .eq('doctor_id', doctorRow.id)
          .limit(1);

        setHasSchedule((availabilityRows?.length ?? 0) > 0);
      }

      const { data: appointmentRows } = await supabase
        .from('appointments')
        .select('id, user_id, start_time, end_time, status, symptoms')
        .eq('doctor_id', doctorRow.id)
        .eq('status', 'scheduled')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (appointmentRows?.length) {
        const patientIds = [...new Set(appointmentRows.map(a => a.user_id))];

        const { data: patientRows } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', patientIds);

        const nameById = new Map((patientRows ?? []).map(p => [p.id, p.full_name]));

        setUpcomingAppointments(
          appointmentRows.map(a => ({
            id: a.id,
            start_time: a.start_time,
            end_time: a.end_time,
            status: a.status,
            symptoms: a.symptoms,
            patientName: nameById.get(a.user_id) || 'Patient'
          }))
        );
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, [user]);

  async function handleToggleAvailability() {
    if (!user || !doctorData) return;
    setTogglingAvailability(true);

    const newValue = !doctorData.is_active;
    const { error } = await supabase
      .from('doctors')
      .update({ is_active: newValue })
      .eq('user_id', user.id);

    if (!error) {
      setDoctorData({ ...doctorData, is_active: newValue });
    }

    setTogglingAvailability(false);
  }

  async function handleLogout() {
    await signOut();
    navigate('/for-doctors');
  }

  if (loading) {
    return (
      <div className="doc-dashboard">
        <p className="doc-subtitle">Loading your profile...</p>
      </div>
    );
  }

  const displayName = userData?.full_name ? `Dr. ${userData.full_name}` : 'Dr. Unknown';
  const kycDone = doctorData?.kyc_status === 'verified';
  const profileDone = doctorData?.profile_completed === true;

  return (
    <div className="doc-dashboard">
      <div className="doc-dashboard-topbar">
        <h1 className="doc-heading">My Profile</h1>
        <button className="doc-logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>

      <div className="doc-profile-card">
        <div className="doc-profile-header">
          {userData?.profile_picture_url ? (
            <img src={userData.profile_picture_url} alt={displayName} className="doc-profile-avatar" />
          ) : (
            <div className="doc-profile-avatar-placeholder">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
          )}
          <div>
            <h2 className="doc-heading" style={{ fontSize: '1.4rem', marginBottom: 4 }}>{displayName}</h2>
            <p className="doc-subtitle" style={{ marginBottom: 8 }}>
              {doctorData?.specialization || 'Specialization not set'}
              {doctorData?.area_of_specialization ? ` & ${doctorData.area_of_specialization}` : ''}
            </p>
            <div className="doc-status-row" style={{ marginBottom: 0 }}>
              <span className={kycDone ? 'doc-status doc-status-verified' : 'doc-status doc-status-review'}>
                <i className="fa-solid fa-shield-halved"></i> {kycDone ? 'KYC Verified' : `KYC: ${doctorData?.kyc_status ?? 'not started'}`}
              </span>
            </div>
          </div>
        </div>

        <div className="doc-stats-row">
          <div className="doc-stat-block">
            <span className="doc-stat-block-value">{doctorData?.years_experience ?? 0}</span>
            <span className="doc-stat-block-label">Years Experience</span>
          </div>
          <div className="doc-stat-block">
            <span className="doc-stat-block-value">{doctorData?.rating_average ?? 0}</span>
            <span className="doc-stat-block-label">Rating ({doctorData?.rating_count ?? 0} reviews)</span>
          </div>
          <div className="doc-stat-block">
            <span className="doc-stat-block-value">{doctorData?.consultation_fee ? `₹${doctorData.consultation_fee}` : '—'}</span>
            <span className="doc-stat-block-label">Consultation Fee</span>
          </div>
        </div>
      </div>

      {(!kycDone || !profileDone) && (
        <div className="doc-profile-card">
          <h3 className="doc-card-title"><i className="fa-solid fa-list-check"></i> Finish setting up your account</h3>

          {!kycDone && (
            <div className="doc-onboarding-item">
              <div>
                <p className="doc-onboarding-title">Complete KYC Verification</p>
                <p className="doc-subtitle">Confirms your identity and medical credentials.</p>
              </div>
              <button className="doc-secondary-btn" style={{ width: 'auto', margin: 0 }} onClick={() => setShowKycModal(true)}>
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
              <button className="doc-secondary-btn" style={{ width: 'auto', margin: 0 }} onClick={() => navigate('/for-doctors/profile-setup')}>
                Complete Profile
              </button>
            </div>
          )}
        </div>
      )}

      <div className="doc-dashboard-grid">
        <div className="doc-profile-card">
          <h3 className="doc-card-title"><i className="fa-solid fa-calendar-check"></i> Availability</h3>
          <div className="doc-toggle-row">
            <div>
              <p className="doc-onboarding-title">{doctorData?.is_active ? 'Accepting Appointments' : 'On Holiday'}</p>
              <p className="doc-subtitle" style={{ marginBottom: 0 }}>
                {doctorData?.is_active ? 'Patients can book new slots with you.' : 'Your profile is hidden from new bookings.'}
              </p>
            </div>
            <button
              className={doctorData?.is_active ? 'doc-toggle-switch on' : 'doc-toggle-switch'}
              onClick={handleToggleAvailability}
              disabled={togglingAvailability}
            />
          </div>
        </div>

        <div className="doc-profile-card">
          <h3 className="doc-card-title"><i className="fa-solid fa-id-card"></i> Account Details</h3>
          <div className="doc-detail-row">
            <span className="doc-detail-label">Email</span>
            <span className="doc-detail-value">{userData?.email || '—'}</span>
          </div>
          <div className="doc-detail-row">
            <span className="doc-detail-label">Phone</span>
            <span className="doc-detail-value">{userData?.phone || '—'}</span>
          </div>
          <div className="doc-detail-row">
            <span className="doc-detail-label">Registration No.</span>
            <span className="doc-detail-value">{doctorData?.registration_number || '—'}</span>
          </div>
        </div>

        <div className="doc-profile-card">
          <h3 className="doc-card-title"><i className="fa-solid fa-notes-medical"></i> Practice Details</h3>
          <div className="doc-detail-row">
            <span className="doc-detail-label">City</span>
            <span className="doc-detail-value">{doctorData?.city || 'Not set'}</span>
          </div>
          <div className="doc-detail-row">
            <span className="doc-detail-label">Postal Code</span>
            <span className="doc-detail-value">{doctorData?.postal_code || 'Not set'}</span>
          </div>
          <div className="doc-detail-row">
            <span className="doc-detail-label">Languages</span>
            <span className="doc-detail-value">{doctorData?.languages?.join(', ') || 'Not set'}</span>
          </div>
          <button className="doc-secondary-btn" onClick={() => navigate('/for-doctors/profile-setup')}>
            Edit Practice Profile
          </button>
        </div>

        <div className="doc-profile-card">
          <h3 className="doc-card-title"><i className="fa-solid fa-calendar-days"></i> Upcoming Appointments</h3>
          {!kycDone ? (
            <div className="doc-empty-state">
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.5rem', marginBottom: 8, display: 'block' }}></i>
              Complete KYC to start accepting appointments.
              <div>
                <button className="doc-secondary-btn" onClick={() => setShowKycModal(true)}>
                  Complete KYC
                </button>
              </div>
            </div>
          ) : !hasSchedule ? (
            <div className="doc-empty-state">
              <i className="fa-solid fa-calendar-plus" style={{ fontSize: '1.5rem', marginBottom: 8, display: 'block' }}></i>
              Set your availability to start accepting appointments.
              <div>
                <button className="doc-secondary-btn" onClick={() => navigate('/for-doctors/profile-setup')}>
                  Set Timings
                </button>
              </div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div>
              {upcomingAppointments.map(appt => (
                <div className="doc-detail-row" key={appt.id}>
                  <span className="doc-detail-label">
                    {appt.patientName} — {new Date(appt.start_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="doc-detail-value">{appt.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="doc-empty-state">
              <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '1.5rem', marginBottom: 8, display: 'block' }}></i>
              No upcoming appointments.
            </div>
          )}
        </div>
      </div>

      {showKycModal && (
        <div className="doc-modal-overlay" onClick={() => setShowKycModal(false)}>
          <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doc-logo">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <h2 className="doc-heading" style={{ fontSize: '1.4rem' }}>Complete KYC in the Epidise App</h2>
            <p className="doc-subtitle">
              KYC verification is done through the Epidise mobile app. Open the app to verify your identity and credentials.
            </p>
            <a className="doc-submit-btn doc-modal-link" href={EPIDISE_APP_URL} target="_blank" rel="noopener noreferrer">
              Open Epidise App
            </a>
            <button className="doc-back-link" onClick={() => setShowKycModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
