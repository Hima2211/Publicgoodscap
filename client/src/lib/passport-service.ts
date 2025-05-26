// Mock types for Passport service
interface Score {
  score: number;
}

interface Stamp {
  credential: {
    type: string;
  };
}

export class PassportService {
    constructor() {
        console.log('Using mock Passport service');
    }

    async getPassportScore(address: string): Promise<Score | null> {
        return { score: 0 };
    }

    async getPassportStamps(address: string): Promise<Stamp[]> {
        return [];
    }

    async verifyPassport(address: string): Promise<{ 
        isVerified: boolean;
        score: number;
        stamps: Stamp[];
    }> {
        return {
            isVerified: false,
            score: 0,
            stamps: []
        };
    }

    getStampCategories(stamps: Stamp[]): string[] {
        return [];
    }
}
