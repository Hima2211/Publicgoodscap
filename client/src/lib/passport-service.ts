import { 
  PassportSDK, 
  PassportProvider, 
  Credential 
} from '@passportdao/passport-sdk';
import { LensProvider } from '@passportdao/provider-lens';
import { ENSProvider } from '@passportdao/provider-ens';
import { POAPProvider } from '@passportdao/provider-poap';
import { CoinbaseProvider } from '@passportdao/provider-coinbase';

export class PassportService {
    private reader: PassportReader;
    private verifier: PassportVerifier;
    private scorerId: string;

    constructor() {
        this.reader = new PassportReader('https://api.passport.gitcoin.xyz');
        this.verifier = new PassportVerifier();
        this.scorerId = process.env.NEXT_PUBLIC_GITCOIN_SCORER_ID || '';
    }

    async getPassportScore(address: string): Promise<Score | null> {
        try {
            return await this.reader.getScore(this.scorerId, address);
        } catch (error) {
            console.error('Error fetching Passport score:', error);
            return null;
        }
    }

    async getPassportStamps(address: string): Promise<Stamp[]> {
        try {
            const passport: Passport = await this.reader.getPassport(address);
            return passport?.stamps || [];
        } catch (error) {
            console.error('Error fetching Passport stamps:', error);
            return [];
        }
    }

    async verifyPassport(address: string): Promise<{
        isVerified: boolean;
        score: number;
        stamps: Stamp[];
    }> {
        const [score, stamps] = await Promise.all([
            this.getPassportScore(address),
            this.getPassportStamps(address)
        ]);

        return {
            isVerified: score !== null && score.score >= 15,
            score: score?.score || 0,
            stamps
        };
    }

    getStampCategories(stamps: Stamp[]): Record<string, number> {
        const categories: Record<string, number> = {
            'Social Media': 0,
            'Web3 Activity': 0,
            'Identity': 0,
            'Financial': 0,
            'Education': 0,
        };

        stamps.forEach(stamp => {
            switch (stamp.provider) {
                case 'Twitter':
                case 'Facebook':
                case 'LinkedIn':
                case 'Lens':
                    categories['Social Media']++;
                    break;
                case 'ETH':
                case 'POAP':
                case 'NFT':
                case 'Ens':
                    categories['Web3 Activity']++;
                    break;
                case 'Google':
                case 'Email':
                case 'Phone':
                case 'Brightid':
                    categories['Identity']++;
                    break;
                case 'Coinbase':
                case 'Binance':
                case 'Uniswap':
                case 'Gitcoin':
                    categories['Financial']++;
                    break;
                case 'Github':
                case 'Discord':
                case 'GuildXYZ':
                    categories['Education']++;
                    break;
            }
        });

        return categories;
    }
}
