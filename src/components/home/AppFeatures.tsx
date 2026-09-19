import { useState } from 'react';

export default function AppFeatures() {
  // Manage the state for the active tab to toggle between User and Doctor views
  const [activeTab, setActiveTab] = useState<'user' | 'doctor'>('user');

  return (
    <section className="app-features">
      <div className="toggle-area">
        <div className="toggle-btns mid-center">
          <button
            id="t1"
            className={`txt-md ${activeTab === 'user' ? 'active-toggle' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            For User
          </button>
          <button
            id="t2"
            className={`txt-md ${activeTab === 'doctor' ? 'active-toggle' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            For Doctor
          </button>
        </div>
      </div>

      <div
        id="app-features-t1"
        className={`app-feature-list ${activeTab === 'user' ? 'active' : 'hidden'}`}
      >
        <h1 className="txt-2xl"> Your Healthcare At Your Fingertips </h1>
        <div className="app-f-cont">
          <div className="stack-container flex-col-even-center">
            <div className="stack flex-row-even-stretch">
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/online-booking.webp" alt="Online Booking" />
                </span>
                <h1 className="txt-md">Easy Appointment Booking</h1>
                <p className="txt-sm">
                  Book skin consultations anytime, anywhere, with a few simple steps.
                </p>
              </div>
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/rescheduling.webp" alt="Rescheduling" />
                </span>
                <h1 className="txt-md">Easy Rescheduling</h1>
                <p className="txt-sm">
                  Modify, cancel, or reschedule your appointment effortlessly without
                  any extra hassle or charges.
                </p>
              </div>
            </div>
            <div className="stack flex-row-even-stretch">
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/flash.webp" alt="Instant Consultation" />
                </span>
                <h1 className="txt-md"> Instant Consultation </h1>
                <p className="txt-sm">
                  Connect with top dermatologists and get expert advice on your skin
                  and hair concerns.
                </p>
              </div>
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/verify.webp" alt="Verified Dermatologists" />
                </span>
                <h1 className="txt-md">Verified Dermatologists </h1>
                <p className="txt-sm">
                  Consult only certified, experienced dermatologists to ensure safe,
                  effective, and trusted care.
                </p>
              </div>
            </div>
          </div>

          <div className="mockup-container mid-center">
            <img src="/assets/appf-user.webp" alt="User App UI" className="floating" />
          </div>
        </div>
      </div>

      <div
        id="app-features-t2"
        className={`app-feature-list ${activeTab === 'doctor' ? 'active' : 'hidden'}`}
      >
        <h1 className="txt-2xl">Reach to More Patients</h1>
        <div className="app-f-cont">
          <div className="stack-container flex-col-even-center">
            <div className="stack flex-row-even-stretch">
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/adjust.webp" alt="Flexible Scheduling" />
                </span>
                <h1 className="txt-md"> Flexible Scheduling </h1>
                <p className="txt-sm">
                  Set your availability, manage appointments, and control your schedule
                  at your convenience.
                </p>
              </div>
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/withdraw.webp" alt="Easy Withdrawal" />
                </span>
                <h1 className="txt-md"> Easy Withdrawal </h1>
                <p className="txt-sm">
                  Withdraw earnings securely and instantly without any complicated
                  processes or long waiting times.
                </p>
              </div>
            </div>
            <div className="stack flex-row-even-stretch">
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/online-meeting.webp" alt="Consult Virtually" />
                </span>
                <h1 className="txt-md"> Consult Patients Virtually </h1>
                <p className="txt-sm">
                  Provide expert skin and hair care through seamless video consultations
                  from anywhere.
                </p>
              </div>
              <div className="app-f">
                <span className="feature-icon-cont mid-center">
                  <img src="/assets/india_loc2.webp" alt="PAN India Presence" />
                </span>
                <h1 className="txt-md"> PAN India Presence </h1>
                <p className="txt-sm">
                  Expand your reach and treat patients from all across India without
                  location barriers.
                </p>
              </div>
            </div>
          </div>
          <div className="mockup-container mid-center">
            <img src="/assets/appf-doc.webp" alt="Doctor App UI" className="floating" />
          </div>
        </div>
      </div>
    </section>
  );
}
