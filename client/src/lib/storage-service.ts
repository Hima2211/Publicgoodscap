import PinataClient from '@pinata/sdk';
import axios from 'axios';

export class StorageService {
    private JWT: string;
    private isDev: boolean;

    constructor() {
        this.JWT = import.meta.env.VITE_PINATA_JWT || '';
        this.isDev = import.meta.env.DEV || false;
        
        if (!this.JWT && !this.isDev) {
            throw new Error('Missing Pinata JWT configuration');
        }
    }

    async uploadFile(file: File): Promise<string> {
        if (!this.JWT) {
            if (this.isDev) {
                console.warn('No Pinata JWT found. In development mode, returning mock IPFS hash.');
                return 'QmDevMockHash';
            }
            throw new Error('Pinata JWT is required for file upload');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    'Authorization': `Bearer ${this.JWT}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return res.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw new Error('Failed to upload file to IPFS');
        }
    }

    async storeJSON(data: any) {
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
                headers: {
                    'Authorization': `Bearer ${this.JWT}`,
                    'Content-Type': 'application/json'
                }
            });

            return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
        } catch (error) {
            console.error('Error storing JSON:', error);
            throw error;
        }
    }

    getIpfsUrl(hash: string) {
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }
}

export const storageService = new StorageService();