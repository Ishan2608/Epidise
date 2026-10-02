import { KYCProvider } from './KYCProvider';
import { KYCProviderFactory } from './KYCProviderFactory';
import type { KYCProviderName } from './KYCProviderFactory';
import type { KYCVerificationInput, KYCVerificationResult } from './types';

export class KYCService {
  private readonly provider: KYCProvider;

  constructor(provider?: KYCProvider) {
    this.provider = provider ?? KYCProviderFactory.create(
      (import.meta.env.VITE_KYC_PROVIDER as KYCProviderName) ?? 'surepass'
    );
  }

  verifyDocument(input: KYCVerificationInput): Promise<KYCVerificationResult> {
    return this.provider.verify(input);
  }

  getVerificationStatus(referenceId: string): Promise<KYCVerificationResult> {
    return this.provider.checkStatus(referenceId);
  }
}
