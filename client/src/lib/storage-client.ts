import axios from 'axios';
import { PinataClient } from '@pinata/sdk';

const STORCHA_ENDPOINT = process.env.NEXT_PUBLIC_STORCHA_ENDPOINT;
const STORCHA_API_KEY = process.env.NEXT_PUBLIC_STORCHA_API_KEY;

const PINATA_API_KEY = '14481a03271a66b806d6';
const PINATA_SECRET_KEY = '60d1e55395cc1f08a577310e1f763431a290e99cb1375f3f55cdeb014ca1cf9e';

if (!STORCHA_ENDPOINT || !STORCHA_API_KEY) {
  throw new Error('Missing Storcha Network configuration');
}

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  throw new Error('Missing Pinata configuration');
}

const storageClient = axios.create({
  baseURL: STORCHA_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${STORCHA_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const pinata = new PinataClient({ 
  pinataApiKey: PINATA_API_KEY, 
  pinataSecretApiKey: PINATA_SECRET_KEY 
});

export async function uploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await storageClient.post('/v1/upload', formData);
    return response.data.cid;
  } catch (error) {
    console.error('Error uploading to Storcha:', error);
    throw error;
  }
}

export async function storeJSON(data: any) {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const file = new File([blob], 'data.json');
    return await uploadFile(file);
  } catch (error) {
    console.error('Error storing JSON on Storcha:', error);
    throw error;
  }
}

export function getStorageUrl(cid: string) {
  return `${STORCHA_ENDPOINT}/ipfs/${cid}`;
}

export async function uploadFileToPinata(file: File) {
  try {
    const result = await pinata.pinFileToIPFS(file);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}

export async function storeJSONToPinata(data: any) {
  try {
    const result = await pinata.pinJSONToIPFS(data);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error storing JSON on Pinata:', error);
    throw error;
  }
}

export function getIpfsUrl(hash: string) {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}