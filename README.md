Doctor Oboarding Flow Implementation in terms of Frontend Files and Elements:

**Page 1 — `/for-doctors` (Signup / Login)**
- Function: entry point for new and returning doctors.
- Elements: tab or toggle (Signup / Login), Signup = Step 1–3 flow (account details, photo, password) already reviewed, Login = email/phone + password, OTP verification on signup.
- Protection: public, no auth required. Redirect away if already authenticated (see redirect logic below).

**Page 2 — `/for-doctors/kyc`**
- Function: identity + credential verification via Surepass/Decentro (Aadhaar/PAN, medical registration, qualification docs, practice address).
- Elements: multi-set KYC form (per document type), upload fields, live status indicator (Pending / Verified / Manual Review / Failed), resume-from-last-step support.
- Protection: authenticated only. Redirect to Page 1 if not logged in. Redirect to Page 4 if KYC already verified.

**Page 3 — `/for-doctors/profile-setup`**
- Function: collect fields Discover/booking depend on that aren't KYC data — specialization, area of specialization, languages spoken, gender, consultation fee, city/state/postal code (if not already captured at signup).
- Elements: form matching your filter schema exactly (dropdowns for specialization/gender to avoid free-text mismatches you already hit with city/language).
- Protection: authenticated + KYC verified only. Redirect to Page 2 if KYC incomplete. Redirect to Page 4 if profile already complete.

**Page 4 — `/for-doctors/dashboard`**
- Function: doctor's home base post-onboarding — view bookings, edit profile, view KYC status.
- Elements: appointment list, profile edit access, earnings/consultation stats (future scope).
- Protection: authenticated + KYC verified + profile complete only. Any doctor missing a prior step gets redirected to the relevant incomplete page, not shown a broken dashboard.

**Redirect/state matrix (applies globally, not per-page):**

| State | Lands on |
|---|---|
| Not authenticated | Page 1 |
| Authenticated, no KYC | Page 2 |
| Authenticated, KYC pending/manual review | Page 2 (status view) |
| Authenticated, KYC verified, profile incomplete | Page 3 |
| Authenticated, KYC verified, profile complete | Page 4 |
