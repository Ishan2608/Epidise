import { KYCProvider } from './KYCProvider';
import { SurepassProvider } from './providers/SurepassProvider';
import { DecentroProvider } from './providers/DecentroProvider';

export type KYCProviderName = 'surepass' | 'decentro';

export class KYCProviderFactory {
  static create(providerName: KYCProviderName): KYCProvider {
    switch (providerName) {
      case 'surepass':
        return new SurepassProvider(
          import.meta.env.VITE_SUREPASS_API_KEY as string,
          import.meta.env.VITE_SUREPASS_BASE_URL
        );
      case 'decentro':
        return new DecentroProvider(
          import.meta.env.VITE_DECENTRO_CLIENT_ID as string,
          import.meta.env.VITE_DECENTRO_CLIENT_SECRET as string,
          import.meta.env.VITE_DECENTRO_BASE_URL
        );
      default:
        throw new Error(`Unknown KYC provider: ${providerName}`);
    }
  }
}
