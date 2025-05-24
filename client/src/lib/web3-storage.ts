import { Web3Storage } from 'web3.storage';
import { ethers } from 'ethers';

export class Web3StorageService {
  private client: Web3Storage;
  private profileContract: ethers.Contract;

  constructor(token: string, contractAddress: string, contractABI: any) {
    this.client = new Web3Storage({ token });
    
    // Get the Ethereum provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Initialize the contract
    this.profileContract = new ethers.Contract(contractAddress, contractABI, signer);
  }

  async uploadProfileData(profileData: any) {
    // Convert profile data to a Buffer
    const buffer = Buffer.from(JSON.stringify(profileData));
    const files = [
      new File([buffer], 'profile.json')
    ];

    // Upload to IPFS
    const cid = await this.client.put(files);
    
    // Update profile in smart contract
    const tx = await this.profileContract.updateProfile(cid);
    await tx.wait();

    return cid;
  }

  async uploadProfileImage(imageFile: File) {
    const files = [imageFile];
    const cid = await this.client.put(files);
    return cid;
  }

  async getProfileData(address: string) {
    // Get profile CID from smart contract
    const profile = await this.profileContract.getProfile(address);
    const ipfsHash = profile.ipfsHash;

    // Fetch from IPFS
    const res = await this.client.get(ipfsHash);
    if (!res) throw new Error('Profile not found');

    const files = await res.files();
    const file = files[0];
    const content = await file.text();

    return {
      ...JSON.parse(content),
      followers: profile.followersCount.toNumber(),
      following: profile.followingCount.toNumber(),
      points: profile.totalPoints.toNumber(),
      createdAt: profile.createdAt.toNumber(),
      updatedAt: profile.updatedAt.toNumber()
    };
  }

  async followUser(address: string) {
    const tx = await this.profileContract.followUser(address);
    await tx.wait();
  }

  async unfollowUser(address: string) {
    const tx = await this.profileContract.unfollowUser(address);
    await tx.wait();
  }
}
