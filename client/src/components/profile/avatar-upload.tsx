import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';

export function AvatarUpload() {
  const { user, updateUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create Web3Storage instance
      const web3Storage = new Web3Storage(process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || '');
      
      // Upload file to IPFS
      const cid = await web3Storage.put([file]);
      const avatarUrl = `https://${cid}.ipfs.dweb.link/${file.name}`;
      
      // Update user profile with new avatar URL
      await updateUserProfile({ avatar_url: avatarUrl });
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar
        src={user?.avatar_url}
        fallback={user?.name?.[0] || user?.address?.slice(0, 2) || '?'}
        className="w-20 h-20"
      />
      <div>
        <label htmlFor="avatar-upload">
          <Button
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {uploading ? 'Uploading...' : 'Change Avatar'}
            </span>
          </Button>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
