import { KYCProvider } from '../KYCProvider';
import type { KYCVerificationInput, KYCVerificationResult, KYCDocumentType } from '../types';

const ENDPOINT_MAP: Record<KYCDocumentType, string> = {
  PAN: '/v2/kyc/pan/find',
  AADHAAR: '/v2/kyc/aadhaar/verify',
  MEDICAL_REGISTRATION: '/v2/kyc/medical-council/verify',
  BANK_ACCOUNT: '/v2/kyc/bank/verify'
};

export class DecentroProvider extends KYCProvider {
  readonly providerName = 'decentro';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly baseUrl: string = 'https://in.staging.decentro.tech'
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
        errorMessage: `Decentro does not support document type ${input.documentType}`
      };
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        client_id: this.clientId,
        client_secret: this.clientSecret
      },
      body: JSON.stringify({
        document_id: input.documentNumber,
        ...input.additionalData
      })
    });

    const data = await response.json();

    return this.normalize(data);
  }

  async checkStatus(referenceId: string): Promise<KYCVerificationResult> {
    const response = await fetch(`${this.baseUrl}/v2/kyc/status/${referenceId}`, {
      headers: {
        client_id: this.clientId,
        client_secret: this.clientSecret
      }
    });

    const data = await response.json();

    return this.normalize(data);
  }

  private normalize(data: any): KYCVerificationResult {
    return {
      success: data?.status === 'SUCCESS',
      referenceId: data?.decentroTxnId ?? '',
      status: this.mapStatus(data?.status),
      verifiedData: data?.data,
      rawResponse: data
    };
  }

  private mapStatus(rawStatus: string | undefined): KYCVerificationResult['status'] {
    switch (rawStatus) {
      case 'SUCCESS':
        return 'VERIFIED';
      case 'IN_PROGRESS':
        return 'PENDING';
      case 'NEEDS_REVIEW':
        return 'MANUAL_REVIEW';
      default:
        return 'FAILED';
    }
  }
}
