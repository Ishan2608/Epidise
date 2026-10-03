import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import ScheduleSection from '../components/doctor/ScheduleSection';
import './doc.css';

export default function DocProfileSetup() {
  const { user, refresh } = useAuthStore();
  const navigate = useNavigate();

  const [specialization, setSpecialization] = useState('');
  const [areaOfSpecialization, setAreaOfSpecialization] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [consultationFee, setConsultationFee] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'availability'>('details');

  useEffect(() => {
    async function loadExisting() {
      if (!user) return;

      const { data } = await supabase
        .from('doctors')
        .select('specialization, area_of_specialization, languages, consultation_fee, city, gender')
        .eq('user_id', user.id)
        .single();

      if (data) {
        if (data.specialization) setSpecialization(data.specialization);
        if (data.area_of_specialization) setAreaOfSpecialization(data.area_of_specialization);
        if (data.languages?.length) setLanguages(data.languages);
        if (data.consultation_fee) setConsultationFee(String(data.consultation_fee));
        if (data.city) setCity(data.city);
        if (data.gender) setGender(data.gender);
      }

      setLoadingExisting(false);
    }

    loadExisting();
  }, [user]);

  function addLanguage() {
    const trimmed = languageInput.trim();
    if (!trimmed) return;
    if (languages.some(l => l.toLowerCase() === trimmed.toLowerCase())) {
      setLanguageInput('');
      return;
    }
    setLanguages([...languages, trimmed]);
    setLanguageInput('');
  }

  function removeLanguage(lang: string) {
    setLanguages(languages.filter(l => l !== lang));
  }

  const isFormValid =
    specialization.trim().length > 0 &&
    languages.length > 0 &&
    consultationFee.trim().length > 0 &&
    city.trim().length > 0 &&
    gender.trim().length > 0;

  async function handleSubmit() {
    if (!user || !isFormValid) return;

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('doctors')
      .update({
        specialization,
        area_of_specialization: areaOfSpecialization || null,
        languages,
        consultation_fee: Number(consultationFee),
        city,
        gender,
        profile_completed: true
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refresh();
    navigate('/for-doctors/profile');
  }

  return (
    <div className="doc-page">
      <div className="doc-card">
        <div className="doc-logo">
          <i className="fa-solid fa-stethoscope"></i>
        </div>
        <button className="doc-back-link" style={{ margin: '0 0 16px 0' }} onClick={() => navigate('/for-doctors/profile')}>
          <i className="fa-solid fa-arrow-left"></i> Back to Profile
        </button>

        <h1 className="doc-heading">Complete Your Practice Profile</h1>
        <p className="doc-subtitle">These details are shown to patients browsing Epidise and used for Discover filtering.</p>

        <div className="doc-mode-toggle">
          <button
            className={activeTab === 'details' ? 'doc-mode-tab doc-mode-tab-active' : 'doc-mode-tab'}
            onClick={() => setActiveTab('details')}
          >
            Practice Details
          </button>
          <button
            className={activeTab === 'availability' ? 'doc-mode-tab doc-mode-tab-active' : 'doc-mode-tab'}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
        </div>

        {activeTab === 'details' && (
        <div>
        <div className="doc-field">
          <label>Specialization<span className="required">*</span></label>
          <div className="doc-input-wrapper">
            <i className="fa-solid fa-notes-medical"></i>
            <input type="text" placeholder="e.g. Dermatology" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
          </div>
        </div>

        <div className="doc-field">
          <label>Area of Specialization</label>
          <div className="doc-input-wrapper">
            <i className="fa-solid fa-star"></i>
            <input type="text" placeholder="e.g. Cosmetic Dermatology (optional)" value={areaOfSpecialization} onChange={(e) => setAreaOfSpecialization(e.target.value)} />
          </div>
        </div>

        <div className="doc-field">
          <label>Languages Spoken<span className="required">*</span></label>
          <div className="doc-tag-input-row">
            <input
              type="text"
              placeholder="e.g. Tamil"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
            />
            <button type="button" className="doc-tag-add-btn" onClick={addLanguage}>Add</button>
          </div>
          {languages.length > 0 && (
            <div className="doc-active-tags">
              {languages.map(lang => (
                <span className="doc-tag" key={lang}>
                  {lang}
                  <button type="button" className="doc-tag-remove" onClick={() => removeLanguage(lang)}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="doc-field">
          <label>Consultation Fee<span className="required">*</span></label>
          <div className="doc-input-wrapper">
            <i className="fa-solid fa-indian-rupee-sign"></i>
            <input type="number" placeholder="e.g. 500" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} />
          </div>
        </div>

        <div className="doc-field">
          <label>City<span className="required">*</span></label>
          <div className="doc-input-wrapper">
            <i className="fa-solid fa-city"></i>
            <input type="text" placeholder="e.g. Dehradun" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>

        <div className="doc-field">
          <label>Gender<span className="required">*</span></label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        {error && <p>{error}</p>}

        {loadingExisting && <p className="doc-subtitle">Loading your current details...</p>}

        <button className="doc-submit-btn" onClick={handleSubmit} disabled={!isFormValid || saving || loadingExisting}>
          {saving ? 'Saving...' : 'Complete Profile'}
        </button>
        </div>
        )}

        {activeTab === 'availability' && <ScheduleSection />}
      </div>
    </div>
  );
}
