import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import './doc.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Karnataka', 'Maharashtra', 'Tamil Nadu',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function DocSignUp() {
  const navigate = useNavigate();
  const { refresh, user, role, loading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && user && role === 'doctor') {
      navigate('/for-doctors/profile', { replace: true });
    }
  }, [authLoading, user, role]);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [experience, setExperience] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const progressPercent = (step / 4) * 100;

  const step1Valid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    address.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    postalCode.trim().length > 0 &&
    experience.trim().length > 0 &&
    dateOfBirth.trim().length > 0;

  const step3Valid = password.length >= 8 && password === confirmPassword;

  async function handleCreateAccount() {
    if (!step3Valid) return;
    setSaving(true);
    setError(null);

    const { data: existingPhone } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (existingPhone) {
      setSaving(false);
      setError('An account with this phone number already exists.');
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError || !authData.user) {
      setSaving(false);
      setError(authError?.message ?? 'Could not create account.');
      return;
    }

    const newUserId = authData.user.id;

    const { error: usersError } = await supabase.from('users').insert({
      id: newUserId,
      full_name: fullName,
      phone,
      role: 'doctor'
    });

    if (usersError) {
      setSaving(false);
      setError(usersError.message);
      return;
    }

    const { error: doctorsError } = await supabase.from('doctors').insert({
      user_id: newUserId,
      years_experience: Number(experience),
      registration_number: null,
      city,
      postal_code: postalCode
    });

    if (doctorsError) {
      setSaving(false);
      setError(doctorsError.message);
      return;
    }

    setUserId(newUserId);
    setSaving(false);
    setStep(3);
  }

  async function handleLogin() {
    setLoggingIn(true);
    setLoginError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    });

    if (signInError) {
      setLoggingIn(false);
      setLoginError(signInError.message);
      return;
    }

    await refresh();
    const { role } = useAuthStore.getState();

    setLoggingIn(false);

    if (role !== 'doctor') {
      setLoginError('This account is not registered as a doctor.');
      return;
    }

    navigate('/for-doctors/profile');
  }

  async function handlePhotoContinue() {
    if (!userId) return;

    if (photoFile) {
      setSaving(true);
      const filePath = `${userId}/${photoFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, photoFile, { upsert: true });

      if (uploadError) {
        setSaving(false);
        setError(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      await supabase
        .from('users')
        .update({ profile_picture_url: publicUrlData.publicUrl })
        .eq('id', userId);

      setSaving(false);
    }

    setStep(4);
  }

  if (!authLoading && user && role === 'doctor') {
    return null;
  }

  return (
    <div className="doc-signup-layout">
      <div className="doc-signup-form-panel">
        <div className="doc-logo">
          <i className="fa-solid fa-user-doctor"></i>
        </div>

        <div className="doc-mode-toggle">
          <button
            className={mode === 'signup' ? 'doc-mode-tab doc-mode-tab-active' : 'doc-mode-tab'}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
          <button
            className={mode === 'login' ? 'doc-mode-tab doc-mode-tab-active' : 'doc-mode-tab'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
        </div>

        {mode === 'login' ? (
          <div>
            <h1 className="doc-heading">Welcome Back</h1>
            <p className="doc-subtitle">Login to manage your Epidise doctor profile</p>

            <div className="doc-field">
              <label>Email<span className="required">*</span></label>
              <input type="email" placeholder="Enter email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>

            <div className="doc-field">
              <label>Password<span className="required">*</span></label>
              <input type="password" placeholder="Enter password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>

            {loginError && <p>{loginError}</p>}

            <button
              className="doc-submit-btn"
              disabled={!loginEmail || !loginPassword || loggingIn}
              onClick={handleLogin}
            >
              {loggingIn ? 'Logging in...' : 'Login'}
            </button>
          </div>
        ) : (
          <div>
        <h1 className="doc-heading">Create Your Doctor Account</h1>
        <p className="doc-subtitle">Join thousands of verified doctors on Epidise platform</p>

        <div className="doc-step-indicator">
          <span>Step {step} of 4</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="doc-progress-track">
          <div className="doc-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {error && <p>{error}</p>}

        {step === 1 && (
          <div>
            <div className="doc-form-grid">
              <div className="doc-field">
                <label>Name<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-user"></i>
                  <input type="text" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>Email<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-envelope"></i>
                  <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>Contact<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-phone"></i>
                  <input type="tel" placeholder="Enter contact number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>Address<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-location-dot"></i>
                  <input type="text" placeholder="Enter address details" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>City<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-city"></i>
                  <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>State<span className="required">*</span></label>
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="doc-field">
                <label>Postal Code<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-hashtag"></i>
                  <input type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>Experience<span className="required">*</span></label>
                <div className="doc-input-wrapper">
                  <i className="fa-solid fa-briefcase-medical"></i>
                  <input type="number" placeholder="e.g. 5 years total practice" value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
              </div>

              <div className="doc-field">
                <label>Date of Birth</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
            </div>

            <button className="doc-submit-btn" disabled={!step1Valid} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="doc-field">
              <label>Password<span className="required">*</span></label>
              <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="doc-field">
              <label>Confirm Password<span className="required">*</span></label>
              <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <button className="doc-submit-btn" disabled={!step3Valid || saving} onClick={handleCreateAccount}>
              {saving ? 'Creating account...' : 'Set Password'}
            </button>
            <button className="doc-back-link" onClick={() => setStep(1)}>Back to account details</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Upload Profile Picture</label>
            <p className="doc-subtitle">Add a professional photo to build trust with your patients</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
            <button className="doc-submit-btn" onClick={handlePhotoContinue} disabled={saving}>
              {saving ? 'Uploading...' : 'Continue'}
            </button>
            <button className="doc-back-link" onClick={() => setStep(4)}>Skip for now</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="doc-heading">Welcome to Epidise Community!</h2>
            <p className="doc-subtitle">Your doctor profile has been created. To start consulting with patients and receiving appointments, you need to complete the KYC verification process.</p>
            <p className="doc-subtitle">KYC verification typically takes 8-15 minutes to complete.</p>
            <button className="doc-submit-btn" onClick={() => navigate('/for-doctors/profile')}>Go to My Profile</button>
          </div>
        )}
          </div>
        )}
      </div>

      <div className="doc-side-panel">
        <div className="doc-side-icon">
          <i className="fa-solid fa-hand-holding-heart"></i>
        </div>
        <h2>Welcome to Epidise</h2>
        <p>Connect with care seekers, grow your practice, and transform your healthcare experience with our beautifully independent platform.</p>
        <div className="doc-stats">
          <div>
            <div className="doc-stat-value">1000+</div>
            <div className="doc-stat-label">Verified Doctors</div>
          </div>
          <div>
            <div className="doc-stat-value">50K+</div>
            <div className="doc-stat-label">Happy Patients</div>
          </div>
        </div>
      </div>
    </div>
  );
}
