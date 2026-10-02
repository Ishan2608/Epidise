import type { KYCVerificationInput, KYCVerificationResult } from './types';

export abstract class KYCProvider {
  abstract readonly providerName: string;

  abstract verify(input: KYCVerificationInput): Promise<KYCVerificationResult>;

  abstract checkStatus(referenceId: string): Promise<KYCVerificationResult>;
}
