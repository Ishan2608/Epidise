import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KYCService } from '../services/kyc/KYCService';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import './doc.css';

const kycService = new KYCService();

type StepStatus = 'idle' | 'checking' | 'verified' | 'failed' | 'manual_review';

function StatusBadge({ status }: { status: StepStatus }) {
  if (status === 'verified') return <div className="doc-status doc-status-verified"><i className="fa-solid fa-circle-check"></i> Verified</div>;
  if (status === 'manual_review') return <div className="doc-status doc-status-review"><i className="fa-solid fa-clock"></i> Under manual review</div>;
  if (status === 'failed') return <div className="doc-status doc-status-failed"><i className="fa-solid fa-circle-xmark"></i> Verification failed</div>;
  return null;
}

export default function DocKYC() {
  const { user, refresh } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [aadhaarName, setAadhaarName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarStatus, setAadhaarStatus] = useState<StepStatus>('idle');
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState<StepStatus>('idle');
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const [medicalCollegeName, setMedicalCollegeName] = useState('');
  const [degreeTitle, setDegreeTitle] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [qualificationFile, setQualificationFile] = useState<File | null>(null);
  const [qualificationUploaded, setQualificationUploaded] = useState(false);
  const [qualificationError, setQualificationError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [practiceCity, setPracticeCity] = useState('');
  const [practicePostalCode, setPracticePostalCode] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  const progressPercent = (step / 4) * 100;

  async function handleAadhaarVerify() {
    setAadhaarStatus('checking');
    setAadhaarError(null);

    const result = await kycService.verifyDocument({
      documentType: 'AADHAAR',
      documentNumber: aadhaarNumber,
      additionalData: { name: aadhaarName }
    });

    if (result.status === 'VERIFIED') setAadhaarStatus('verified');
    else if (result.status === 'MANUAL_REVIEW' || result.status === 'PENDING') setAadhaarStatus('manual_review');
    else {
      setAadhaarStatus('failed');
      setAadhaarError(result.errorMessage ?? 'Aadhaar verification failed. Check the details and try again.');
    }
  }

  async function handleRegistrationVerify() {
    setRegistrationStatus('checking');
    setRegistrationError(null);

    const result = await kycService.verifyDocument({
      documentType: 'MEDICAL_REGISTRATION',
      documentNumber: registrationNumber
    });

    if (result.status === 'VERIFIED') setRegistrationStatus('verified');
    else if (result.status === 'MANUAL_REVIEW' || result.status === 'PENDING') setRegistrationStatus('manual_review');
    else {
      setRegistrationStatus('failed');
      setRegistrationError(result.errorMessage ?? 'Registration verification failed. Check the details and try again.');
    }
  }

  async function handleQualificationUpload() {
    if (!user || !qualificationFile) return;
    setUploading(true);
    setQualificationError(null);

    const filePath = `${user.id}/${qualificationFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('qualification-documents')
      .upload(filePath, qualificationFile, { upsert: true });

    setUploading(false);

    if (uploadError) {
      setQualificationError(uploadError.message);
      return;
    }

    setQualificationUploaded(true);
  }

  async function handleFinalSubmit() {
    if (!user) return;
    setFinalizing(true);
    setFinalizeError(null);

    const { error: updateError } = await supabase
      .from('doctors')
      .update({
        kyc_status: 'verified',
        aadhaar_name: aadhaarName,
        aadhaar_number: aadhaarNumber,
        registration_number: registrationNumber,
        medical_college_name: medicalCollegeName,
        degree_title: degreeTitle,
        graduation_year: Number(graduationYear),
        city: practiceCity,
        postal_code: practicePostalCode
      })
      .eq('user_id', user.id);

    setFinalizing(false);

    if (updateError) {
      setFinalizeError(updateError.message);
      return;
    }

    await refresh();
    navigate('/for-doctors/profile');
  }

  const qualificationStepValid = medicalCollegeName.trim().length > 0 && degreeTitle.trim().length > 0 && graduationYear.trim().length > 0 && qualificationUploaded;
  const practiceStepValid = practiceCity.trim().length > 0 && practicePostalCode.trim().length > 0;

  return (
    <div className="doc-page">
      <div className="doc-card">
        <div className="doc-logo">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <h1 className="doc-heading">Complete Your KYC Verification</h1>
        <p className="doc-subtitle">This confirms your identity and credentials to patients on Epidise.</p>

        <div className="doc-step-indicator">
          <span>Step {step} of 4</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="doc-progress-track">
          <div className="doc-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {step === 1 && (
          <div className="doc-section">
            <h3 className="doc-section-heading">Identity Verification</h3>
            <div className="doc-field">
              <label>Name as per Aadhaar<span className="required">*</span></label>
              <input type="text" value={aadhaarName} onChange={(e) => setAadhaarName(e.target.value)} />
            </div>
            <div className="doc-field">
              <label>Aadhaar Number<span className="required">*</span></label>
              <input type="text" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} />
            </div>
            <button className="doc-secondary-btn" onClick={handleAadhaarVerify} disabled={aadhaarStatus === 'checking'}>
              {aadhaarStatus === 'checking' ? 'Verifying...' : 'Verify Aadhaar'}
            </button>
            <StatusBadge status={aadhaarStatus} />
            {aadhaarStatus === 'failed' && <p>{aadhaarError}</p>}

            <button className="doc-submit-btn" disabled={aadhaarStatus !== 'verified'} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="doc-section">
            <h3 className="doc-section-heading">Medical Registration Details</h3>
            <div className="doc-field">
              <label>Registration Number<span className="required">*</span></label>
              <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
            </div>
            <button className="doc-secondary-btn" onClick={handleRegistrationVerify} disabled={registrationStatus === 'checking'}>
              {registrationStatus === 'checking' ? 'Verifying...' : 'Verify Registration'}
            </button>
            <StatusBadge status={registrationStatus} />
            {registrationStatus === 'failed' && <p>{registrationError}</p>}

            <button className="doc-submit-btn" disabled={registrationStatus !== 'verified'} onClick={() => setStep(3)}>
              Continue
            </button>
            <button className="doc-back-link" onClick={() => setStep(1)}>Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="doc-section">
            <h3 className="doc-section-heading">Qualification Documents</h3>
            <div className="doc-field">
              <label>Medical College Name<span className="required">*</span></label>
              <input type="text" value={medicalCollegeName} onChange={(e) => setMedicalCollegeName(e.target.value)} />
            </div>
            <div className="doc-field">
              <label>Degree Title<span className="required">*</span></label>
              <input type="text" value={degreeTitle} onChange={(e) => setDegreeTitle(e.target.value)} />
            </div>
            <div className="doc-field">
              <label>Graduation Year<span className="required">*</span></label>
              <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} />
            </div>
            <div className="doc-field">
              <label>Upload Degree Certificate<span className="required">*</span></label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setQualificationFile(e.target.files?.[0] ?? null)} />
            </div>
            <button className="doc-secondary-btn" onClick={handleQualificationUpload} disabled={!qualificationFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
            {qualificationUploaded && <div className="doc-status doc-status-verified"><i className="fa-solid fa-circle-check"></i> Uploaded</div>}
            {qualificationError && <p>{qualificationError}</p>}

            <button className="doc-submit-btn" disabled={!qualificationStepValid} onClick={() => setStep(4)}>
              Continue
            </button>
            <button className="doc-back-link" onClick={() => setStep(2)}>Back</button>
          </div>
        )}

        {step === 4 && (
          <div className="doc-section">
            <h3 className="doc-section-heading">Practice Address</h3>
            <div className="doc-field">
              <label>City<span className="required">*</span></label>
              <input type="text" value={practiceCity} onChange={(e) => setPracticeCity(e.target.value)} />
            </div>
            <div className="doc-field">
              <label>Postal Code<span className="required">*</span></label>
              <input type="text" value={practicePostalCode} onChange={(e) => setPracticePostalCode(e.target.value)} />
            </div>

            {finalizeError && <p>{finalizeError}</p>}

            <button className="doc-submit-btn" disabled={!practiceStepValid || finalizing} onClick={handleFinalSubmit}>
              {finalizing ? 'Submitting...' : 'Complete KYC'}
            </button>
            <button className="doc-back-link" onClick={() => setStep(3)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
