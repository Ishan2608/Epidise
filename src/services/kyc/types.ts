export type KYCDocumentType =
  | 'PAN'
  | 'AADHAAR'
  | 'MEDICAL_REGISTRATION'
  | 'BANK_ACCOUNT';

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'MANUAL_REVIEW';

export interface KYCVerificationInput {
  documentType: KYCDocumentType;
  documentNumber: string;
  additionalData?: Record<string, unknown>;
}

export interface KYCVerificationResult {
  success: boolean;
  referenceId: string;
  status: KYCStatus;
  verifiedData?: Record<string, unknown>;
  errorMessage?: string;
  rawResponse?: unknown;
}
