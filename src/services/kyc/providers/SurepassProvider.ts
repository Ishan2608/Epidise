import { KYCProvider } from '../KYCProvider';
import type { KYCVerificationInput, KYCVerificationResult, KYCDocumentType } from '../types';

const ENDPOINT_MAP: Record<KYCDocumentType, string> = {
  PAN: '/api/v1/pan/verify',
  AADHAAR: '/api/v1/aadhaar/verify',
  MEDICAL_REGISTRATION: '/api/v1/medical-council/verify',
  BANK_ACCOUNT: '/api/v1/bank/verify'
};

export class SurepassProvider extends KYCProvider {
  readonly providerName = 'surepass';

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://kyc-api.surepass.io'
  ) {
    super();
  }

  async verify(input: KYCVerificationInput): Promise<KYCVerificationResult> {
    const endpoint = ENDPOINT_MAP[input.documentType];
    if (!endpoint) {
      return {
        success: false,
        referenceId: '',
        status: 'FAILED',
        errorMessage: `Surepass does not support document type ${input.documentType}`
      };
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        id_number: input.documentNumber,
        ...input.additionalData
      })
    });

    const data = await response.json();

    return this.normalize(data);
  }

  async checkStatus(referenceId: string): Promise<KYCVerificationResult> {
    const response = await fetch(`${this.baseUrl}/api/v1/status/${referenceId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });

    const data = await response.json();

    return this.normalize(data);
  }

  private normalize(data: any): KYCVerificationResult {
    return {
      success: data?.success ?? false,
      referenceId: data?.data?.client_id ?? data?.request_id ?? '',
      status: this.mapStatus(data?.data?.status),
      verifiedData: data?.data,
      rawResponse: data
    };
  }

  private mapStatus(rawStatus: string | undefined): KYCVerificationResult['status'] {
    switch (rawStatus) {
      case 'verified':
      case 'success':
        return 'VERIFIED';
      case 'pending':
        return 'PENDING';
      case 'manual_review':
        return 'MANUAL_REVIEW';
      default:
        return 'FAILED';
    }
  }
}
